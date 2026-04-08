import { describe, it, expect } from 'vitest';

describe('wallet connection - serialization', () => {
  it('serializes market data to JSON', () => {
    const data = {
      id: 9,
      title: 'Market 9',
      pool: 50000,
      settled: false,
    };
    const json = JSON.stringify(data);
    const parsed = JSON.parse(json);
    expect(parsed.id).toBe(9);
    expect(parsed.title).toBe('Market 9');
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

describe('wallet connection - data pipeline', () => {
  it('transforms raw contract response to typed market', () => {
    const raw = {
      'market-id': { value: '9' },
      'title': { value: 'Test Market 9' },
      'total-pool': { value: '50000' },
      'settled': { value: false },
    };
    const market = transformRaw(raw);
    expect(market.id).toBe(9);
    expect(market.totalPool).toBe(50000);
    expect(market.settled).toBe(false);
  });

  it('handles missing optional fields', () => {
    const raw = {
      'market-id': { value: '9' },
      'title': { value: 'Minimal' },
      'total-pool': { value: '0' },
      'settled': { value: false },
    };
    const market = transformRaw(raw);
    expect(market.winningOutcome).toBeNull();
  });
});

interface RawMarket {
  [key: string]: { value: string | boolean | null } | undefined;
}

interface TransformedMarket {
  id: number;
  title: string;
  totalPool: number;
  settled: boolean;
  winningOutcome: number | null;
}

function transformRaw(raw: RawMarket): TransformedMarket {
  return {
    id: Number(raw['market-id']?.value ?? 0),
    title: String(raw['title']?.value ?? ''),
    totalPool: Number(raw['total-pool']?.value ?? 0),
    settled: Boolean(raw['settled']?.value),
    winningOutcome: raw['winning-outcome']?.value ? Number(raw['winning-outcome'].value) : null,
  };
}
