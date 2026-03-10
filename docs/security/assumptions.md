# Security Assumptions

This system assumes:

- Bitcoin block data remains available through Stacks burn block access
- Hiro API remains available for frontend read paths
- wallet clients correctly enforce transaction review and signing

The frontend is not the trust boundary. Contract logic and wallet confirmation remain the critical controls.
