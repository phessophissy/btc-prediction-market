// Market types and interfaces
export interface Market {
  id: number;
  creator: string;
  title: string;
  description: string;
  settlementBurnHeight: number;
  isSettled: boolean;
  winningOutcome: number | null;
  createdAt: number;
  totalPool: number;
  marketType: 'binary' | 'multi';
  outcomeCount: number;
}

export interface Outcome {
  id: number;
  label: string;
  pool: number;
  odds: number;
}

export interface UserPosition {
  userId: string;
  marketId: number;
  outcomeId: number;
  amount: number;
  potentialPayout: number;
}

export interface MarketStats {
  totalMarkets: number;
  activeMarkets: number;
  settledMarkets: number;
  totalVolume: number;
  totalUsers: number;
  averageBetSize: number;
}

export interface MarketHistoricalData {
  timestamp: number;
  totalPool: number;
  outcomeOdds: number[];
  betCount: number;
}
