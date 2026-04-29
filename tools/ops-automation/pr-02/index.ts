export type WalletRow = {
  address: string;
  privateKey?: string;
  name?: string;
};

export type Outcome = 'outcome-a' | 'outcome-b';
export * from './normalize-wallet-rows';
export * from './group-bets-by-outcome';
export * from './compute-fee-aware-budget';
export * from './format-broadcast-report';
export * from './build-retry-candidates';
