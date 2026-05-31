# Security Audit Tracker (Issue #9)

Reference issue:
- https://github.com/phessophissy/btc-prediction-market/issues/9

This tracker maps audit themes to current repository status for easier review and follow-up.

## Critical Findings

### C-01: Claim payout recipient handling

Status: mitigated in current contract variants where claimant is captured before contract transfer.

Validation notes:
- Confirm transfer recipient is caller principal, not contract principal.
- Confirm claim path still marks position as claimed only once.

### C-02: Fee withdrawal bound checks

Status: active hardening path.

Validation notes:
- Ensure withdraw amount is bounded by tracked withdrawable fee balance.
- Ensure fee ledger is decremented on successful withdrawal.
- Ensure market creation fees transferred directly to owner are not double-counted as contract-held fees.

## High and Medium Follow-ups

- Add explicit timelock design proposal for emergency withdrawal paths.
- Add cancellation/refund pattern for irrecoverable settlement scenarios.
- Add contract-level integration tests for treasury edge cases.

## Operator Checklist

- Verify `get-withdrawable-fees` before any treasury withdrawal.
- Ensure emergency controls are documented and owner responsibilities are transparent.
- Confirm deployment docs and frontend copy refer to deployed contract version and active fee model.
