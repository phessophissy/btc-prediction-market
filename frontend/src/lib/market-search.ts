/**
 * market-search - Module 24
 * Provides market-search capabilities for the prediction market platform
 */

export interface MarketSearchConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: MarketSearchConfig = {
  enabled: true,
  threshold: 24,
  maxRetries: 3,
  timeoutMs: 5000,
};

export type MarketSearchResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
};
