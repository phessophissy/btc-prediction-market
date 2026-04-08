/**
 * market-filtering - Module 18
 * Provides market-filtering capabilities for the prediction market platform
 */

export interface MarketFilteringConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: MarketFilteringConfig = {
  enabled: true,
  threshold: 18,
  maxRetries: 3,
  timeoutMs: 5000,
};

export type MarketFilteringResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
};
