import { describe, it, expect } from 'vitest';

// bet modal - state tests (PR 112)

interface State { status: string; updatedAt: number }

const TRANSITIONS: Record<string, Record<string, string>> = {
  pending: { activate: 'active' },
  active: { complete: 'completed', cancel: 'cancelled' },
};

function transition(state: State, action: string): State {
  const next = TRANSITIONS[state.status]?.[action];
  if (!next) throw new Error(`Invalid: ${state.status} + ${action}`);
  return { status: next, updatedAt: Date.now() };
}

describe('bet modal - state machine', () => {
  it('transitions pending to active', () => {
    expect(transition({ status: 'pending', updatedAt: 0 }, 'activate').status).toBe('active');
  });
  it('transitions active to completed', () => {
    expect(transition({ status: 'active', updatedAt: 0 }, 'complete').status).toBe('completed');
  });
  it('rejects invalid transitions', () => {
    expect(() => transition({ status: 'completed', updatedAt: 0 }, 'activate')).toThrow('Invalid');
  });
  it('records timestamp', () => {
    const s = transition({ status: 'pending', updatedAt: 0 }, 'activate');
    expect(s.updatedAt).toBeGreaterThan(0);
  });
});
