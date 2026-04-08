/**
 * KeyboardNav module (PR 118)
 * Provides keyboard nav capabilities for the prediction market platform
 */

export interface KeyboardNavConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: KeyboardNavConfig = { enabled: true, threshold: 118, maxRetries: 3, timeoutMs: 5000 };

export type KeyboardNavResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };

export class KeyboardNavHandler {
  private config: KeyboardNavConfig;
  private processedCount = 0;
  private errorCount = 0;

  constructor(config: KeyboardNavConfig = DEFAULT_CONFIG) {
    this.config = { ...config };
  }

  getStats() {
    const total = this.processedCount + this.errorCount;
    return { processed: this.processedCount, errors: this.errorCount, ratio: total > 0 ? this.processedCount / total : 0 };
  }

  isHealthy(): boolean { return this.getStats().ratio >= 0.95; }
