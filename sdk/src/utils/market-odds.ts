import { Market } from '../types';

export function calculateImpliedProbability(outcomePool: number, totalPool: number): number {
  if (totalPool === 0) return 0;
  return outcomePool / totalPool;
}

export function calculatePayout(betAmount: number, outcomePool: number, totalPool: number): number {
  if (outcomePool === 0) return 0;
  return (betAmount / outcomePool) * totalPool;
}
