/**
 * ReportingEngine module (PR 86)
 * Provides reporting engine capabilities for the prediction market platform
 */

export interface ReportingEngineConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: ReportingEngineConfig = { enabled: true, threshold: 86, maxRetries: 3, timeoutMs: 5000 };

export type ReportingEngineResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };
