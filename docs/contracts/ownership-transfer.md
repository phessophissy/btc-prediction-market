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

## Two-Step Ownership Transfer

Ownership uses a two-step transfer pattern to prevent accidental loss of control:

1. **Propose**: Current owner calls `(transfer-ownership new-owner)` to set `pending-owner`
2. **Accept**: The new owner calls `(accept-ownership)` to finalise the transfer

If `accept-ownership` is never called, the current owner can cancel with
`(cancel-ownership-transfer)`. There is no time limit on the pending period.
