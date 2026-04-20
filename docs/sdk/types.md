# SDK Types

The SDK type layer includes:

- `Market`
- `Outcome`
- `UserPosition`
- `MarketStats`
- `MarketHistoricalData`

These are integration-facing convenience types rather than a complete mirror of the frontend `contractService` types.

## Type Index

| Type | Description |
|------|-------------|
| `Market` | Full market state from the contract |
| `UserPosition` | A user's position in a market |
| `OutcomeFlag` | Bitmask: 1, 2, 4, or 8 |
| `FeeTier` | `standard` \| `reduced` \| `premium` |
| `SettlementType` | `btc-price` \| `btc-hash` \| `manual` \| `oracle` |
| `LeaderboardEntry` | Ranked trader summary |
| `ValidationError` | Field-level validation failure |
| `QueuedTransaction` | Pending transaction in nonce queue |
| `NonceState` | Cached nonce info per address |
