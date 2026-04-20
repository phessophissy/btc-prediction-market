export type OutcomeFlag = 1 | 2 | 4 | 8;

export interface Market {
  id: number;
  creator: string;
  title: string;
  description: string;
  settlementBurnHeight: number;
  settlementType: string;
  possibleOutcomes: number;
  totalPool: number;
  outcomeAPool: number;
  outcomeBPool: number;
  outcomeCPool: number;
  outcomeDPool: number;
  winningOutcome: OutcomeFlag | null;
  settled: boolean;
  settledAtBurnHeight: number | null;
  settlementBlockHash: string | null;
  createdAtBurnHeight: number;
  createdAtStacksHeight: number;
}

export interface UserPosition {
  marketId: number;
  userAddress: string;
  outcomeAAmount: number;
  outcomeBAmount: number;
  outcomeCAmount: number;
  outcomeDAmount: number;
  totalInvested: number;
  claimed: boolean;
}

// [chore/dependency-audit-update] commit 6/10: optimize sdk layer – 1776638611571524501

export type FeeTier = 'standard' | 'reduced' | 'premium';

export interface FeeConfig {
  tier: FeeTier;
  basisPoints: number;
  minBetMicrostx: number;
}

export interface MarketFeeInfo {
  marketId: number;
  tier: FeeTier;
  totalFeesCollected: number;
  lastUpdated: number;
}
