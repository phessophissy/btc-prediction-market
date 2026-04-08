/**
 * bet-history - Module 23
 * Provides bet-history capabilities for the prediction market platform
 */

export interface BetHistoryConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: BetHistoryConfig = {
  enabled: true,
  threshold: 23,
  maxRetries: 3,
  timeoutMs: 5000,
};

export type BetHistoryResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
};

export function createBetHistoryHandler(config: Partial<BetHistoryConfig> = {}): BetHistoryHandler {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  return new BetHistoryHandler(mergedConfig);
}

export class BetHistoryHandler {
  private config: BetHistoryConfig;
  private processedCount = 0;
  private errorCount = 0;

  constructor(config: BetHistoryConfig) {
    this.config = config;
  }

  getStats(): { processed: number; errors: number; ratio: number } {
    const total = this.processedCount + this.errorCount;
    return {
      processed: this.processedCount,
      errors: this.errorCount,
      ratio: total > 0 ? this.processedCount / total : 0,
    };
  }

  isHealthy(): boolean {
    const stats = this.getStats();
    return stats.ratio >= 0.95;
  }
