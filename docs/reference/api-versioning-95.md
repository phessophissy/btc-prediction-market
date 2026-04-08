# api versioning Reference - Section 95

## Overview
Covers the api versioning subsystem of the BTC Prediction Market platform.

## Architecture
The api versioning module interacts with the smart contract layer (Clarity), SDK service abstraction, frontend components, and CLI tooling.

## Configuration
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable api versioning |
| `threshold` | number | `95` | Trigger threshold |
| `timeout` | number | `5000` | Timeout in ms |
| `retries` | number | `3` | Max retry attempts |

## API Reference
### `getapi versioningStatus(marketId: number)`
Returns the current api versioning status for a specific market.

**Parameters:** `marketId` (number) - The on-chain market identifier
**Returns:** `Promise<Status>`

```typescript
const status = await getapi versioningStatus(1);
console.log(status.phase);
```
