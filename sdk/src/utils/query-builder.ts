/**
 * QueryBuilder module (PR 120)
 * Provides query builder capabilities for the prediction market platform
 */

export interface QueryBuilderConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: QueryBuilderConfig = { enabled: true, threshold: 120, maxRetries: 3, timeoutMs: 5000 };

export type QueryBuilderResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };
