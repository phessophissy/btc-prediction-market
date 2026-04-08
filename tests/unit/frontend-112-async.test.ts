import { describe, it, expect } from 'vitest';

// bet modal - async tests (PR 112)

async function retry<T>(fn: () => Promise<T>, max: number): Promise<T> {
  let last: Error | undefined;
  for (let i = 0; i < max; i++) {
    try { return await fn(); }
    catch (e) { last = e instanceof Error ? e : new Error(String(e)); }
  }
  throw last;
}

describe('bet modal - retry logic', () => {
  it('retries on transient failure', async () => {
    let n = 0;
    const result = await retry(async () => { if (++n < 3) throw new Error('fail'); return 'ok'; }, 3);
    expect(result).toBe('ok');
  });
  it('throws after max attempts', async () => {
    await expect(retry(async () => { throw new Error('perm'); }, 2)).rejects.toThrow('perm');
  });
  it('succeeds immediately if no error', async () => {
    let calls = 0;
    await retry(async () => { calls++; return 1; }, 5);
    expect(calls).toBe(1);
  });
});
