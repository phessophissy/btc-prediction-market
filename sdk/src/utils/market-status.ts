import { Market } from '../types';

export type MarketPhase = 'open' | 'closing-soon' | 'closed' | 'settleable' | 'settled' | 'claimable';

const BLOCKS_BEFORE_SETTLEMENT = 6;
const CLOSING_SOON_THRESHOLD = 50;

export function getMarketPhase(market: Market, currentBurnHeight: number): MarketPhase {
  if (market.settled && market.winningOutcome !== null) {
    return 'claimable';
  }
  if (market.settled) {
    return 'settled';
  }
  if (currentBurnHeight >= market.settlementBurnHeight + BLOCKS_BEFORE_SETTLEMENT) {
    return 'settleable';
  }
  if (currentBurnHeight >= market.settlementBurnHeight) {
    return 'closed';
  }
  if (market.settlementBurnHeight - currentBurnHeight <= CLOSING_SOON_THRESHOLD) {
    return 'closing-soon';
  }
  return 'open';
}

export function isMarketOpen(market: Market, currentBurnHeight: number): boolean {
  return currentBurnHeight < market.settlementBurnHeight && !market.settled;
}

export function isMarketClosed(market: Market, currentBurnHeight: number): boolean {
  return currentBurnHeight >= market.settlementBurnHeight || market.settled;
}

export function blocksUntilSettlement(market: Market, currentBurnHeight: number): number {
  const remaining = market.settlementBurnHeight - currentBurnHeight;
  return Math.max(remaining, 0);
}

export function estimatedTimeToSettlement(market: Market, currentBurnHeight: number): string {
  const blocks = blocksUntilSettlement(market, currentBurnHeight);
  if (blocks === 0) return 'Now';
  const minutes = blocks * 10;
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  return `${days}d ${hours}h`;
}
