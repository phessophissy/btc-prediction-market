# data model Quick Start Guide

## Prerequisites
- Node.js 18+
- Stacks wallet with STX
- Hiro API access

## Setup
```bash
npm install
cd frontend && npm install
cp frontend/.env.example frontend/.env.local
npm run dev
```

## Creating a Market
1. Navigate to Create page
2. Enter title and description
3. Set settlement block height (current + 6 minimum)
4. Pay 0.1 STX creation fee

## Placing Bets
1. Browse open markets
2. Select outcome (A/B/C/D)
3. Enter STX amount (min 0.01)
4. Confirm in wallet

## Claiming Winnings
1. Wait for settlement (height + 6 blocks)
2. Trigger settlement
3. Click Claim on winning positions
4. Net payout = gross - 3% fee

## Troubleshooting
- **Pending tx:** Check Stacks Explorer, verify nonce
- **Rate limiting:** SDK auto-retries with backoff
- **Failed settlement:** Ensure burn height >= settlement + 6
- **Failed claim (V4 bug):** Use emergency mode
