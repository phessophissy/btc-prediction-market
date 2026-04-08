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

## Troubleshooting

### Transaction Pending Too Long

Stacks transactions typically confirm within 10-30 minutes. If your transaction
is pending for more than an hour:
- Check the transaction on the Stacks Explorer
- Verify your nonce is not blocked by a prior pending transaction
- Consider using Replace-By-Fee if available

### API Rate Limiting

The Hiro API may rate-limit requests during high traffic:
- The SDK includes automatic retry with exponential backoff
- Maximum 3 retries with 2s, 4s, 8s delays
- Consider using a dedicated API key for production use
