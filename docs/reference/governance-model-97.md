# governance model Reference - Section 97

## Overview
Covers the governance model subsystem of the BTC Prediction Market platform.

## Architecture
The governance model module interacts with the smart contract layer (Clarity), SDK service abstraction, frontend components, and CLI tooling.

## Configuration
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable governance model |
| `threshold` | number | `97` | Trigger threshold |
| `timeout` | number | `5000` | Timeout in ms |
| `retries` | number | `3` | Max retry attempts |

## API Reference
### `getgovernance modelStatus(marketId: number)`
Returns the current governance model status for a specific market.

**Parameters:** `marketId` (number) - The on-chain market identifier
**Returns:** `Promise<Status>`

```typescript
const status = await getgovernance modelStatus(1);
console.log(status.phase);
```
