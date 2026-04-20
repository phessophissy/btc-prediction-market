# Frontend Pages

Current route surfaces:

- `/`: landing page, stats snapshot, workflow messaging, and active markets
- `/markets`: directory-style listing with search, type filtering, sorting, and quick insight panels
- `/create`: market creation flow with prompt templates and a live preview column
- `/portfolio`: connected wallet positions with status filters and clearer summary messaging
- `/leaderboard`: ranked wallet view with podium cards, summary metrics, and highlighted top rows

Each route lives under `frontend/src/app/`.

## Leaderboard Page

Displays the top traders by total winnings. Columns:
- Rank
- Address (truncated)
- Total Won (STX)
- Total Invested (STX)
- ROI %
- Win Rate %

Data is fetched from the `buildLeaderboard` SDK utility and cached for 60s.
