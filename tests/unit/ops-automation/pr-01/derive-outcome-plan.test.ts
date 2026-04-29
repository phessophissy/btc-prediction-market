import { describe, expect, it } from 'vitest';
import { deriveOutcomePlan } from '../../../../tools/ops-automation/pr-01/derive-outcome-plan';

describe('deriveOutcomePlan', () => {
  it('alternates outcome-a and outcome-b', () => {
    expect(deriveOutcomePlan(4)).toEqual(['outcome-a', 'outcome-b', 'outcome-a', 'outcome-b']);
  });
});
