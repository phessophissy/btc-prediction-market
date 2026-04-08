import { describe, it, expect } from 'vitest';

// emergency mode - transform tests (PR 115)

interface RawMarket { [k: string]: { value: string | boolean | null } | undefined }
interface Market { id: number; title: string; totalPool: number; settled: boolean; winningOutcome: number | null }

function transform(raw: RawMarket): Market {
  return {
    id: Number(raw['market-id']?.value ?? 0),
    title: String(raw['title']?.value ?? ''),
    totalPool: Number(raw['total-pool']?.value ?? 0),
    settled: Boolean(raw['settled']?.value),
    winningOutcome: raw['winning-outcome']?.value ? Number(raw['winning-outcome'].value) : null,
  };
}

describe('emergency mode - data transform', () => {
  it('transforms complete data', () => {
    const m = transform({ 'market-id': { value: '115' }, 'title': { value: 'Test' }, 'total-pool': { value: '50000' }, 'settled': { value: false } });
    expect(m.id).toBe(115);
    expect(m.totalPool).toBe(50000);
  });
  it('handles missing optional fields', () => {
    const m = transform({ 'market-id': { value: '1' }, 'title': { value: 'Min' }, 'total-pool': { value: '0' }, 'settled': { value: false } });
    expect(m.winningOutcome).toBeNull();
  });
  it('handles boolean settled', () => {
    const m = transform({ 'market-id': { value: '1' }, 'title': { value: 'T' }, 'total-pool': { value: '0' }, 'settled': { value: true } });
    expect(m.settled).toBe(true);
  });
});
