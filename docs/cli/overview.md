# CLI Overview

The CLI surface is currently minimal. `cli/src/index.ts` exists as a starting point for future operator tooling.

## Planned use cases

- contract inspection
- market state checks
- operational scripts that should not live inside frontend code

At the moment, most manual workflows still happen through scripts or Clarinet.

## Utility Modules

The CLI package also exposes reusable utility modules under `cli/src/utils`:

- `wallet-inspector`: health and input validation helper for wallet-centric operations.
- `reporter`: lightweight processing/reporting helper with retries, metrics, and cache support.

These utilities are designed for internal tooling and can be imported in future command handlers.
