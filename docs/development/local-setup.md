# Local Setup

## Root

```bash
npm install
clarinet check
```

## Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The frontend can target alternate contracts by editing `.env.local`.

## Useful Root Scripts

```bash
# Run unit-focused specs
npm run test:unit

# Check JSON config validity
npm run validate:json

# Run a focused market status suite
npm run test:market-status
```

## Quick-Start Checklist

```bash
# 1. Clone and install
git clone https://github.com/phessophissy/btc-prediction-market
cd btc-prediction-market && npm install

# 2. Copy env template
cp frontend/.env.example frontend/.env.local

# 3. Run tests
npm test

# Optional: run node-only utility tests (without Clarinet environment)
npm run test:node

# 4. Start frontend
cd frontend && npm run dev
```
