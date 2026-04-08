import { describe, it, expect } from 'vitest';

describe('form validation - input validation', () => {
  it('handles empty input gracefully', () => {
    const result = validateInput('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('accepts valid standard input', () => {
    const result = validateInput('valid-test-data-14');
    expect(result.valid).toBe(true);
  });

  it('rejects null and undefined', () => {
    expect(validateInput(null as any).valid).toBe(false);
    expect(validateInput(undefined as any).valid).toBe(false);
  });
});

function validateInput(input: any): { valid: boolean; error?: string } {
  if (input === null || input === undefined || input === '') {
    return { valid: false, error: 'Input is required' };
  }
  if (typeof input !== 'string') {
    return { valid: false, error: 'Input must be a string' };
  }
  return { valid: true };
}

describe('form validation - boundary conditions', () => {
  it('handles maximum length strings', () => {
    const longStr = 'x'.repeat(256);
    const result = validateBounds(longStr);
    expect(result.valid).toBe(false);
  });

  it('handles minimum valid input', () => {
    const result = validateBounds('a');
    expect(result.valid).toBe(true);
  });

  it('handles exactly max length', () => {
    const exact = 'y'.repeat(128);
    const result = validateBounds(exact);
    expect(result.valid).toBe(true);
  });

  it('trims whitespace before validation', () => {
    const result = validateBounds('  valid  ');
    expect(result.valid).toBe(true);
    expect(result.value).toBe('valid');
  });
});

function validateBounds(input: string): { valid: boolean; value?: string; error?: string } {
  const trimmed = input.trim();
  if (trimmed.length === 0) return { valid: false, error: 'Cannot be empty' };
  if (trimmed.length > 128) return { valid: false, error: 'Exceeds max length of 128' };
  return { valid: true, value: trimmed };
}
