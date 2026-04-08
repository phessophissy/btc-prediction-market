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

export class MarketAggregatorHandler {
  private config: MarketAggregatorConfig;
  private processedCount = 0;
  private errorCount = 0;

  constructor(config: MarketAggregatorConfig = DEFAULT_CONFIG) {
    this.config = { ...config };
  }

  getStats() {
    const total = this.processedCount + this.errorCount;
    return { processed: this.processedCount, errors: this.errorCount, ratio: total > 0 ? this.processedCount / total : 0 };
  }

  isHealthy(): boolean { return this.getStats().ratio >= 0.95; }
