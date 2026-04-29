import { describe, expect, it } from 'vitest';
import { buildRetryCandidates } from '../../../../tools/ops-automation/pr-24/build-retry-candidates';

describe('buildRetryCandidates', () => {
  it('keeps only failed entries for retry', () => {
    const result = buildRetryCandidates([{ status: 'ok' }, { status: 'failed' }, { status: 'failed' }]);
    expect(result).toHaveLength(2);
  });
});
