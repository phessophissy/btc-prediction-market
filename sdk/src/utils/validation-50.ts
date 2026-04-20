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

/**
 * Validate a Stacks principal address (mainnet SP… or testnet ST…).
 */
export function validatePrincipal(address: string): string[] {
  const errors: string[] = [];
  if (!address) { errors.push('Address is required'); return errors; }
  if (!/^(SP|ST|SM)[A-Z0-9]{28,41}$/.test(address)) {
    errors.push(`Invalid Stacks address format: ${address.slice(0, 20)}`);
  }
  return errors;
}

/**
 * Validate a contract identifier in the format 'address.contract-name'.
 */
export function validateContractId(contractId: string): string[] {
  const errors: string[] = [];
  if (!contractId.includes('.')) {
    errors.push('Contract ID must be in format address.contract-name');
    return errors;
  }
  const [address, name] = contractId.split('.');
  errors.push(...validatePrincipal(address));
  if (!/^[a-z][a-z0-9-]{0,39}$/.test(name)) {
    errors.push(`Invalid contract name: ${name}`);
  }
  return errors;
}

const MIN_BET_MICROSTX = 10_000;
const MAX_BET_MICROSTX = 1_000_000_000_000;

/**
 * Validate a bet amount in microstx.
 */
export function validateBetAmount(amount: number): string[] {
  const errors: string[] = [];
  if (!Number.isInteger(amount)) errors.push('Bet amount must be an integer');
  if (amount < MIN_BET_MICROSTX) errors.push(`Minimum bet is ${MIN_BET_MICROSTX} microstx`);
  if (amount > MAX_BET_MICROSTX) errors.push(`Maximum bet is ${MAX_BET_MICROSTX} microstx`);
  return errors;
}
