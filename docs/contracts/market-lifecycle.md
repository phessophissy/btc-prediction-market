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
