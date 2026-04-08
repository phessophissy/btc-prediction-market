/**
 * ChartData module (PR 81)
 * Provides chart data capabilities for the prediction market platform
 */

export interface ChartDataConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: ChartDataConfig = { enabled: true, threshold: 81, maxRetries: 3, timeoutMs: 5000 };

export type ChartDataResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };

export class ChartDataHandler {
  private config: ChartDataConfig;
  private processedCount = 0;
  private errorCount = 0;

  constructor(config: ChartDataConfig = DEFAULT_CONFIG) {
    this.config = { ...config };
  }

  getStats() {
    const total = this.processedCount + this.errorCount;
    return { processed: this.processedCount, errors: this.errorCount, ratio: total > 0 ? this.processedCount / total : 0 };
  }

  isHealthy(): boolean { return this.getStats().ratio >= 0.95; }

  async process<T>(input: T): Promise<ChartDataResult<T>> {
    if (!this.config.enabled) return { success: false, error: 'Disabled', timestamp: Date.now() };
    try {
      this.processedCount++;
      return { success: true, data: input, timestamp: Date.now() };
    } catch (err) {
      this.errorCount++;
      return { success: false, error: err instanceof Error ? err.message : String(err), timestamp: Date.now() };
    }
  }

  async processBatch<T>(inputs: T[]): Promise<ChartDataResult<T>[]> {
    return Promise.all(inputs.map(i => this.process(i)));
  }
