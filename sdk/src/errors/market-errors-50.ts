/**
 * Custom error classes for market operations — batch 50
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
