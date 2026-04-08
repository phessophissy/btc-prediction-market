import { describe, it, expect } from 'vitest';

describe('market display - serialization', () => {
  it('serializes market data to JSON', () => {
    const data = {
      id: 10,
      title: 'Market 10',
      pool: 50000,
      settled: false,
    };
    const json = JSON.stringify(data);
    const parsed = JSON.parse(json);
    expect(parsed.id).toBe(10);
    expect(parsed.title).toBe('Market 10');
  });

  it('handles special characters in titles', () => {
    const data = { title: 'Will BTC > $100k?' };
    const json = JSON.stringify(data);
    const parsed = JSON.parse(json);
    expect(parsed.title).toContain('BTC');
  });

  it('preserves null values', () => {
    const data = { winner: null, hash: null };
    const json = JSON.stringify(data);
    const parsed = JSON.parse(json);
    expect(parsed.winner).toBeNull();
  });
});
