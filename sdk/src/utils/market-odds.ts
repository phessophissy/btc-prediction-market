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
