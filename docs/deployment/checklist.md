# Deployment Checklist

## Before deploy

1. Run `clarinet check`.
2. Run `npm run build` in `frontend/`.
3. Confirm environment variables point to the intended network and contract.
4. Verify docs and UI fee copy match the deployed contract version.

## After deploy

1. Open core pages.
2. Check wallet connection.
3. Verify read-only market calls succeed.

## Nonce Pre-flight Check

- [ ] Confirm account nonce matches expected value: `stacks-cli account nonce <address>`
- [ ] Ensure no pending transactions are stuck in mempool
- [ ] Clear SDK nonce cache if restarting after failed batch
