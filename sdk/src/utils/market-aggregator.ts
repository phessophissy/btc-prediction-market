/**
 * MarketAggregator module (PR 80)
 * Provides market aggregator capabilities for the prediction market platform
 */

export interface MarketAggregatorConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: MarketAggregatorConfig = { enabled: true, threshold: 80, maxRetries: 3, timeoutMs: 5000 };

export type MarketAggregatorResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };
