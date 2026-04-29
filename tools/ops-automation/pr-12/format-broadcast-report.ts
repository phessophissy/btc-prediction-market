export function formatBroadcastReport(txids: string[]): string {
  if (txids.length === 0) return 'No transactions broadcast.';
  return txids.map((txid, idx) => `${idx + 1}. ${txid}`).join('\n');
}
