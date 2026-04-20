# Outcome Flags

The contracts use bitwise outcome flags:

- `OUTCOME-A = u1`
- `OUTCOME-B = u2`
- `OUTCOME-C = u4`
- `OUTCOME-D = u8`

## Why flags are used

- Pack enabled outcomes into one integer
- Allow simple binary versus multi-outcome classification
- Keep read-only responses compact

## Outcome Bitmask Reference

Outcomes use a bitmask to allow multi-outcome settlement.

| Flag | Decimal | Binary | Label |
|------|---------|--------|-------|
| OUTCOME-A | 1 | 0001 | First outcome |
| OUTCOME-B | 2 | 0010 | Second outcome |
| OUTCOME-C | 4 | 0100 | Third outcome |
| OUTCOME-D | 8 | 1000 | Fourth outcome |

To settle a tied market with outcomes A and B winning, pass flag `3` (0011).
