# Security Assumptions

This system assumes:

- Bitcoin block data remains available through Stacks burn block access
- Hiro API remains available for frontend read paths
- wallet clients correctly enforce transaction review and signing

The frontend is not the trust boundary. Contract logic and wallet confirmation remain the critical controls.

## Client-Side Validation

Client-side validation (TypeScript helpers) is a UX convenience layer only.
All security-critical constraints are enforced on-chain by the Clarity contract.
Never rely solely on client-side checks for security guarantees.
