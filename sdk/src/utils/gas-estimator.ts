/**
 * GasEstimation module (PR 75)
 * Provides gas estimation capabilities for the prediction market platform
 */

export interface GasEstimationConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: GasEstimationConfig = { enabled: true, threshold: 75, maxRetries: 3, timeoutMs: 5000 };

export type GasEstimationResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };
