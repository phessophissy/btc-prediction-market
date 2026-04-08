/**
 * TxHistory module (PR 76)
 * Provides tx history capabilities for the prediction market platform
 */

export interface TxHistoryConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: TxHistoryConfig = { enabled: true, threshold: 76, maxRetries: 3, timeoutMs: 5000 };

export type TxHistoryResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };
