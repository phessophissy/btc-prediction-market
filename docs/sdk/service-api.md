# SDK Service API

`MarketContractService` currently exposes:

- market creation helpers
- bet placement
- settlement and claiming helpers
- market count and market detail reads
- user position reads

The SDK defaults to the original contract name unless a caller overrides it.

## Analytics Utilities

| Function | Description |
|----------|-------------|
| `estimateTotalFees` | Sum estimated platform fees across markets |
| `countBySettlement` | Count settled vs unsettled markets |
| `calculateROI` | ROI percentage for a portfolio |
| `calculateWinScore` | Composite win score for leaderboard ranking |
| `getMarketFavourite` | Identify favourite and underdog outcomes |
