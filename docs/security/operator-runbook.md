# Operator Runbook

## Before changing production config

1. Confirm target network.
2. Confirm target contract address and name.
3. Reconcile fee copy with the deployed contract.

## During incidents

1. Identify whether the issue is UI-only, API-only, or contract-related.
2. Check whether V3 pause or emergency controls are relevant.
3. Document user-facing impact before changing configuration.

## Emergency Settlement

If a market cannot be settled normally (e.g. oracle outage), the contract
owner can invoke `emergency-settle` within the grace period. Steps:

1. Verify the market is in `settleable` phase
2. Confirm the winning outcome with off-chain evidence
3. Submit `emergency-settle` with the outcome flag
4. Monitor for `claim` transactions from bettors
