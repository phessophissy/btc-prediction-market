# Repository Layout

## Root

- `Clarinet.toml`: Clarinet project and analysis configuration
- `README.md`: high-level project overview
- `package.json`: root scripts for testing and contract workflows

## Contracts

- `contracts/btc-prediction-market.clar`: original contract
- `contracts/btc-prediction-market-v2.clar`: intermediate version
- `contracts/btc-prediction-market-v5.clar`: current deployed version targeted by the frontend

## Frontend

- `frontend/src/app/`: Next.js app router pages and shared layout
- `frontend/src/components/`: cards, modals, page shell, and shared UI pieces
- `frontend/src/lib/`: client-side contract utilities and constants

## Tooling

- `sdk/`: package intended for reusable integration code
- `cli/`: package intended for command-line workflows
- `deployments/`: Clarinet deployment plan files
