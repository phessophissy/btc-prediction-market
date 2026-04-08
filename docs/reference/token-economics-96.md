# token economics Reference - Section 96

## Overview
Covers the token economics subsystem of the BTC Prediction Market platform.

## Architecture
The token economics module interacts with the smart contract layer (Clarity), SDK service abstraction, frontend components, and CLI tooling.

## Configuration
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable token economics |
| `threshold` | number | `96` | Trigger threshold |
| `timeout` | number | `5000` | Timeout in ms |
| `retries` | number | `3` | Max retry attempts |

## API Reference
### `gettoken economicsStatus(marketId: number)`
Returns the current token economics status for a specific market.

**Parameters:** `marketId` (number) - The on-chain market identifier
**Returns:** `Promise<Status>`

```typescript
const status = await gettoken economicsStatus(1);
console.log(status.phase);
```
