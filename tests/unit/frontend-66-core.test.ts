import { describe, it, expect } from 'vitest';

// routing logic - input validation tests (PR 66)

function validateInput(input: any): { valid: boolean; error?: string } {
  if (input === null || input === undefined || input === '') return { valid: false, error: 'Required' };
  if (typeof input !== 'string') return { valid: false, error: 'Must be string' };
  return { valid: true };
}

describe('routing logic - input validation', () => {
  it('rejects empty', () => expect(validateInput('')).toMatchObject({ valid: false }));
  it('accepts valid', () => expect(validateInput('data-66')).toMatchObject({ valid: true }));
  it('rejects null', () => expect(validateInput(null).valid).toBe(false));
  it('rejects undefined', () => expect(validateInput(undefined).valid).toBe(false));
  it('rejects numbers', () => expect(validateInput(42).valid).toBe(false));
});
