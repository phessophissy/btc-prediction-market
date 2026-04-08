/**
 * SettlementWatcher module (PR 84)
 * Provides settlement watcher capabilities for the prediction market platform
 */

export interface SettlementWatcherConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: SettlementWatcherConfig = { enabled: true, threshold: 84, maxRetries: 3, timeoutMs: 5000 };

export type SettlementWatcherResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };
