/**
 * OnboardingFlow module (PR 85)
 * Provides onboarding flow capabilities for the prediction market platform
 */

export interface OnboardingFlowConfig {
  enabled: boolean;
  threshold: number;
  maxRetries: number;
  timeoutMs: number;
}

export const DEFAULT_CONFIG: OnboardingFlowConfig = { enabled: true, threshold: 85, maxRetries: 3, timeoutMs: 5000 };

export type OnboardingFlowResult<T> = { success: boolean; data?: T; error?: string; timestamp: number };
