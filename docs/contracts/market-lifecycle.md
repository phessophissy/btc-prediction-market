# Market Lifecycle

## Creation

- A creator submits a market title, description, and settlement burn block height.
- The contract collects the configured creation fee.

## Participation

- Users place STX bets on enabled outcomes.
- Outcome pools and total pool values update on chain.

## Settlement

- After the required burn height and confirmation window, a caller settles the market.
- Winning outcome selection is derived from Bitcoin block data.

## Claiming

- Winning users claim payouts after settlement.
- Platform fee is deducted from winnings according to contract rules.

## Settlement Types

| Type | Description |
|------|-------------|
| `hash-even-odd` | Binary market: last byte parity decides outcome A/B |
| `hash-range` | Multi-outcome market: hash byte modulo enabled outcomes |

Settlement eligibility requires the configured settlement height plus confirmation buffer (`+6` burn blocks by default).
