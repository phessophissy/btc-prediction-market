/**
 * market-filtering - Module 18
 * Provides market-filtering capabilities for the prediction market platform
 */

export interface MarketFilteringConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: MarketFilteringConfig = {
  enabled: true,
  threshold: 18,
  maxRetries: 3,
  timeoutMs: 5000,
};

export type MarketFilteringResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
};

export function createMarketFilteringHandler(config: Partial<MarketFilteringConfig> = {}): MarketFilteringHandler {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  return new MarketFilteringHandler(mergedConfig);
}

export class MarketFilteringHandler {
  private config: MarketFilteringConfig;
  private processedCount = 0;
  private errorCount = 0;

  constructor(config: MarketFilteringConfig) {
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

  async process<T>(input: T): Promise<MarketFilteringResult<T>> {
    if (!this.config.enabled) {
      return { success: false, error: 'market-filtering is disabled', timestamp: Date.now() };
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

  async processBatch<T>(inputs: T[]): Promise<MarketFilteringResult<T>[]> {
    const results: MarketFilteringResult<T>[] = [];
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

  private cache = new Map<string, { value: unknown; expiresAt: number }>();

  getCached<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  setCached<T>(key: string, value: T, ttlMs: number = 60000): void {
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  clearCache(): void {
    this.cache.clear();
  }

  private listeners: Array<(event: string, data: unknown) => void> = [];

  on(callback: (event: string, data: unknown) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private emit(event: string, data: unknown): void {
    for (const listener of this.listeners) {
      try {
        listener(event, data);
      } catch {
        // listener errors should not break the handler
      }
    }
  }

  async withRetry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = this.config.maxRetries
  ): Promise<T> {
    let lastError: Error | undefined;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await fn();
        this.emit('retry:success', { attempt });
        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        this.emit('retry:failure', { attempt, error: lastError.message });
        if (attempt < maxAttempts) {
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
        }
      }
    }
    throw lastError!;
  }

  private metrics: Array<{ operation: string; durationMs: number; timestamp: number }> = [];

  recordMetric(operation: string, durationMs: number): void {
    this.metrics.push({ operation, durationMs, timestamp: Date.now() });
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500);
    }
  }

  getAverageDuration(operation?: string): number {
    const filtered = operation
      ? this.metrics.filter(m => m.operation === operation)
      : this.metrics;
    if (filtered.length === 0) return 0;
    const total = filtered.reduce((sum, m) => sum + m.durationMs, 0);
    return total / filtered.length;
  }
