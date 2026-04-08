# architecture decisions Operations Runbook

## Health Checks
```bash
npx ts-node scripts/mainnet-interactions.ts status
npx ts-node scripts/mainnet-interactions.ts balances
curl -s https://api.mainnet.hiro.so/v2/info | jq .burn_block_height
```

## Emergency Procedures
If claim-winnings fails (V4 bug):
1. Enable emergency mode
2. Withdraw all funds
3. Distribute manually
