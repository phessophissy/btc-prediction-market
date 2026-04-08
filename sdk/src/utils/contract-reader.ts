/**
 * ContractReader module (PR 79)
 * Provides contract reader capabilities for the prediction market platform
 */

export interface ContractReaderConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: ContractReaderConfig = { enabled: true, threshold: 79, maxRetries: 3, timeoutMs: 5000 };

export type ContractReaderResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };

export class ContractReaderHandler {
  private config: ContractReaderConfig;
  private processedCount = 0;
  private errorCount = 0;

  constructor(config: ContractReaderConfig = DEFAULT_CONFIG) {
    this.config = { ...config };
  }

  getStats() {
    const total = this.processedCount + this.errorCount;
    return { processed: this.processedCount, errors: this.errorCount, ratio: total > 0 ? this.processedCount / total : 0 };
  }

  isHealthy(): boolean { return this.getStats().ratio >= 0.95; }
