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

## Phase Thresholds

| Threshold | Blocks | ~Time |
|-----------|--------|-------|
| CLOSING_SOON_THRESHOLD | 50 | ~8.3 hours |
| BLOCKS_BEFORE_SETTLEMENT | 6 | ~1 hour |
