/**
 * CircuitBreaker module (PR 113)
 * Provides circuit breaker capabilities for the prediction market platform
 */

export interface CircuitBreakerConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: CircuitBreakerConfig = { enabled: true, threshold: 113, maxRetries: 3, timeoutMs: 5000 };

export type CircuitBreakerResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };
