# api versioning Quick Start Guide

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
