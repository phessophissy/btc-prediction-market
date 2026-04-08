# clarity patterns Reference - Section 91

## Overview
Covers the clarity patterns subsystem of the BTC Prediction Market platform.

## Architecture
The clarity patterns module interacts with the smart contract layer (Clarity), SDK service abstraction, frontend components, and CLI tooling.

## Configuration
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable clarity patterns |
| `threshold` | number | `91` | Trigger threshold |
| `timeout` | number | `5000` | Timeout in ms |
| `retries` | number | `3` | Max retry attempts |

## API Reference
### `getclarity patternsStatus(marketId: number)`
Returns the current clarity patterns status for a specific market.

**Parameters:** `marketId` (number) - The on-chain market identifier
**Returns:** `Promise<Status>`

```typescript
const status = await getclarity patternsStatus(1);
console.log(status.phase);
```

## Error Handling
| Code | Description | Resolution |
|------|-------------|------------|
| u1001 | Market not found | Verify market ID |
| u1002 | Market closed | Cannot bet on closed markets |
| u1007 | Bet too small | Min 0.01 STX |
| u1012 | Not ready to settle | Wait for block maturation |

Recovery: exponential backoff (2s, 4s, 8s), max 3 retries.
