# Security Assumptions

This system assumes:

- Bitcoin block data remains available through Stacks burn block access
- Hiro API remains available for frontend read paths
- wallet clients correctly enforce transaction review and signing

The frontend is not the trust boundary. Contract logic and wallet confirmation remain the critical controls.

## Fee Handling

All fee calculations use integer arithmetic (basis points) to avoid
floating-point rounding errors. Fee deductions occur post-settlement
during the claim step.
