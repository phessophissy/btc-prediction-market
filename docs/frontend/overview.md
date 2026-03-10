# Frontend Overview

The frontend is a Next.js App Router application under `frontend/`.

## Responsibilities

- Render live market lists and market details
- Connect a Stacks wallet
- Submit create, bet, settle, and claim transactions
- Present portfolio and leaderboard views

## Important dependency

`frontend/src/lib/contractService.ts` is the main boundary between UI components and on-chain data.
