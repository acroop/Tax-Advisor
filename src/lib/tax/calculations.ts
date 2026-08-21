import type { CapitalGains, Holding } from "./types";

export const netGains = (gains: CapitalGains) => {
  const stcg = gains.stcg.profits - gains.stcg.losses;
  const ltcg = gains.ltcg.profits - gains.ltcg.losses;
  return { stcg, ltcg, realised: stcg + ltcg };
};

/**
 * Applies the selected holdings' gains on top of the pre-harvest capital gains.
 * Positive gains increase profits, negative gains increase losses (absolute value).
 */
export const applyHarvesting = (
  base: CapitalGains,
  holdings: Holding[],
  selectedKeys: Set<string>,
  keyOf: (h: Holding, i: number) => string,
): CapitalGains => {
  const result: CapitalGains = {
    stcg: { ...base.stcg },
    ltcg: { ...base.ltcg },
  };

  holdings.forEach((holding, index) => {
    if (!selectedKeys.has(keyOf(holding, index))) return;

    if (holding.stcg.gain > 0) result.stcg.profits += holding.stcg.gain;
    else result.stcg.losses += Math.abs(holding.stcg.gain);

    if (holding.ltcg.gain > 0) result.ltcg.profits += holding.ltcg.gain;
    else result.ltcg.losses += Math.abs(holding.ltcg.gain);
  });

  return result;
};

const inr = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (value: number) => {
  const sign = value < 0 ? "- " : "";
  return `${sign}$ ${inr.format(Math.abs(value))}`;
};

export const formatSignedCurrency = (value: number) => {
  if (value === 0) return "$ 0.00";
  return `${value > 0 ? "+" : "-"} $ ${inr.format(Math.abs(value))}`;
};

export const formatAmount = (value: number, coin: string) => {
  const abs = Math.abs(value);
  const digits = abs === 0 ? 0 : abs < 0.0001 ? 8 : abs < 1 ? 6 : abs < 1000 ? 4 : 2;
  return `${value.toLocaleString("en-IN", { maximumFractionDigits: digits })} ${coin}`;
};

export const formatPrice = (value: number) => {
  const digits = Math.abs(value) < 1 ? 8 : 2;
  return `$ ${value.toLocaleString("en-IN", { maximumFractionDigits: digits })}`;
};
