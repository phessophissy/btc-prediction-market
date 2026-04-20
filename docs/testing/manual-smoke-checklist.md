# Manual Smoke Checklist

After significant frontend or contract wiring changes:

1. Load the home page.
2. Load `/markets`.
3. Load `/create`.
4. Load `/portfolio`.
5. Load `/leaderboard`.
6. Confirm wallet connect still renders.
7. Confirm market fetches do not throw client-side errors.

## Settlement Smoke Test

- [ ] Create market with `settlementBurnHeight = currentBurnHeight + 12`
- [ ] Place bets on at least two outcomes from two different wallets
- [ ] Wait for settlement height to pass
- [ ] Call `settle-market` and confirm tx success
- [ ] Both wallets call `claim-winnings`
- [ ] Verify winning wallet received correct payout minus fee
- [ ] Verify losing wallet received nothing
