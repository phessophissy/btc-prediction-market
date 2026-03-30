# Frontend Overview

The frontend is a Next.js App Router application under `frontend/`.

## Responsibilities

- Render live market lists and market details
- Connect a Stacks wallet
- Submit create, bet, settle, and claim transactions
- Present portfolio and leaderboard views
- Maintain a colorful, high-contrast dashboard shell across every route
- Surface derived UI signals such as liquidity, urgency, and market momentum

## Important dependency

`frontend/src/lib/contractService.ts` is the main boundary between UI components and on-chain data.

`frontend/src/lib/marketPresentation.ts` holds display-only market summaries that should stay pure and reusable.
