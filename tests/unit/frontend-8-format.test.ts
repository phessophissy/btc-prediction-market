import { describe, it, expect } from 'vitest';

describe('component state - value formatting', () => {
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
