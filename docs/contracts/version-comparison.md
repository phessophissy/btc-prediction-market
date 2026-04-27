# Contract Version Comparison

Use this table when validating docs, frontend constants, and operator runbooks.

| Contract | Creation Fee | Min Bet | Settlement Modes | Owner Controls |
|----------|--------------|---------|------------------|----------------|
| `btc-prediction-market.clar` (V1) | 5 STX | 1 STX | `hash-even-odd`, `hash-range` | basic pause/withdraw |
| `btc-prediction-market-v2.clar` | 0.1 STX | 0.01 STX | `hash-even-odd`, `hash-range` | incremental control changes |
| `btc-prediction-market-v5.clar` (V3 default docs target) | 0.1 STX | 0.01 STX | `hash-even-odd`, `hash-range` | ownership transfer + emergency controls |
| `btc-prediction-market-v7.clar` | 0.1 STX | 0.01 STX | `hash-even-odd`, `hash-range` | ownership transfer + emergency controls |

## Consistency checks

Before deployment or frontend releases:

1. Confirm the deployed contract filename/version.
2. Confirm UI constants match the deployed contract constants.
3. Confirm runbooks refer to the correct settlement mode and confirmation window.
