import { FeeTier } from '../types';

const FEE_TIERS: Record<FeeTier, number> = {
  standard: 300,
  reduced: 150,
  premium: 500,
};

/**
 * Calculate platform fee for a given payout amount.
 * @param grossPayout - gross payout in microstx
 * @param tier - fee tier applied to this market
 * @returns fee amount in microstx
 */
export function calculatePlatformFee(grossPayout: number, tier: FeeTier = 'standard'): number {
  const bps = FEE_TIERS[tier];
  return Math.floor((grossPayout * bps) / 10000);
}

/**
 * Calculate net payout after platform fee.
 */
export function calculateNetPayout(grossPayout: number, tier: FeeTier = 'standard'): number {
  return grossPayout - calculatePlatformFee(grossPayout, tier);
}

/**
 * Return a human-readable fee percentage string.
 */
export function formatFeePercent(tier: FeeTier = 'standard'): string {
  return `${(FEE_TIERS[tier] / 100).toFixed(2)}%`;
}
