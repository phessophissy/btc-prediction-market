import { describe, it, expect } from 'vitest';

// pool calculation - input validation tests (PR 63)

function validateInput(input: any): { valid: boolean; error?: string } {
  if (input === null || input === undefined || input === '') return { valid: false, error: 'Required' };
  if (typeof input !== 'string') return { valid: false, error: 'Must be string' };
  return { valid: true };
}

describe('pool calculation - input validation', () => {
  it('rejects empty', () => expect(validateInput('')).toMatchObject({ valid: false }));
  it('accepts valid', () => expect(validateInput('data-63')).toMatchObject({ valid: true }));
  it('rejects null', () => expect(validateInput(null).valid).toBe(false));
  it('rejects undefined', () => expect(validateInput(undefined).valid).toBe(false));
  it('rejects numbers', () => expect(validateInput(42).valid).toBe(false));
});

function validateBounds(input: string, max: number = 128): { valid: boolean; value?: string } {
  const trimmed = input.trim();
  if (trimmed.length === 0) return { valid: false };
  if (trimmed.length > max) return { valid: false };
  return { valid: true, value: trimmed };
}

describe('pool calculation - boundary conditions', () => {
  it('rejects over max length', () => expect(validateBounds('x'.repeat(256)).valid).toBe(false));
  it('accepts min length', () => expect(validateBounds('a').valid).toBe(true));
  it('accepts exactly max', () => expect(validateBounds('y'.repeat(128)).valid).toBe(true));
  it('trims whitespace', () => expect(validateBounds('  ok  ').value).toBe('ok'));
  it('rejects whitespace-only', () => expect(validateBounds('   ').valid).toBe(false));
});
