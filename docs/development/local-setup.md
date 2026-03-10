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
