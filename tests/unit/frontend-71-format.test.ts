import { describe, it, expect } from 'vitest';

// responsive layout - formatting tests (PR 71)

function formatValue(microStx: number): string {
  return (microStx / 1_000_000).toFixed(2);
}

function formatPercent(value: number, total: number): string {
  if (total === 0) return '0.0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}

describe('responsive layout - value formatting', () => {
  it('formats microSTX', () => expect(formatValue(1000000)).toBe('1.00'));
  it('formats fractional', () => expect(formatValue(500000)).toBe('0.50'));
  it('formats zero', () => expect(formatValue(0)).toBe('0.00'));
  it('formats large values', () => expect(formatValue(1000000000)).toBe('1000.00'));
});

describe('responsive layout - percent formatting', () => {
  it('calculates percent', () => expect(formatPercent(25, 100)).toBe('25.0%'));
  it('handles zero total', () => expect(formatPercent(0, 0)).toBe('0.0%'));
  it('handles 100%', () => expect(formatPercent(100, 100)).toBe('100.0%'));
});
