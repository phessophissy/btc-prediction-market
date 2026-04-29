import { describe, expect, it } from 'vitest';
import { computeFeeAwareBudget } from '../../../../tools/ops-automation/pr-29/compute-fee-aware-budget';

describe('computeFeeAwareBudget', () => {
  it('reserves tx fee from wallet budget', () => {
    expect(computeFeeAwareBudget(50000, 10000)).toBe(40000);
    expect(computeFeeAwareBudget(5000, 10000)).toBe(0);
  });
});
