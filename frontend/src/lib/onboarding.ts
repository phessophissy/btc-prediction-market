/**
 * OnboardingFlow module (PR 85)
 * Provides onboarding flow capabilities for the prediction market platform
 */

export interface OnboardingFlowConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: OnboardingFlowConfig = { enabled: true, threshold: 85, maxRetries: 3, timeoutMs: 5000 };

export type OnboardingFlowResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };

export class OnboardingFlowHandler {
  private config: OnboardingFlowConfig;
  private processedCount = 0;
  private errorCount = 0;

  constructor(config: OnboardingFlowConfig = DEFAULT_CONFIG) {
    this.config = { ...config };
  }

  getStats() {
    const total = this.processedCount + this.errorCount;
    return { processed: this.processedCount, errors: this.errorCount, ratio: total > 0 ? this.processedCount / total : 0 };
  }

  isHealthy(): boolean { return this.getStats().ratio >= 0.95; }

  async process<T>(input: T): Promise<OnboardingFlowResult<T>> {
    if (!this.config.enabled) return { success: false, error: 'Disabled', timestamp: Date.now() };
    try {
      this.processedCount++;
      return { success: true, data: input, timestamp: Date.now() };
    } catch (err) {
      this.errorCount++;
      return { success: false, error: err instanceof Error ? err.message : String(err), timestamp: Date.now() };
    }
  }

  async processBatch<T>(inputs: T[]): Promise<OnboardingFlowResult<T>[]> {
    return Promise.all(inputs.map(i => this.process(i)));
  }

  validate(input: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (input === null || input === undefined) errors.push('Input required');
    if (typeof input === 'string' && input.length > 1024) errors.push('Exceeds max length');
    if (typeof input === 'number' && !Number.isFinite(input)) errors.push('Must be finite');
    return { valid: errors.length === 0, errors };
  }

  private cache = new Map<string, { value: unknown; expiresAt: number }>();

  getCached<T>(key: string): T | undefined {
    const e = this.cache.get(key);
    if (!e) return undefined;
    if (Date.now() > e.expiresAt) { this.cache.delete(key); return undefined; }
    return e.value as T;
  }

  setCached<T>(key: string, value: T, ttlMs = 60000): void {
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  clearCache(): void { this.cache.clear(); }
