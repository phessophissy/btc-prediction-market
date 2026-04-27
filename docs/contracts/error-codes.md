# Contract Error Codes

Common error constants used across the market contracts:

- `u1000`: not authorized
- `u1001`: market not found
- `u1002`: market closed
- `u1003`: market not settled
- `u1004`: market already settled
- `u1005`: invalid outcome
- `u1006`: insufficient funds
- `u1007`: bet too small
- `u1008`: already claimed
- `u1009`: no position

V3 adds extra owner-transfer and emergency-related codes on top of the base set.

## Error Code Reference

| Code | Constant | Description |
|------|----------|-------------|
| u1000 | ERR-NOT-AUTHORIZED | Caller is not the contract owner or creator |
| u1001 | ERR-MARKET-NOT-FOUND | Market ID does not exist |
| u1002 | ERR-MARKET-CLOSED | Betting period has ended |
| u1003 | ERR-MARKET-NOT-SETTLED | Settlement not yet performed |
| u1004 | ERR-MARKET-ALREADY-SETTLED | Market was already settled |
| u1005 | ERR-INVALID-OUTCOME | Outcome flag is not valid |
| u1006 | ERR-INSUFFICIENT-FUNDS | Caller has insufficient STX balance |
| u1007 | ERR-BET-TOO-SMALL | Bet is below minimum amount |
| u1008 | ERR-ALREADY-CLAIMED | Position already claimed |
| u1009 | ERR-NO-POSITION | Caller has no position in market |
| u1010 | ERR-BURN-BLOCK-NOT-AVAILABLE | Bitcoin block info unavailable |
| u1011 | ERR-INVALID-MARKET-PARAMS | Market creation parameters invalid |
| u1012 | ERR-MARKET-NOT-READY-TO-SETTLE | Settlement height not reached |
| u1013 | ERR-TRANSFER-FAILED | STX transfer failed |
| u1014 | ERR-PENDING-OWNER-ONLY | Caller is not the pending owner |
| u1015 | ERR-NO-PENDING-OWNER | No pending ownership transfer |
| u1016 | ERR-INSUFFICIENT-FEE-BALANCE | Requested fee withdrawal exceeds tracked withdrawable balance |
