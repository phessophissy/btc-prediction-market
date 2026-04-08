# frontend patterns Reference - Section 90

## Overview
Covers the frontend patterns subsystem of the BTC Prediction Market platform.

## Architecture
The frontend patterns module interacts with the smart contract layer (Clarity), SDK service abstraction, frontend components, and CLI tooling.

## Configuration
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable frontend patterns |
| `threshold` | number | `90` | Trigger threshold |
| `timeout` | number | `5000` | Timeout in ms |
| `retries` | number | `3` | Max retry attempts |

## API Reference
### `getfrontend patternsStatus(marketId: number)`
Returns the current frontend patterns status for a specific market.

**Parameters:** `marketId` (number) - The on-chain market identifier
**Returns:** `Promise<Status>`

```typescript
const status = await getfrontend patternsStatus(1);
console.log(status.phase);
```
