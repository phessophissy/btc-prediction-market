# incident response Reference - Section 93

## Overview
Covers the incident response subsystem of the BTC Prediction Market platform.

## Architecture
The incident response module interacts with the smart contract layer (Clarity), SDK service abstraction, frontend components, and CLI tooling.

## Configuration
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable incident response |
| `threshold` | number | `93` | Trigger threshold |
| `timeout` | number | `5000` | Timeout in ms |
| `retries` | number | `3` | Max retry attempts |

## API Reference
### `getincident responseStatus(marketId: number)`
Returns the current incident response status for a specific market.

**Parameters:** `marketId` (number) - The on-chain market identifier
**Returns:** `Promise<Status>`

```typescript
const status = await getincident responseStatus(1);
console.log(status.phase);
```
