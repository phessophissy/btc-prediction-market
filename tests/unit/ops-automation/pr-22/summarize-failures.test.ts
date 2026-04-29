import { describe, expect, it } from 'vitest';
import { summarizeFailures } from '../../../../tools/ops-automation/pr-22/summarize-failures';

describe('summarizeFailures', () => {
  it('categorizes rate-limit and other failures', () => {
    const summary = summarizeFailures(['rate limit exceeded', 'timeout', 'rate limit exceeded']);
    expect(summary['rate-limit']).toBe(2);
    expect(summary.other).toBe(1);
  });
});
