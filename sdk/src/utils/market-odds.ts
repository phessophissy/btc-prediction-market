import { Market } from '../types';

export function calculateImpliedProbability(outcomePool: number, totalPool: number): number {
  if (totalPool === 0) return 0;
  return outcomePool / totalPool;
}

export function calculatePayout(betAmount: number, outcomePool: number, totalPool: number): number {
  if (outcomePool === 0) return 0;
  return (betAmount / outcomePool) * totalPool;
}

export function calculateOddsMultiplier(outcomePool: number, totalPool: number): number {
  if (outcomePool === 0) return 0;
  return totalPool / outcomePool;
}

export function formatOdds(outcomePool: number, totalPool: number): string {
  const multiplier = calculateOddsMultiplier(outcomePool, totalPool);
  if (multiplier === 0) return 'N/A';
  return `${multiplier.toFixed(2)}x`;
}

export function calculateExpectedReturn(
  betAmount: number,
  outcomePool: number,
  totalPool: number,
  platformFeeBps: number = 300
): number {
  const grossPayout = calculatePayout(betAmount, outcomePool, totalPool + betAmount);
  const fee = (grossPayout * platformFeeBps) / 10000;
  return grossPayout - fee;
}

export function getOutcomePools(market: Market): Record<string, number> {
  return {
    A: market.outcomeAPool,
    B: market.outcomeBPool,
    C: market.outcomeCPool,
    D: market.outcomeDPool,
  };
}

export function getLeadingOutcome(market: Market): string | null {
  const pools = getOutcomePools(market);
  const entries = Object.entries(pools).filter(([, v]) => v > 0);
  if (entries.length === 0) return null;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

// [chore/dependency-audit-update] commit 7/10: strengthen sdk-utils layer – 1776638611599468282

/**
 * Return implied probability as a percentage string (e.g. '67.3%').
 */
export function formatImpliedProbability(outcomePool: number, totalPool: number): string {
  const prob = calculateImpliedProbability(outcomePool, totalPool);
  return `${(prob * 100).toFixed(1)}%`;
}

/**
 * Return Kelly criterion fraction for optimal bet sizing.
 * edge = (b * p - q) / b  where b = odds-1, p = win prob, q = 1-p
 */
export function kellyFraction(prob: number, oddsMultiplier: number): number {
  if (oddsMultiplier <= 1 || prob <= 0 || prob >= 1) return 0;
  const b = oddsMultiplier - 1;
  const q = 1 - prob;
  return Math.max(0, (b * prob - q) / b);
}

/**
 * Convert a decimal odds multiplier to American moneyline format.
 * e.g. 2.5x → +150, 1.4x → -250
 */
export function toMoneyline(oddsMultiplier: number): string {
  if (oddsMultiplier <= 0) return 'N/A';
  if (oddsMultiplier >= 2) {
    return `+${Math.round((oddsMultiplier - 1) * 100)}`;
  }
  return `${Math.round(-100 / (oddsMultiplier - 1))}`;
}
