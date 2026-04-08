/**
 * NotificationSystem module (PR 78)
 * Provides notification system capabilities for the prediction market platform
 */

export interface NotificationSystemConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: NotificationSystemConfig = { enabled: true, threshold: 78, maxRetries: 3, timeoutMs: 5000 };

export type NotificationSystemResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };
