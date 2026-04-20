export function formatAddress(address: string, start = 6, end = 4): string {
  if (!address) return "";
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function formatMicroStx(value: number): string {
  return (value / 1_000_000).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function formatBlocksToEta(blocks: number): string {
  const safeBlocks = Math.max(blocks, 0);
  const minutes = safeBlocks * 10;

  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  return `${Math.floor(minutes / 1440)}d ${Math.floor((minutes % 1440) / 60)}h`;
}

// [chore/dependency-audit-update] commit 4/10: extend lib layer – 1776638611511642964

export function getSettlementTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'btc-price': 'BTC Price Target',
    'btc-hash': 'Bitcoin Block Hash',
    'manual': 'Manual Settlement',
    'oracle': 'Oracle Resolved',
  };
  return labels[type] ?? type;
}
