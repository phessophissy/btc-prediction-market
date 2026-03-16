/**
 * Input validation utilities — batch 50
 * Ensures contract call parameters are within acceptable ranges.
 */

export const MIN_TITLE_LENGTH = 3;
export const MAX_TITLE_LENGTH = 256;
export const MIN_DESCRIPTION_LENGTH = 5;
export const MAX_DESCRIPTION_LENGTH = 1024;
export const MIN_SETTLEMENT_OFFSET = 6;

export function validateTitle(title: string): { valid: boolean; error?: string } {
  if (!title || title.trim().length < MIN_TITLE_LENGTH) {
    return { valid: false, error: `Title must be at least ${MIN_TITLE_LENGTH} characters` };
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return { valid: false, error: `Title must not exceed ${MAX_TITLE_LENGTH} characters` };
  }
  return { valid: true };
}

export function validateDescription(desc: string): { valid: boolean; error?: string } {
  if (!desc || desc.trim().length < MIN_DESCRIPTION_LENGTH) {
    return { valid: false, error: `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters` };
  }
  if (desc.length > MAX_DESCRIPTION_LENGTH) {
    return { valid: false, error: `Description exceeds ${MAX_DESCRIPTION_LENGTH} characters` };
  }
  return { valid: true };
}

export function validateSettlementHeight(
  currentHeight: number,
  targetHeight: number
): { valid: boolean; error?: string } {
  const offset = targetHeight - currentHeight;
  if (offset < MIN_SETTLEMENT_OFFSET) {
    return { valid: false, error: `Settlement must be at least ${MIN_SETTLEMENT_OFFSET} blocks in the future (got ${offset})` };
  }
  return { valid: true };
}

export function validateBetAmount(amount: number, minBet = 10000): { valid: boolean; error?: string } {
  if (!Number.isFinite(amount) || amount < minBet) {
    return { valid: false, error: `Bet amount must be at least ${minBet} microSTX` };
  }
  return { valid: true };
}
