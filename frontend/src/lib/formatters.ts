/**
 * Human-readable number formatting utilities used across the prediction market UI.
 */

const MICRO_STX = 1_000_000;

/** Convert micro-STX (contract units) to STX for display. */
export function microToStx(micro: number | bigint): number {
  return Number(micro) / MICRO_STX;
}

/** Format a STX amount with the given decimal places and optional suffix. */
export function formatStx(micro: number | bigint, decimals = 2): string {
  return `${microToStx(micro).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} STX`;
}

/** Format large numbers with K / M / B suffixes. */
export function compactNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

/** Percentage string from a 0-1 ratio. */
export function formatPercent(ratio: number, decimals = 1): string {
  return `${(ratio * 100).toFixed(decimals)}%`;
}

/** Relative time label (e.g. "3 h ago", "in 5 min"). */
export function relativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = timestamp - now;
  const abs = Math.abs(diff);
  const prefix = diff < 0 ? "" : "in ";
  const suffix = diff < 0 ? " ago" : "";

  if (abs < 60_000) return "just now";
  if (abs < 3_600_000) {
    const m = Math.floor(abs / 60_000);
    return `${prefix}${m} min${suffix}`;
  }
  if (abs < 86_400_000) {
    const h = Math.floor(abs / 3_600_000);
    return `${prefix}${h} h${suffix}`;
  }
  const d = Math.floor(abs / 86_400_000);
  return `${prefix}${d} d${suffix}`;
}

/** Truncate a Stacks address for display: SP1AB...XY9Z */
export function truncateAddress(address: string, start = 5, end = 4): string {
  if (address.length <= start + end + 3) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/** Clamp a value between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Estimate remaining time to a target Bitcoin block height. Assumes ~10 min per block. */
export function estimateBlockTime(blocksRemaining: number): number {
  const MS_PER_BLOCK = 10 * 60 * 1000;
  return Date.now() + blocksRemaining * MS_PER_BLOCK;
}

// [refactor/contract-service-split] commit 4/10: extend lib layer – 1776638498206040756
