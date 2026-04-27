# Deployment Checklist

## Before deploy

1. Run `clarinet check`.
2. Run `npm run build` in `frontend/`.
3. Confirm environment variables point to the intended network and contract.
4. Verify docs and UI fee copy match the deployed contract version.
5. Confirm issue #9 remediation status has been reviewed for target contract version.

## After deploy

1. Open core pages.
2. Check wallet connection.
3. Verify read-only market calls succeed.
4. Verify treasury guardrails:
	- `get-total-fees-collected`
	- `get-withdrawable-fees` (where available)
	- `withdraw-fees` cannot exceed tracked fee balance

## Nonce Pre-flight Check

- [ ] Confirm account nonce matches expected value: `stacks-cli account nonce <address>`
- [ ] Ensure no pending transactions are stuck in mempool
- [ ] Clear SDK nonce cache if restarting after failed batch
