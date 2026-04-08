import { describe, it, expect } from 'vitest';

describe('market display - value formatting', () => {
  it('formats microSTX to STX string', () => {
    expect(formatValue(1000000)).toBe('1.00');
    expect(formatValue(500000)).toBe('0.50');
    expect(formatValue(10000)).toBe('0.01');
  });

  it('handles zero', () => {
    expect(formatValue(0)).toBe('0.00');
  });

  it('handles large values', () => {
    expect(formatValue(1000000000)).toBe('1000.00');
  });
});

function formatValue(microStx: number): string {
  return (microStx / 1_000_000).toFixed(2);
}

describe('market display - error handling', () => {
  it('wraps errors with context', () => {
    const err = wrapError(new Error('network timeout'), 'fetching market 10');
    expect(err.message).toContain('fetching market 10');
    expect(err.message).toContain('network timeout');
  });

  it('handles non-Error objects', () => {
    const err = wrapError('string error', 'operation');
    expect(err.message).toContain('string error');
  });

  it('preserves error stack', () => {
    const original = new Error('original');
    const wrapped = wrapError(original, 'context');
    expect(wrapped.cause).toBe(original);
  });
});

function wrapError(err: unknown, context: string): Error {
  const message = err instanceof Error ? err.message : String(err);
  const wrapped = new Error(`${context}: ${message}`);
  if (err instanceof Error) wrapped.cause = err;
  return wrapped;
}
