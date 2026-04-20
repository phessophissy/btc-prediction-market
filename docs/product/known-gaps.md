# Known Gaps

Current repo gaps include:

- sparse automated tests
- minimal CLI implementation
- SDK docs without worked examples
- historical docs that can drift away from the deployed contract version

These are good candidates for follow-up work because they affect maintainability more than aesthetics.

## Known Gaps

- Multi-outcome settlement (tied markets) is not yet exposed in the frontend UI
- Fractional odds display is implemented in SDK but not wired to a UI toggle
- Leaderboard data requires full event log scan (no indexed API endpoint yet)
- Price alert notifications require browser notification permission
