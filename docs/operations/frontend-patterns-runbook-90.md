# frontend patterns Operations Runbook

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

## Monitoring Checklist
- [ ] Market count increasing as expected
- [ ] Settlement transactions succeeding
- [ ] Wallet balances sufficient
- [ ] API response times < 2s
- [ ] No stuck pending transactions

## Escalation
- Contract Owner: Deployer wallet
- Emergency Mode: Owner-only
- API Issues: Hiro support
