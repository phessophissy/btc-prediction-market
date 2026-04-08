import { describe, it, expect } from 'vitest';
import {
  getMarketPhase,
  isMarketOpen,
  isMarketClosed,
  blocksUntilSettlement,
  estimatedTimeToSettlement,
  getMarketPhaseLabel,
} from '../../sdk/src/utils/market-status';

const baseMarket = {
  id: 1,
  creator: 'SP123',
  title: 'Test Market',
  description: 'A test market',
  settlementBurnHeight: 1000,
  settlementType: 'hash-even-odd',
  possibleOutcomes: 3,
  totalPool: 50000,
  outcomeAPool: 30000,
  outcomeBPool: 20000,
  outcomeCPool: 0,
  outcomeDPool: 0,
  winningOutcome: null,
  settled: false,
  settledAtBurnHeight: null,
  settlementBlockHash: null,
  createdAtBurnHeight: 900,
  createdAtStacksHeight: 500,
};

describe('getMarketPhase', () => {
  it('returns open for active markets', () => {
    expect(getMarketPhase(baseMarket, 900)).toBe('open');
  });

  it('returns closing-soon when within threshold', () => {
    expect(getMarketPhase(baseMarket, 960)).toBe('closing-soon');
  });

  it('returns closed past settlement height', () => {
    expect(getMarketPhase(baseMarket, 1002)).toBe('closed');
  });

  it('returns settleable after settlement + buffer', () => {
    expect(getMarketPhase(baseMarket, 1006)).toBe('settleable');
  });

  it('returns claimable when settled with winner', () => {
    const settled = { ...baseMarket, settled: true, winningOutcome: 1 as const };
    expect(getMarketPhase(settled, 1100)).toBe('claimable');
  });
});

describe('isMarketOpen', () => {
  it('is open before settlement height', () => {
    expect(isMarketOpen(baseMarket, 900)).toBe(true);
  });

  it('is not open after settlement height', () => {
    expect(isMarketOpen(baseMarket, 1000)).toBe(false);
  });
});

describe('blocksUntilSettlement', () => {
  it('calculates remaining blocks', () => {
    expect(blocksUntilSettlement(baseMarket, 900)).toBe(100);
  });

  it('returns 0 when past settlement', () => {
    expect(blocksUntilSettlement(baseMarket, 1100)).toBe(0);
  });
});

describe('estimatedTimeToSettlement', () => {
  it('formats minutes', () => {
    const m = { ...baseMarket, settlementBurnHeight: 105 };
    expect(estimatedTimeToSettlement(m, 100)).toBe('50m');
  });

  it('formats hours', () => {
    const m = { ...baseMarket, settlementBurnHeight: 200 };
    expect(estimatedTimeToSettlement(m, 100)).toContain('h');
  });
});

describe('getMarketPhaseLabel', () => {
  it('returns human-readable label for open', () => {
    expect(getMarketPhaseLabel('open')).toBe('Open for Betting');
  });

  it('returns human-readable label for claimable', () => {
    expect(getMarketPhaseLabel('claimable')).toBe('Winnings Available');
  });
});
