/**
 * Analytics tracking utilities — module 28
 * Provides event tracking for user interactions with market cards.
 */

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
}

const eventBuffer: AnalyticsEvent[] = [];
const MAX_BUFFER_SIZE = 100;

export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number
): void {
  const event: AnalyticsEvent = {
    category,
    action,
    label,
    value,
    timestamp: Date.now(),
  };

  eventBuffer.push(event);

  if (eventBuffer.length > MAX_BUFFER_SIZE) {
    eventBuffer.splice(0, eventBuffer.length - MAX_BUFFER_SIZE);
  }
}

export function trackMarketView(marketId: number): void {
  trackEvent('market', 'view', `market_${marketId}`, marketId);
}

export function trackBetPlaced(marketId: number, outcome: string, amount: number): void {
  trackEvent('bet', 'placed', `${outcome}_market_${marketId}`, amount);
}

export function trackWalletConnect(address: string): void {
  trackEvent('wallet', 'connect', address.slice(0, 8));
}

export function getRecentEvents(count = 20): AnalyticsEvent[] {
  return eventBuffer.slice(-count);
}

export function clearEvents(): void {
  eventBuffer.length = 0;
}
