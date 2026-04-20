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

/**
 * Format a microstx amount as a compact STX string, e.g. '1.25M STX', '300K STX'.
 */
export function formatPoolSize(microstx: number): string {
  const stx = microstx / 1_000_000;
  if (stx >= 1_000_000) return `${(stx / 1_000_000).toFixed(2)}M STX`;
  if (stx >= 1_000) return `${(stx / 1_000).toFixed(1)}K STX`;
  return `${stx.toFixed(2)} STX`;
}
