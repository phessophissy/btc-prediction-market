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

  async process<T>(input: T): Promise<ContractReaderResult<T>> {
    if (!this.config.enabled) return { success: false, error: 'Disabled', timestamp: Date.now() };
    try {
      this.processedCount++;
      return { success: true, data: input, timestamp: Date.now() };
    } catch (err) {
      this.errorCount++;
      return { success: false, error: err instanceof Error ? err.message : String(err), timestamp: Date.now() };
    }
  }

  async processBatch<T>(inputs: T[]): Promise<ContractReaderResult<T>[]> {
    return Promise.all(inputs.map(i => this.process(i)));
  }

  validate(input: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (input === null || input === undefined) errors.push('Input required');
    if (typeof input === 'string' && input.length > 1024) errors.push('Exceeds max length');
    if (typeof input === 'number' && !Number.isFinite(input)) errors.push('Must be finite');
    return { valid: errors.length === 0, errors };
  }
