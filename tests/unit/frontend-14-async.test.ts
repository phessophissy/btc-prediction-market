import { describe, it, expect, vi } from 'vitest';

describe('form validation - async operations', () => {
  it('retries on transient failure', async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      if (attempts < 3) throw new Error('transient');
      return 'success';
    };
    const result = await retry(fn, 3);
    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });

  it('throws after max retries', async () => {
    const fn = async () => { throw new Error('permanent'); };
    await expect(retry(fn, 2)).rejects.toThrow('permanent');
  });

  it('returns immediately on success', async () => {
    let calls = 0;
    const fn = async () => { calls++; return 42; };
    const result = await retry(fn, 5);
    expect(result).toBe(42);
    expect(calls).toBe(1);
  });
});

async function retry<T>(fn: () => Promise<T>, maxAttempts: number): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw lastError;
}
