/**
 * SocialSharing module (PR 82)
 * Provides social sharing capabilities for the prediction market platform
 */

export interface SocialSharingConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: SocialSharingConfig = { enabled: true, threshold: 82, maxRetries: 3, timeoutMs: 5000 };

export type SocialSharingResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };

export class SocialSharingHandler {
  private config: SocialSharingConfig;
  private processedCount = 0;
  private errorCount = 0;

  constructor(config: SocialSharingConfig = DEFAULT_CONFIG) {
    this.config = { ...config };
  }

  getStats() {
    const total = this.processedCount + this.errorCount;
    return { processed: this.processedCount, errors: this.errorCount, ratio: total > 0 ? this.processedCount / total : 0 };
  }

  isHealthy(): boolean { return this.getStats().ratio >= 0.95; }

  async process<T>(input: T): Promise<SocialSharingResult<T>> {
    if (!this.config.enabled) return { success: false, error: 'Disabled', timestamp: Date.now() };
    try {
      this.processedCount++;
      return { success: true, data: input, timestamp: Date.now() };
    } catch (err) {
      this.errorCount++;
      return { success: false, error: err instanceof Error ? err.message : String(err), timestamp: Date.now() };
    }
  }

  async processBatch<T>(inputs: T[]): Promise<SocialSharingResult<T>[]> {
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

  private listeners: Array<(event: string, data: unknown) => void> = [];

  on(cb: (event: string, data: unknown) => void): () => void {
    this.listeners.push(cb);
    return () => { this.listeners = this.listeners.filter(l => l !== cb); };
  }

  private emit(event: string, data: unknown): void {
    for (const l of this.listeners) { try { l(event, data); } catch {} }
  }

  async withRetry<T>(fn: () => Promise<T>, maxAttempts = this.config.maxRetries): Promise<T> {
    let last: Error | undefined;
    for (let i = 1; i <= maxAttempts; i++) {
      try {
        const r = await fn();
        this.emit('retry:ok', { attempt: i });
        return r;
      } catch (e) {
        last = e instanceof Error ? e : new Error(String(e));
        this.emit('retry:fail', { attempt: i, error: last.message });
        if (i < maxAttempts) await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i - 1)));
      }
    }
    throw last!;
  }

  private metrics: Array<{ op: string; ms: number; ts: number }> = [];

  recordMetric(op: string, ms: number): void {
    this.metrics.push({ op, ms, ts: Date.now() });
    if (this.metrics.length > 1000) this.metrics = this.metrics.slice(-500);
  }

  getAverageDuration(op?: string): number {
    const f = op ? this.metrics.filter(m => m.op === op) : this.metrics;
    if (f.length === 0) return 0;
    return f.reduce((s, m) => s + m.ms, 0) / f.length;
  }

  reset(): void {
    this.processedCount = 0;
    this.errorCount = 0;
    this.cache.clear();
    this.metrics = [];
    this.listeners = [];
  }

  getConfig(): Readonly<SocialSharingConfig> { return Object.freeze({ ...this.config }); }
  updateConfig(u: Partial<SocialSharingConfig>): void { this.config = { ...this.config, ...u }; this.emit('config:updated', u); }
}

export function createSocialSharing(config?: Partial<SocialSharingConfig>): SocialSharingHandler {
  return new SocialSharingHandler({ ...DEFAULT_CONFIG, ...config });
}

/**
 * Build a shareable URL for a specific market.
 */
export function buildMarketShareUrl(marketId: number, baseUrl: string = ''): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/markets/${marketId}`;
}

/**
 * Build a Twitter/X share intent URL.
 */
export function buildTwitterShareUrl(text: string, url: string): string {
  const params = new URLSearchParams({ text, url });
  return `https://x.com/intent/tweet?${params.toString()}`;
}
