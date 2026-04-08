/**
 * tx-monitoring - Module 16
 * Provides tx-monitoring capabilities for the prediction market platform
 */

export interface TxMonitoringConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: TxMonitoringConfig = {
  enabled: true,
  threshold: 16,
  maxRetries: 3,
  timeoutMs: 5000,
};

export type TxMonitoringResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
};
