import { describe, it, expect } from 'vitest';

// market card render - error handling tests (PR 117)

function wrapError(err: unknown, context: string): Error {
  const msg = err instanceof Error ? err.message : String(err);
  const wrapped = new Error(`${context}: ${msg}`);
  if (err instanceof Error) wrapped.cause = err;
  return wrapped;
}

describe('market card render - error wrapping', () => {
  it('wraps Error objects', () => {
    const e = wrapError(new Error('timeout'), 'fetch');
    expect(e.message).toBe('fetch: timeout');
  });
  it('wraps strings', () => {
    const e = wrapError('fail', 'op');
    expect(e.message).toBe('op: fail');
  });
  it('preserves cause', () => {
    const orig = new Error('root');
    expect(wrapError(orig, 'ctx').cause).toBe(orig);
  });
});
