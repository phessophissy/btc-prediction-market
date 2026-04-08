# performance tuning Reference - Section 92

## Overview
Covers the performance tuning subsystem of the BTC Prediction Market platform.

## Architecture
The performance tuning module interacts with the smart contract layer (Clarity), SDK service abstraction, frontend components, and CLI tooling.

## Configuration
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable performance tuning |
| `threshold` | number | `92` | Trigger threshold |
| `timeout` | number | `5000` | Timeout in ms |
| `retries` | number | `3` | Max retry attempts |

## API Reference
### `getperformance tuningStatus(marketId: number)`
Returns the current performance tuning status for a specific market.

**Parameters:** `marketId` (number) - The on-chain market identifier
**Returns:** `Promise<Status>`

```typescript
const status = await getperformance tuningStatus(1);
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
