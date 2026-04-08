export const MICROSTX_PER_STX = 1_000_000;

export function microStxToStx(microStx: number): number {
  return microStx / MICROSTX_PER_STX;
}

export function stxToMicroStx(stx: number): number {
  return Math.round(stx * MICROSTX_PER_STX);
}

export function formatStx(microStx: number, decimals: number = 2): string {
  const stx = microStxToStx(microStx);
  return `${stx.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })} STX`;
}

export function formatStxCompact(microStx: number): string {
  const stx = microStxToStx(microStx);
  if (stx >= 1_000_000) return `${(stx / 1_000_000).toFixed(1)}M STX`;
  if (stx >= 1_000) return `${(stx / 1_000).toFixed(1)}K STX`;
  return `${stx.toFixed(2)} STX`;
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  const pct = (value / total) * 100;
  return `${pct.toFixed(1)}%`;
}

export function formatBasisPoints(bps: number): string {
  return `${(bps / 100).toFixed(1)}%`;
}
