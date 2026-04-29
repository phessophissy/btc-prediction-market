import { describe, expect, it } from 'vitest';
import { groupBetsByOutcome } from '../../../../tools/ops-automation/pr-07/group-bets-by-outcome';

describe('groupBetsByOutcome', () => {
  it('aggregates totals by outcome', () => {
    const grouped = groupBetsByOutcome([
      { outcome: 'outcome-a', amount: 10000 },
      { outcome: 'outcome-b', amount: 15000 },
      { outcome: 'outcome-a', amount: 5000 },
    ]);
    expect(grouped['outcome-a']).toBe(15000);
    expect(grouped['outcome-b']).toBe(15000);
  });
});
