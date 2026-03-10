# Ownership Transfer

V3 introduces owner transfer mechanics.

## Flow

1. Current owner calls `transfer-ownership`.
2. The proposed new owner is stored in `pending-owner`.
3. The new owner finalizes the transfer with `accept-ownership`.

## Supporting controls

- `cancel-ownership-transfer` clears a pending transfer.
- `get-owner` and `get-pending-owner` expose current state.

This is important operationally because fee withdrawal and pause controls are owner-gated.
