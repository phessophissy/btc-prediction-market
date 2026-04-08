/**
 * health-check - Module 25
 * Provides health-check capabilities for the prediction market platform
 */

export interface HealthCheckConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: HealthCheckConfig = {
  enabled: true,
  threshold: 25,
  maxRetries: 3,
  timeoutMs: 5000,
};

export type HealthCheckResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
};
