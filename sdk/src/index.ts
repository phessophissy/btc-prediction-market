import MarketContractService from './MarketContractService';
export * from './types';
export * from './MarketContractService';
export * from './utils/validation-50';
export { MarketContractService };

// Export a factory function for easy SDK initialization
export function initializeMarketSDK(
  contractAddress: string,
  isMainnet: boolean = false,
  contractName: string = 'btc-prediction-market-v4'
): MarketContractService {
  return new MarketContractService(contractAddress, isMainnet, contractName);
}


export type { LeaderboardEntry } from './types';
export { buildLeaderboard } from './utils/market-aggregator';
export { calculateROI, calculateWinScore } from './utils/analytics';
export * from './utils/rate-limiter';
export * from './utils/market-status';
