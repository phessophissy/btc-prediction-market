/**
 * GasEstimation module (PR 75)
 * Provides gas estimation capabilities for the prediction market platform
 */

export interface GasEstimationConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: GasEstimationConfig = { enabled: true, threshold: 75, maxRetries: 3, timeoutMs: 5000 };

export type GasEstimationResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };

export class GasEstimationHandler {
  private config: GasEstimationConfig;
  private processedCount = 0;
  private errorCount = 0;

  constructor(config: GasEstimationConfig = DEFAULT_CONFIG) {
    this.config = { ...config };
  }

  getStats() {
    const total = this.processedCount + this.errorCount;
    return { processed: this.processedCount, errors: this.errorCount, ratio: total > 0 ? this.processedCount / total : 0 };
  }

  isHealthy(): boolean { return this.getStats().ratio >= 0.95; }
