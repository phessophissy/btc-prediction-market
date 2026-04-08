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
