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

// [docs/deployment-playbook] commit 6/10: optimize sdk layer – 1776638549957393332
