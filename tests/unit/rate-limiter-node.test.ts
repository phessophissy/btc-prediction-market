import { describe, expect, it } from 'vitest';
import {
  RATE_LIMIT_WINDOW_MS,
  consumeToken,
  refillBucket,
  type TokenBucket,
} from '../../sdk/src/utils/rate-limiter';

describe('node lane: rate limiter basics', () => {
  it('refills bucket based on elapsed time', () => {
    const start = 0;
    const bucket: TokenBucket = { tokens: 0, lastRefill: start };
    const refilled = refillBucket(bucket, 60, RATE_LIMIT_WINDOW_MS);
    expect(refilled.tokens).toBe(60);
  });

  it('denies token consumption when empty', () => {
    const bucket: TokenBucket = { tokens: 0, lastRefill: 1_000 };
    const result = consumeToken(bucket, 60, 1_000);
    expect(result.allowed).toBe(false);
  });
});
