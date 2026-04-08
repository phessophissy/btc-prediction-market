/**
 * nonce-management - Module 22
 * Provides nonce-management capabilities for the prediction market platform
 */

export interface NonceManagementConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: NonceManagementConfig = {
  enabled: true,
  threshold: 22,
  maxRetries: 3,
  timeoutMs: 5000,
};

export type NonceManagementResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
};

export function createNonceManagementHandler(config: Partial<NonceManagementConfig> = {}): NonceManagementHandler {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  return new NonceManagementHandler(mergedConfig);
}

export class NonceManagementHandler {
  private config: NonceManagementConfig;
  private processedCount = 0;
  private errorCount = 0;

  constructor(config: NonceManagementConfig) {
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

  async process<T>(input: T): Promise<NonceManagementResult<T>> {
    if (!this.config.enabled) {
      return { success: false, error: 'nonce-management is disabled', timestamp: Date.now() };
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

  async processBatch<T>(inputs: T[]): Promise<NonceManagementResult<T>[]> {
    const results: NonceManagementResult<T>[] = [];
    for (const input of inputs) {
      results.push(await this.process(input));
    }
    return results;
  }

  validate(input: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (input === null || input === undefined) {
      errors.push('Input cannot be null or undefined');
    }

    if (typeof input === 'string' && input.length > 1024) {
      errors.push('Input exceeds maximum length of 1024 characters');
    }

    if (typeof input === 'number' && !Number.isFinite(input)) {
      errors.push('Numeric input must be finite');
    }

    return { valid: errors.length === 0, errors };
  }
