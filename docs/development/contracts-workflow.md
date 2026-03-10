# Contracts Workflow

Recommended workflow for contract-facing changes:

1. Update the relevant `.clar` file.
2. Run `clarinet check`.
3. Reconcile any frontend constants or docs that depend on contract values.
4. Re-test frontend read-only paths against the intended deployment.
