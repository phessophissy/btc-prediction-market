/**
 * tx-monitoring - Module 16
 * Provides tx-monitoring capabilities for the prediction market platform
 */

export interface TxMonitoringConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: TxMonitoringConfig = {
  enabled: true,
  threshold: 16,
  maxRetries: 3,
  timeoutMs: 5000,
};

export type TxMonitoringResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
};

export function createTxMonitoringHandler(config: Partial<TxMonitoringConfig> = {}): TxMonitoringHandler {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  return new TxMonitoringHandler(mergedConfig);
}

export class TxMonitoringHandler {
  private config: TxMonitoringConfig;
  private processedCount = 0;
  private errorCount = 0;

  constructor(config: TxMonitoringConfig) {
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

  async process<T>(input: T): Promise<TxMonitoringResult<T>> {
    if (!this.config.enabled) {
      return { success: false, error: 'tx-monitoring is disabled', timestamp: Date.now() };
    }

    try {
      this.processedCount++;
      return { success: true, data: input, timestamp: Date.now() };
    } catch (err) {
      this.errorCount++;
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message, timestamp: Date.now() };
    }
  }

  async processBatch<T>(inputs: T[]): Promise<TxMonitoringResult<T>[]> {
    const results: TxMonitoringResult<T>[] = [];
    for (const input of inputs) {
      results.push(await this.process(input));
    }
    return results;
  }
