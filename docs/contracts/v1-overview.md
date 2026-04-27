# Contract V1 Overview

`contracts/btc-prediction-market.clar` is the original implementation.

## Characteristics

- Uses a 5 STX market creation fee
- Uses a 1 STX minimum bet
- Includes richer market creation and read-only helpers than the stripped V3 contract

## Parameter snapshot

- `MARKET-CREATION-FEE`: `u5000000` (5 STX)
- `MIN-BET-AMOUNT`: `u1000000` (1 STX)
- `PLATFORM-FEE-PERCENT`: `u300` (3%)

The large difference between V1 and V2+/V3 defaults is a frequent source of operator confusion when switching environments.

## Why it still matters

- It is the easiest place to inspect the original intended feature set
- Some docs in the repo were written against V1 assumptions
- It provides historical context for the reduced-fee V3 deployment
