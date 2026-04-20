# Data Flow

## Read path

1. A frontend route renders a component such as `MarketList` or `StatsOverview`.
2. The component calls helpers from `frontend/src/lib/contractService.ts`.
3. `contractService` posts read-only calls to Hiro API.
4. Responses are decoded into typed frontend objects.

## Write path

1. The user connects a wallet through `StacksAuthContext`.
2. A UI action such as market creation or betting calls `openContractCall`.
3. The wallet signs the transaction.
4. The frontend refreshes view state after submission.

## Operational implication

The frontend is thin by design. Contract correctness and network configuration are the real sources of truth.

## Phase Resolution Flow

```
currentBurnHeight → getMarketPhase() → MarketPhase
    ↓
compareByPhaseUrgency() → sorted list for display
```
