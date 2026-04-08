/**
 * DarkMode module (PR 114)
 * Provides dark mode capabilities for the prediction market platform
 */

export interface DarkModeConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: DarkModeConfig = { enabled: true, threshold: 114, maxRetries: 3, timeoutMs: 5000 };

export type DarkModeResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };
