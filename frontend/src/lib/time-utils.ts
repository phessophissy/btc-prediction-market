export function formatRelativeTime(blocksRemaining: number): string {
  const minutes = blocksRemaining * 10;
  if (minutes < 1) return 'any moment';
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  return h > 0 ? `${d}d ${h}h` : `${d}d`;
}

export function formatBlockHeight(height: number): string {
  return `#${height.toLocaleString()}`;
}

export function formatBlockRange(start: number, end: number): string {
  return `${formatBlockHeight(start)} → ${formatBlockHeight(end)}`;
}

export function estimateBlockTimestamp(
  targetBlock: number,
  currentBlock: number,
  currentTimestamp: number = Date.now()
): number {
  const blocksAway = targetBlock - currentBlock;
  const msPerBlock = 10 * 60 * 1000;
  return currentTimestamp + blocksAway * msPerBlock;
}

export function formatEstimatedDate(
  targetBlock: number,
  currentBlock: number
): string {
  const ts = estimateBlockTimestamp(targetBlock, currentBlock);
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a future Date as a relative human-readable string.
 */
export function formatRelativeDate(date: Date): string {
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return 'now';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}
