# Bitcoin-Anchored Prediction Market

A decentralized prediction market built on Stacks (Bitcoin L2) that uses Bitcoin block hashes for provably fair settlement. Built with **Clarity 4** features.

## 🆕 Clarity 4 Features Used

| Feature | Usage |
|---------|-------|
| `tenure-height` | Get current Bitcoin block height for market deadlines |
| `get-burn-block-info?` | Retrieve Bitcoin block hashes for trustless settlement |
| `stx-account` | Check user's locked/unlocked STX for premium tiers |
| `bit-and`, `bit-or`, `bit-xor` | Pack multiple outcomes efficiently |
| `bit-shift-left`, `bit-shift-right` | Future: Efficient state encoding |
| `slice?` | Extract specific bytes from block hashes |

## 📦 Project Structure

```
btc-prediction-market/
├── Clarinet.toml           # Clarinet configuration
├── contracts/
│   ├── btc-prediction-market.clar   # Main prediction market contract
│   └── prediction-token.clar        # SIP-010 reward token
├── tests/
│   └── btc-prediction-market.test.ts
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # React components
│   │   ├── contexts/      # Auth context
│   │   └── lib/           # Utilities
│   └── package.json
└── README.md
```

## 💰 Fee Structure

| Action | Fee |
|--------|-----|
| Market Creation | 5 STX |
| Winning Payouts | 3% platform fee |
| Minimum Bet | 1 STX |

## 🎮 How It Works

### 1. Market Creation
- Creator pays 5 STX to create a market
- Specifies settlement Bitcoin block height
- Choose binary (2 outcomes) or multi-outcome (up to 4)

### 2. Betting
- Users bet on their predicted outcome
- Bets contribute to outcome-specific pools
- Odds adjust dynamically based on pool distribution

### 3. Settlement
- After settlement block + 6 confirmations
- Anyone can call `settle-market`
- Uses `get-burn-block-info?` to get Bitcoin block hash
- Winning outcome determined by hash (provably fair)

### 4. Claiming
- Winners call `claim-winnings`
- Payout = (your_bet / winning_pool) × total_pool
- 3% fee deducted from winnings

## 🚀 Getting Started

### Prerequisites
- [Clarinet](https://github.com/hirosystems/clarinet) installed
- Node.js 18+
- pnpm or npm

### Setup Contracts

```bash
cd btc-prediction-market

# Install dependencies
pnpm install

# Check contracts
clarinet check

# Run tests
clarinet test

# Or with vitest
pnpm test

# Start console
clarinet console
```

### Setup Frontend

```bash
cd frontend

# Install dependencies
pnpm install

# Create .env.local
echo "NEXT_PUBLIC_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM" > .env.local
echo "NEXT_PUBLIC_NETWORK=testnet" >> .env.local

# Run development server
pnpm dev
```

## 📝 Contract Functions

### Public Functions

```clarity
;; Create a binary market (Yes/No)
(create-binary-market 
  (title (string-utf8 256))
  (description (string-utf8 1024))
  (settlement-burn-height uint))

;; Create multi-outcome market
(create-multi-market
  (title (string-utf8 256))
  (description (string-utf8 1024))
  (settlement-burn-height uint)
  (enable-outcome-a bool)
  (enable-outcome-b bool)
  (enable-outcome-c bool)
  (enable-outcome-d bool))

;; Place bets
(bet-outcome-a (market-id uint) (amount uint))
(bet-outcome-b (market-id uint) (amount uint))
(bet-outcome-c (market-id uint) (amount uint))
(bet-outcome-d (market-id uint) (amount uint))

;; Settle market (anyone can call after settlement height)
(settle-market (market-id uint))

;; Claim winnings
(claim-winnings (market-id uint))
```

### Read-Only Functions

```clarity
;; Get market details
(get-market (market-id uint))

;; Get market odds
(get-market-odds (market-id uint))

;; Get user position
(get-user-position (market-id uint) (user principal))

;; Calculate potential payout
(calculate-potential-payout (market-id uint) (outcome uint) (bet-amount uint))

;; Check if market can be settled
(is-market-settleable (market-id uint))

;; Get blocks until settlement
(get-blocks-until-settlement (market-id uint))
```

## 🎲 Settlement Logic

The winning outcome is determined by the Bitcoin block hash:

### Binary Markets (hash-even-odd)
```clarity
;; If last byte of block hash is even → Outcome A wins
;; If last byte of block hash is odd → Outcome B wins
(if (is-hash-even block-hash) OUTCOME-A OUTCOME-B)
```

### Multi-Outcome Markets (hash-range)
```clarity
;; First byte of hash determines winner
;; Maps to outcome based on number of enabled outcomes
(mod first-byte num-outcomes)
```

## 📊 Example Usage in Clarinet Console

```clarity
;; Create a market
(contract-call? .btc-prediction-market create-binary-market 
  u"Will BTC block 880000 have even hash?" 
  u"Predict the parity of Bitcoin block hash"
  u880000)

;; Place a bet (10 STX on outcome A)
(contract-call? .btc-prediction-market bet-outcome-a u0 u10000000)

;; Check market odds
(contract-call? .btc-prediction-market get-market-odds u0)

;; After settlement height + 6 blocks, settle the market
(contract-call? .btc-prediction-market settle-market u0)

;; Claim winnings
(contract-call? .btc-prediction-market claim-winnings u0)
```

## 🔐 Security Considerations

1. **Bitcoin Finality**: Markets can only settle after 6 Bitcoin block confirmations
2. **Trustless Settlement**: Uses actual Bitcoin block hashes, no oracle needed
3. **Post-conditions**: Frontend enforces STX transfer limits
4. **No Admin Settlement**: Settlement is algorithmic, not manual

## 🗺️ Roadmap

- [ ] Add oracle-based markets for real-world events
- [ ] Implement liquidity provider mechanism
- [ ] Add governance with PMT token
- [ ] Mobile app
- [ ] Multi-chain expansion

## 📄 License

MIT License
