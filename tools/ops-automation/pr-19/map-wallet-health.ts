export type WalletHealth = {
  address: string;
  balance: number;
  minRequired: number;
};

export function mapWalletHealth(items: WalletHealth[]): Array<WalletHealth & { healthy: boolean }> {
  return items.map((item) => ({ ...item, healthy: item.balance >= item.minRequired }));
}
