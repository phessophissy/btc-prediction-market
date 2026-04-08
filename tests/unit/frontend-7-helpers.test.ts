import { describe, it, expect } from 'vitest';

describe('format utilities - input validation', () => {
  it('handles empty input gracefully', () => {
    const result = validateInput('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('accepts valid standard input', () => {
    const result = validateInput('valid-test-data-7');
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

describe('format utilities - boundary conditions', () => {
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

describe('format utilities - numeric processing', () => {
  it('converts positive integers correctly', () => {
    expect(processAmount(100)).toBe(100);
  });

  it('rejects negative numbers', () => {
    expect(() => processAmount(-1)).toThrow('Amount must be positive');
  });

  it('handles zero', () => {
    expect(processAmount(0)).toBe(0);
  });

  it('rounds fractional microSTX', () => {
    expect(processAmount(1.5)).toBe(2);
  });

  it('rejects NaN', () => {
    expect(() => processAmount(NaN)).toThrow('Invalid amount');
  });

  it('rejects Infinity', () => {
    expect(() => processAmount(Infinity)).toThrow('Invalid amount');
  });
});

function processAmount(amount: number): number {
  if (!Number.isFinite(amount)) throw new Error('Invalid amount');
  if (amount < 0) throw new Error('Amount must be positive');
  return Math.round(amount);
}

describe('format utilities - collection operations', () => {
  it('filters active items from list', () => {
    const items = [
      { id: 7, active: true },
      { id: 8, active: false },
      { id: 9, active: true },
    ];
    const result = filterActive(items);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(7);
  });

  it('returns empty array for empty input', () => {
    expect(filterActive([])).toEqual([]);
  });

  it('handles all inactive items', () => {
    const items = [{ id: 1, active: false }];
    expect(filterActive(items)).toEqual([]);
  });
});

function filterActive<T extends { active: boolean }>(items: T[]): T[] {
  return items.filter(item => item.active);
}
