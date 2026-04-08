/**
 * health-check - Module 25
 * Provides health-check capabilities for the prediction market platform
 */

export interface HealthCheckConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: HealthCheckConfig = {
  enabled: true,
  threshold: 25,
  maxRetries: 3,
  timeoutMs: 5000,
};

export type HealthCheckResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
};

export function createHealthCheckHandler(config: Partial<HealthCheckConfig> = {}): HealthCheckHandler {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  return new HealthCheckHandler(mergedConfig);
}

export class HealthCheckHandler {
  private config: HealthCheckConfig;
  private processedCount = 0;
  private errorCount = 0;

  constructor(config: HealthCheckConfig) {
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

  async process<T>(input: T): Promise<HealthCheckResult<T>> {
    if (!this.config.enabled) {
      return { success: false, error: 'health-check is disabled', timestamp: Date.now() };
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

  async processBatch<T>(inputs: T[]): Promise<HealthCheckResult<T>[]> {
    const results: HealthCheckResult<T>[] = [];
    for (const input of inputs) {
      results.push(await this.process(input));
    }
    return results;
  }
