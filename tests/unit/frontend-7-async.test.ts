import { describe, it, expect, vi } from 'vitest';

describe('format utilities - async operations', () => {
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

describe('format utilities - state transitions', () => {
  it('transitions from pending to active', () => {
    const state = createState('pending');
    const next = transition(state, 'activate');
    expect(next.status).toBe('active');
  });

  it('prevents invalid transitions', () => {
    const state = createState('completed');
    expect(() => transition(state, 'activate')).toThrow('Invalid transition');
  });

  it('records transition timestamp', () => {
    const state = createState('pending');
    const next = transition(state, 'activate');
    expect(next.updatedAt).toBeGreaterThan(0);
  });
});

interface State { status: string; updatedAt: number; }

function createState(status: string): State {
  return { status, updatedAt: Date.now() };
}

function transition(state: State, action: string): State {
  const transitions: Record<string, Record<string, string>> = {
    pending: { activate: 'active' },
    active: { complete: 'completed', cancel: 'cancelled' },
  };
  const nextStatus = transitions[state.status]?.[action];
  if (!nextStatus) throw new Error(`Invalid transition: ${state.status} + ${action}`);
  return { status: nextStatus, updatedAt: Date.now() };
}
