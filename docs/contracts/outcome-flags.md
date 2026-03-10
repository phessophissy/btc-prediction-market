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
