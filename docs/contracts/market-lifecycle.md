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

## Phase Urgency Order

When sorting markets for display, the recommended urgency order is:

1. `claimable` – user has unclaimed winnings
2. `settleable` – market can be settled now
3. `closing-soon` – betting closes within 50 blocks (~8h)
4. `open` – accepting bets normally
5. `closed` – waiting for settlement window
6. `settled` – fully resolved, all claims processed
