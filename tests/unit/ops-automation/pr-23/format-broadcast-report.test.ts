import { describe, expect, it } from 'vitest';
import { formatBroadcastReport } from '../../../../tools/ops-automation/pr-23/format-broadcast-report';

describe('formatBroadcastReport', () => {
  it('renders ordered tx report lines', () => {
    const output = formatBroadcastReport(['abc', 'def']);
    expect(output).toContain('1. abc');
    expect(output).toContain('2. def');
  });
});
