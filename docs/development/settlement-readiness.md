# Settlement Readiness in SDK

The SDK now exposes two separate countdown concepts for a market:

- Settlement close time: when betting closes (`settlementBurnHeight`)
- Settlement eligibility time: when settlement can be executed (`settlementBurnHeight + 6`)

## Why two timers matter

Operational tooling often needs to know both moments:

- Frontend UX should disable betting at settlement height.
- Automation should only attempt settle transactions once confirmations are satisfied.

## Helper functions

Use these helpers from `sdk/src/utils/market-status.ts`:

- `blocksUntilSettlement(market, currentBurnHeight)`
- `blocksUntilSettleable(market, currentBurnHeight)`
- `estimatedTimeToSettlement(market, currentBurnHeight)`
- `estimatedTimeToSettleable(market, currentBurnHeight)`
- `getSettleabilitySummary(market, currentBurnHeight)`

## Example

```ts
const status = getSettleabilitySummary(market, currentBurnHeight);

if (status.settleable) {
  // run settle flow
} else {
  // show countdown to settleableEta
}
```
