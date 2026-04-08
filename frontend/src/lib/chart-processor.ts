/**
 * ChartData module (PR 81)
 * Provides chart data capabilities for the prediction market platform
 */

export interface ChartDataConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: ChartDataConfig = { enabled: true, threshold: 81, maxRetries: 3, timeoutMs: 5000 };

export type ChartDataResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };
