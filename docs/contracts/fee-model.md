# Contract Fee Model

## V3 constants

From `contracts/btc-prediction-market-v5.clar`:

- `MARKET-CREATION-FEE`: `u100000` = `0.1 STX`
- `PLATFORM-FEE-PERCENT`: `u300` = `3%`
- `MIN-BET-AMOUNT`: `u10000` = `0.01 STX`

## Important note

Older docs in the repo still mention 5 STX creation and 1 STX minimum bets. Those values belong to the original contract, not the deployed V3 default.

## Dynamic Fee Tiers

Three tiers are now supported:

| Tier | Basis Points | Percentage |
|------|-------------|------------|
| standard | 300 | 3.00% |
| reduced | 150 | 1.50% |
| premium | 500 | 5.00% |

The fee tier is set at market creation and cannot be changed afterwards.
