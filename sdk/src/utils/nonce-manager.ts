/**
 * nonce-management - Module 22
 * Provides nonce-management capabilities for the prediction market platform
 */

export interface NonceManagementConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: NonceManagementConfig = {
  enabled: true,
  threshold: 22,
  maxRetries: 3,
  timeoutMs: 5000,
};

export type NonceManagementResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
};
