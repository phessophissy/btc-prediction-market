/**
 * contract-events - Module 21
 * Provides contract-events capabilities for the prediction market platform
 */

export interface ContractEventsConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: ContractEventsConfig = {
  enabled: true,
  threshold: 21,
  maxRetries: 3,
  timeoutMs: 5000,
};

export type ContractEventsResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
};
