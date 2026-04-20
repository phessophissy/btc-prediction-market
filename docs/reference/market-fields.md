# Market Fields Reference

Frontend market objects include:

- `id`
- `creator`
- `title`
- `description`
- `settlementHeight`
- `possibleOutcomes`
- `totalPool`
- `outcomeAPool` through `outcomeDPool`
- `winningOutcome`
- `settled`
- `currentBurnHeight`
- derived `type`

## Extended Metadata Fields

Metadata is stored off-chain and linked via an IPFS CID or HTTPS URL.

| Field | Type | Max Length |
|-------|------|------------|
| tags | string[] | 5 tags × 32 chars |
| imageUrl | string | 256 chars |
| creatorNote | string | 280 chars |
