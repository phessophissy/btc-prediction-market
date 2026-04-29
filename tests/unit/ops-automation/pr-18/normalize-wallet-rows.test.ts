import { describe, expect, it } from 'vitest';
import { normalizeWalletRows } from '../../../../tools/ops-automation/pr-18/normalize-wallet-rows';

describe('normalizeWalletRows', () => {
  it('normalizes and filters raw rows', () => {
    const rows = [{ address: ' sp123 ', privateKey: ' key ', name: '  first ' }, { name: 'no-address' }];
    const result = normalizeWalletRows(rows as Array<Record<string, string>>);
    expect(result).toHaveLength(1);
    expect(result[0].address).toBe('SP123');
    expect(result[0].name).toBe('first');
  });
});
