/**
 * KeyboardNav module (PR 118)
 * Provides keyboard nav capabilities for the prediction market platform
 */

export interface KeyboardNavConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: KeyboardNavConfig = { enabled: true, threshold: 118, maxRetries: 3, timeoutMs: 5000 };

export type KeyboardNavResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };
