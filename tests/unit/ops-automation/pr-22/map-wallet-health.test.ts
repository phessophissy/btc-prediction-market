import { describe, expect, it } from 'vitest';
import { mapWalletHealth } from '../../../../tools/ops-automation/pr-22/map-wallet-health';

describe('mapWalletHealth', () => {
  it('marks wallets as healthy based on balance threshold', () => {
    const result = mapWalletHealth([
      { address: 'A', balance: 30000, minRequired: 20000 },
      { address: 'B', balance: 10000, minRequired: 20000 },
    ]);
    expect(result[0].healthy).toBe(true);
    expect(result[1].healthy).toBe(false);
  });
});
