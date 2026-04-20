# Fee Reference

## V3 defaults

- creation fee: `0.1 STX`
- winnings fee: `3%`
- minimum bet: `0.01 STX`

## Why this doc exists

The root README and older contract history can mention larger values. Use the deployed contract version as the final source of truth.

## Kelly Criterion

The `kellyFraction` helper in `market-odds.ts` implements the Kelly criterion
for bet sizing. It returns the fraction of bankroll to stake for maximum
log-growth given the implied probability and odds multiplier.
