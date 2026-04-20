# SDK Overview

The SDK package under `sdk/` is intended to expose contract interactions in reusable TypeScript form.

## Current state

- `MarketContractService` wraps read-only calls and transaction construction
- `types.ts` exports lightweight market and user interfaces
- `index.ts` re-exports the service and a convenience initializer

## Package Structure

```
sdk/
  src/
    MarketContractService.ts  # Main entry point for contract calls
    types.ts                  # All TypeScript types
    index.ts                  # Public API re-exports
    utils/
      market-odds.ts          # Odds calculation helpers
      market-status.ts        # Phase detection helpers
      analytics.ts            # Portfolio analytics
      fee-calculator.ts       # Fee tier calculations
      validation-50.ts        # Input validation helpers
      nonce-manager.ts        # Transaction nonce cache
      settlement-watcher.ts   # Settlement detection utilities
```
