import MarketContractService from './MarketContractService';
export * from './types';
export * from './MarketContractService';
export { MarketContractService };

// Export a factory function for easy SDK initialization
export function initializeMarketSDK(
  contractAddress: string,
  isMainnet: boolean = false
): MarketContractService {
  return new MarketContractService(contractAddress, isMainnet);
}
