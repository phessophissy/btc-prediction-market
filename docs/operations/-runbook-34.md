#  Operations Runbook

## Health Checks

1. Verify contract is accessible:
   ```bash
   npx ts-node scripts/mainnet-interactions.ts status
   ```

2. Check wallet balances:
   ```bash
   npx ts-node scripts/mainnet-interactions.ts balances
   ```

3. Monitor API availability:
   ```bash
   curl -s https://api.mainnet.hiro.so/v2/info | jq .burn_block_height
   ```

## Emergency Procedures

### Stuck Funds Recovery

If claim-winnings fails (known V4 bug):
1. Enable emergency mode: `emergency enable`
2. Withdraw all funds: `emergency withdraw`
3. Distribute winnings manually from owner wallet
