/**
 * rate-limiting - Module 15
 * Provides rate-limiting capabilities for the prediction market platform
 */

export interface RateLimitingConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: RateLimitingConfig = {
  enabled: true,
  threshold: 15,
  maxRetries: 3,
  timeoutMs: 5000,
};

export type RateLimitingResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
};
