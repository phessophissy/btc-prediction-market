import { describe, expect, it } from 'vitest';
import {
  blocksUntilSettlement,
  getMarketPhase,
} from '../../sdk/src/utils/market-status';

const market = {
  id: 1,
  creator: 'SP000000000000000000002Q6VF78',
  title: 'Node lane test market',
  description: 'test',
  settlementBurnHeight: 100,
  settlementType: 'hash-even-odd',
  possibleOutcomes: 3,
  totalPool: 0,
  outcomeAPool: 0,
  outcomeBPool: 0,
  outcomeCPool: 0,
  outcomeDPool: 0,
  winningOutcome: null,
  settled: false,
  settledAtBurnHeight: null,
  settlementBlockHash: null,
  createdAtBurnHeight: 10,
  createdAtStacksHeight: 10,
};

describe('node lane: market status helpers', () => {
  it('computes blocks until settlement', () => {
    expect(blocksUntilSettlement(market, 80)).toBe(20);
  });

  it('returns settleable after confirmation window', () => {
    expect(getMarketPhase(market, 106)).toBe('settleable');
  });
});
