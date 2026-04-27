import { describe, expect, it } from 'vitest';
import {
  consumeToken,
  consumeTokens,
  refillBucket,
  timeUntilNextTokenMs,
  RATE_LIMIT_WINDOW_MS,
  type TokenBucket,
} from '../../sdk/src/utils/rate-limiter';

describe('sdk rate-limiter token bucket helpers', () => {
  it('refills tokens based on elapsed time', () => {
    const start = 1_000;
    const bucket: TokenBucket = { tokens: 0, lastRefill: start };
    const afterHalfWindow = refillBucket(bucket, 60, start + RATE_LIMIT_WINDOW_MS / 2);
    expect(afterHalfWindow.tokens).toBe(30);
  });

  it('consumes one token when available', () => {
    const now = 2_000;
    const bucket: TokenBucket = { tokens: 1, lastRefill: now };
    const res = consumeToken(bucket, 60, now);
    expect(res.allowed).toBe(true);
    expect(res.bucket.tokens).toBe(0);
  });

  it('supports multi-token consumption', () => {
    const now = 3_000;
    const bucket: TokenBucket = { tokens: 10, lastRefill: now };
    const res = consumeTokens(bucket, 4, 60, now);
    expect(res.allowed).toBe(true);
    expect(res.bucket.tokens).toBe(6);
  });

  it('returns wait time when bucket is empty', () => {
    const now = 4_000;
    const bucket: TokenBucket = { tokens: 0, lastRefill: now };
    const wait = timeUntilNextTokenMs(bucket, 60, now + 100);
    expect(wait).toBeGreaterThan(0);
    expect(wait).toBeLessThanOrEqual(1000);
  });
});
