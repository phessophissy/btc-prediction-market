# testing strategy Reference - Section 87

## Overview
Covers the testing strategy subsystem of the BTC Prediction Market platform.

## Architecture
The testing strategy module interacts with the smart contract layer (Clarity), SDK service abstraction, frontend components, and CLI tooling.

## Configuration
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable testing strategy |
| `threshold` | number | `87` | Trigger threshold |
| `timeout` | number | `5000` | Timeout in ms |
| `retries` | number | `3` | Max retry attempts |

## API Reference
### `gettesting strategyStatus(marketId: number)`
Returns the current testing strategy status for a specific market.

**Parameters:** `marketId` (number) - The on-chain market identifier
**Returns:** `Promise<Status>`

```typescript
const status = await gettesting strategyStatus(1);
console.log(status.phase);
```
