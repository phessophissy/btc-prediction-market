/**
 * bet-history - Module 23
 * Provides bet-history capabilities for the prediction market platform
 */

export interface BetHistoryConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: BetHistoryConfig = {
  enabled: true,
  threshold: 23,
  maxRetries: 3,
  timeoutMs: 5000,
};

export type BetHistoryResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
};
