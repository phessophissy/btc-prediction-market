# Market Operations Guide #19

## Overview
This guide covers advanced market interaction patterns for prediction market participants.

### Creating Markets
- Use `create-binary-market` for simple yes/no predictions
- Settlement burn height must be at least 6 blocks in the future
- Market creation fee: 0.1 STX

### Analyzing Odds
Odds are calculated as `totalPool / outcomePool`. A higher ratio means a larger potential payout but implies the market consensus is against that outcome.

### Risk Management Strategy #19
1. Diversify across multiple markets
2. Monitor burn block height approaching settlement
3. Consider pool imbalances as arbitrage signals
4. Track historical settlement patterns

### Settlement Mechanics
Markets settle using the Bitcoin block hash at the settlement burn height. The last byte determines even/odd for binary markets; the first byte modulo N determines multi-outcome results.

> Last updated: 2026-03-16
