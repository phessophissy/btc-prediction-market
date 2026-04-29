import { describe, expect, it } from 'vitest';
import { estimateSettlementWindow } from '../../../../tools/ops-automation/pr-15/estimate-settlement-window';

describe('estimateSettlementWindow', () => {
  it('adds confirmation depth to settlement block', () => {
    expect(estimateSettlementWindow(1000)).toBe(1006);
    expect(estimateSettlementWindow(1000, 12)).toBe(1012);
  });
});
