/**
 * Custom error classes for market operations — batch 1
 */

export class MarketError extends Error {
  constructor(
    message: string,
    public readonly code: number,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'MarketError';
  }
}

export class MarketNotFoundError extends MarketError {
  constructor(marketId: number) {
    super(`Market #${marketId} not found`, 1001, { marketId });
    this.name = 'MarketNotFoundError';
  }
}

export class MarketClosedError extends MarketError {
  constructor(marketId: number) {
    super(`Market #${marketId} is closed for betting`, 1002, { marketId });
    this.name = 'MarketClosedError';
  }
}

export class InsufficientFundsError extends MarketError {
  constructor(required: number, available: number) {
    super(
      `Insufficient funds: need ${required} microSTX, have ${available}`,
      1006,
      { required, available }
    );
    this.name = 'InsufficientFundsError';
  }
}

export class BetTooSmallError extends MarketError {
  constructor(amount: number, minimum: number) {
    super(
      `Bet of ${amount} microSTX is below minimum of ${minimum}`,
      1007,
      { amount, minimum }
    );
    this.name = 'BetTooSmallError';
  }
}

export class SettlementNotReadyError extends MarketError {
  constructor(marketId: number, currentHeight: number, targetHeight: number) {
    super(
      `Market #${marketId} not ready: current=${currentHeight}, target=${targetHeight}`,
      1012,
      { marketId, currentHeight, targetHeight }
    );
    this.name = 'SettlementNotReadyError';
  }
}

export const VALIDATION_ERROR_CODES = {
  INVALID_ADDRESS: 'E_INVALID_ADDRESS',
  INVALID_CONTRACT_ID: 'E_INVALID_CONTRACT_ID',
  INVALID_BET_AMOUNT: 'E_INVALID_BET_AMOUNT',
  INVALID_OUTCOME: 'E_INVALID_OUTCOME',
  INVALID_SETTLEMENT_HEIGHT: 'E_INVALID_SETTLEMENT_HEIGHT',
  INVALID_TITLE: 'E_INVALID_TITLE',
  INVALID_DESCRIPTION: 'E_INVALID_DESCRIPTION',
} as const;
