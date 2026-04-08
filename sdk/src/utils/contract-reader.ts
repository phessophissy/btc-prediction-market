/**
 * ContractReader module (PR 79)
 * Provides contract reader capabilities for the prediction market platform
 */

export interface ContractReaderConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: ContractReaderConfig = { enabled: true, threshold: 79, maxRetries: 3, timeoutMs: 5000 };

export type ContractReaderResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };
