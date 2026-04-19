# Architecture Overview

The project is centered on a Bitcoin-anchored prediction market implemented in Clarity and surfaced through a Next.js client.

## Main layers

- `contracts/`: on-chain market logic and token traits
- `frontend/`: market discovery, wallet connection, betting, settlement, and portfolio views
- `sdk/`: reusable TypeScript wrapper around contract calls
- `cli/`: currently minimal entry point for future operator tooling

## Current operating model

- The frontend reads on-chain state through Hiro API read-only calls.
- Transactions are submitted from the browser with `@stacks/connect`.
- The deployed frontend defaults to the V3 market contract on mainnet, but can now be overridden with `NEXT_PUBLIC_*` environment variables.

<!-- [fix/settlement-race-condition] commit 9/10: revise docs layer – 1776638414803134190 -->
