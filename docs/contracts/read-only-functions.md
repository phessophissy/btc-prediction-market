# Read-only Functions

The frontend depends primarily on read-only functions to render market state.

## Core functions

- `get-market`
- `get-market-count`
- `get-user-position`
- `get-total-fees-collected`
- `get-current-burn-height`

## Version note

The original contract exposes more read-only helpers than the reduced V3 contract. Client code should not assume every helper exists on every deployed version.
