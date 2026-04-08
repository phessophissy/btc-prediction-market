/**
 * SocialSharing module (PR 82)
 * Provides social sharing capabilities for the prediction market platform
 */

export interface SocialSharingConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: SocialSharingConfig = { enabled: true, threshold: 82, maxRetries: 3, timeoutMs: 5000 };

export type SocialSharingResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };
