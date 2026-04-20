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

## get-market-count

Returns the total number of markets ever created.

```clarity
(define-read-only (get-market-count)
  (var-get market-nonce))
```

## get-platform-fee

Returns the current platform fee in basis points.

```clarity
(define-read-only (get-platform-fee)
  PLATFORM-FEE-PERCENT)
```
