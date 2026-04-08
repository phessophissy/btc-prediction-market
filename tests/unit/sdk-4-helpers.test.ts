import { describe, it, expect } from 'vitest';

describe('bet placement logic - input validation', () => {
  it('handles empty input gracefully', () => {
    const result = validateInput('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('accepts valid standard input', () => {
    const result = validateInput('valid-test-data-4');
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
