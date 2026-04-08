/**
 * rate-limiting - Module 15
 * Provides rate-limiting capabilities for the prediction market platform
 */

export interface RateLimitingConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: RateLimitingConfig = {
  enabled: true,
  threshold: 15,
  maxRetries: 3,
  timeoutMs: 5000,
};

export type RateLimitingResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
};

export function createRateLimitingHandler(config: Partial<RateLimitingConfig> = {}): RateLimitingHandler {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  return new RateLimitingHandler(mergedConfig);
}

export class RateLimitingHandler {
  private config: RateLimitingConfig;
  private processedCount = 0;
  private errorCount = 0;

  constructor(config: RateLimitingConfig) {
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
