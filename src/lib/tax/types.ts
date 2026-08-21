export interface GainInfo {
  balance: number;
  gain: number;
}

export interface Holding {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: GainInfo;
  ltcg: GainInfo;
}

export interface CapitalGainsBucket {
  profits: number;
  losses: number;
}

export interface CapitalGains {
  stcg: CapitalGainsBucket;
  ltcg: CapitalGainsBucket;
}

export interface CapitalGainsResponse {
  capitalGains: CapitalGains;
}
