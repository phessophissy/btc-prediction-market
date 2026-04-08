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
