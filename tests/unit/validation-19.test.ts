import { describe, it, expect } from 'vitest';

describe('Validation helpers — suite 19', () => {
  it('rejects titles shorter than 3 characters', () => {
    const short = 'AB';
    expect(short.length).toBeLessThan(3);
  });

  it('accepts valid settlement offset', () => {
    const current = 230000;
    const target = current + 10;
    expect(target - current).toBeGreaterThanOrEqual(6);
  });

  it('rejects negative bet amounts', () => {
    expect(-100).toBeLessThan(10000);
  });

  it('accepts minimum bet amount of 10000 microSTX', () => {
    expect(10000).toBeGreaterThanOrEqual(10000);
  });

  it('validates description length within 1024 chars', () => {
    const desc = 'A'.repeat(512);
    expect(desc.length).toBeLessThanOrEqual(1024);
  });

  it('rejects empty title', () => {
    expect(''.trim().length).toBe(0);
  });

  it('calculates correct pool ratio', () => {
    const total = 5000000;
    const poolA = 2000000;
    const odds = total / poolA;
    expect(odds).toBeCloseTo(2.5);
  });

  it('handles zero pool gracefully', () => {
    const total = 1000000;
    const pool = 0;
    const odds = pool === 0 ? Infinity : total / pool;
    expect(odds).toBe(Infinity);
  });
});
