# User Wallet Safety

Users should review:

- target contract address
- function name
- post conditions
- network before signing

The frontend should present clear copy, but final safety still depends on wallet review before confirmation.

## Post-Condition Safety

All contract calls that transfer STX include a `makeStandardSTXPostCondition`
to ensure the contract can only deduct the exact bet amount from the caller's
wallet. Wallets like Leather display this condition for user verification.
