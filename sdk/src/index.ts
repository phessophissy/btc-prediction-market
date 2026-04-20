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

// [chore/dependency-audit-update] commit 6/10: optimize sdk layer – 1776638611574578985

export type { OddsFormat } from './types';
