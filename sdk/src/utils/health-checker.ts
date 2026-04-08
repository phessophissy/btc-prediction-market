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
