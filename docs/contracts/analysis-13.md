# Contract Analysis Notes #13

## V3 Contract Surface

### Public Functions
| Function | Parameters | Fee |
|----------|-----------|-----|
| `create-binary-market` | title, description, settlement-height | 0.1 STX |
| `transfer-ownership` | new-owner principal | None |
| `accept-ownership` | — | None |
| `enable-emergency-mode` | — | Owner only |
| `emergency-withdraw-all` | — | Emergency only |
| `set-platform-paused` | bool | Owner only |

### Read-Only Functions
- `get-market` — returns full market map entry
- `get-market-count` — returns current market nonce
- `get-user-position` — returns user position in a given market
- `get-total-fees-collected` — accumulated platform fees
- `get-current-burn-height` — current Bitcoin tenure height

### Security Model
- Two-step ownership transfer (initiate → accept)
- Emergency mode gates withdrawals
- Platform pause halts market creation
- Post-condition mode set to Allow on creation

### Outcome Encoding
Outcomes use bitwise flags: A=1, B=2, C=4, D=8. Binary markets pack `0b0011` (A+B). Multi-outcome markets enable additional bits.

### Fee Structure
- Creation fee: 100,000 microSTX (0.1 STX)
- Platform fee on winnings: 3% (300 basis points)
- Minimum bet: 10,000 microSTX (0.01 STX)
