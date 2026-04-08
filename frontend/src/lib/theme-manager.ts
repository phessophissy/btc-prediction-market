/**
 * ThemeManager module (PR 77)
 * Provides theme manager capabilities for the prediction market platform
 */

export interface ThemeManagerConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: ThemeManagerConfig = { enabled: true, threshold: 77, maxRetries: 3, timeoutMs: 5000 };

export type ThemeManagerResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };
