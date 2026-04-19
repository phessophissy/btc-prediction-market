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

// [feat/stx-staking-rewards] commit 4/10: extend lib layer – 1776638401950946656
