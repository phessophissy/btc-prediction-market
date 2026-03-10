# SDK Overview

The SDK package under `sdk/` is intended to expose contract interactions in reusable TypeScript form.

## Current state

- `MarketContractService` wraps read-only calls and transaction construction
- `types.ts` exports lightweight market and user interfaces
- `index.ts` re-exports the service and a convenience initializer
