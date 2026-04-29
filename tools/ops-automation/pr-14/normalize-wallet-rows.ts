import type { WalletRow } from './index';

export function normalizeWalletRows(rows: Array<Record<string, string>>): WalletRow[] {
  return rows
    .filter((row) => !!row.address)
    .map((row, idx) => ({
      address: row.address.trim().toUpperCase(),
      privateKey: row.privateKey?.trim(),
      name: row.name?.trim() || `Wallet ${String(idx + 1).padStart(3, '0')}`,
    }));
}
