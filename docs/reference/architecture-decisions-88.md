# architecture decisions Reference - Section 88

## Overview
Covers the architecture decisions subsystem of the BTC Prediction Market platform.

## Architecture
The architecture decisions module interacts with the smart contract layer (Clarity), SDK service abstraction, frontend components, and CLI tooling.

## Configuration
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable architecture decisions |
| `threshold` | number | `88` | Trigger threshold |
| `timeout` | number | `5000` | Timeout in ms |
| `retries` | number | `3` | Max retry attempts |

## API Reference
### `getarchitecture decisionsStatus(marketId: number)`
Returns the current architecture decisions status for a specific market.

**Parameters:** `marketId` (number) - The on-chain market identifier
**Returns:** `Promise<Status>`

```typescript
const status = await getarchitecture decisionsStatus(1);
console.log(status.phase);
```
