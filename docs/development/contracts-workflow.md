# Contracts Workflow

Recommended workflow for contract-facing changes:

1. Update the relevant `.clar` file.
2. Run `clarinet check`.
3. Reconcile any frontend constants or docs that depend on contract values.
4. Re-test frontend read-only paths against the intended deployment.

## Nonce Management

Rapid consecutive transactions from the same address require nonce
increment management. The SDK `nonce-manager` utility maintains an
in-memory cache with a 30-second staleness window. Clear the cache
before test runs with `clearNonceCache()`.
