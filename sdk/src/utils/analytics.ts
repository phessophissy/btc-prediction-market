/**
 * AnalyticsCollector module (PR 116)
 * Provides analytics collector capabilities for the prediction market platform
 */

export interface AnalyticsCollectorConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: AnalyticsCollectorConfig = { enabled: true, threshold: 116, maxRetries: 3, timeoutMs: 5000 };

export type AnalyticsCollectorResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };
