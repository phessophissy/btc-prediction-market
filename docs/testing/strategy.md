# Testing Strategy

Current testing coverage is light.

## Effective checks today

- `clarinet check` for contract validation
- `npm run build` inside `frontend/` for TypeScript and route integrity

## Recommended direction

- add unit tests for frontend utilities
- add contract-level Clarinet tests
- add smoke tests for wallet-gated flows

## Odds Utilities

Unit tests for `market-odds.ts` should cover:
- `calculateImpliedProbability` with zero and non-zero pool
- `toMoneyline` for favourite (< 2x) and underdog (≥ 2x)
- `toFractionalOdds` GCD reduction correctness
- `kellyFraction` boundary conditions (prob=0, prob=1, odds=1)
