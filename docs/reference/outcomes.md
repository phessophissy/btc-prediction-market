# Outcome Reference

Binary markets typically label:

- `A`: Yes / Even
- `B`: No / Odd

Multi-outcome markets typically label:

- `A`: Quarter A
- `B`: Quarter B
- `C`: Quarter C
- `D`: Quarter D

Exact presentation is handled in frontend display helpers.

## Odds Formats

The SDK exposes three odds format helpers:
- `formatOdds` – decimal (e.g. `2.50x`)
- `toFractionalOdds` – fractional (e.g. `3/2`)
- `toMoneyline` – American (e.g. `+150`)
