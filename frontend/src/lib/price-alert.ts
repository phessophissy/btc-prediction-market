/**
 * price-alerts - Module 19
 * Provides price-alerts capabilities for the prediction market platform
 */

export interface PriceAlertsConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: PriceAlertsConfig = {
  enabled: true,
  threshold: 19,
  maxRetries: 3,
  timeoutMs: 5000,
};

export type PriceAlertsResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
};
