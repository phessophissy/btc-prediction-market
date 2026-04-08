#  Quick Start Guide

## Prerequisites

- Node.js 18+
- Stacks wallet with STX balance
- Access to Hiro API (mainnet or testnet)

## Installation

```bash
npm install
cd frontend && npm install
```

## First Steps

### 1. Configure Environment

```bash
cp frontend/.env.example frontend/.env.local
# Edit with your contract address and network
```

### 2. Run the Development Server

```bash
cd frontend && npm run dev
```

### 3. Connect Your Wallet

Click "Connect Wallet" and approve the connection in your Stacks wallet extension.

## Common Workflows

### Creating a Market

1. Navigate to the Create page
2. Enter title and description
3. Set settlement block height (minimum current + 6)
4. Confirm and pay the 0.1 STX creation fee

### Placing a Bet

1. Browse open markets
2. Click the outcome you want to bet on
3. Enter your STX amount (minimum 0.01 STX)
4. Confirm the transaction in your wallet

### Claiming Winnings

1. Wait for market settlement (after settlement height + 6 blocks)
2. Any user can trigger settlement
3. Winners click "Claim" on their positions
4. Net payout = gross payout - 3% platform fee
