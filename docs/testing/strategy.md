# Testing Strategy

Current testing coverage is light.

## Effective checks today

- `clarinet check` for contract validation
- `npm run build` inside `frontend/` for TypeScript and route integrity

## Recommended direction

- add unit tests for frontend utilities
- add contract-level Clarinet tests
- add smoke tests for wallet-gated flows

## Market Status Utils

Tests should cover all six phases with boundary block heights.
Pay special attention to the `settled` vs `claimable` distinction:
a market is `claimable` only when `winningOutcome !== null`.
