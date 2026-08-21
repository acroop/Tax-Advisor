import { holdingsData } from "./holdings-data";
import type { CapitalGainsResponse, Holding } from "./types";

const LATENCY = 700;

const delay = <T,>(data: T, ms = LATENCY): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

/** Mock Holdings API */
export const fetchHoldings = async (): Promise<Holding[]> => {
  const data = await delay(holdingsData);
  // Sorted by absolute short-term gain, descending (largest harvesting impact first).
  return [...data].sort((a, b) => Math.abs(b.stcg.gain) - Math.abs(a.stcg.gain));
};

/** Mock Capital Gains API */
export const fetchCapitalGains = async (): Promise<CapitalGainsResponse> =>
  delay({
    capitalGains: {
      stcg: { profits: 70200.88, losses: 1548.53 },
      ltcg: { profits: 5020, losses: 3050 },
    },
  });
