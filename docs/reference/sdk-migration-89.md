# sdk migration Reference - Section 89

## Overview
Covers the sdk migration subsystem of the BTC Prediction Market platform.

## Architecture
The sdk migration module interacts with the smart contract layer (Clarity), SDK service abstraction, frontend components, and CLI tooling.

## Configuration
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable sdk migration |
| `threshold` | number | `89` | Trigger threshold |
| `timeout` | number | `5000` | Timeout in ms |
| `retries` | number | `3` | Max retry attempts |

## API Reference
### `getsdk migrationStatus(marketId: number)`
Returns the current sdk migration status for a specific market.

**Parameters:** `marketId` (number) - The on-chain market identifier
**Returns:** `Promise<Status>`

```typescript
const status = await getsdk migrationStatus(1);
console.log(status.phase);
```
