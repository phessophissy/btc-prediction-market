# Testing Gaps

Current gaps include:

- no committed contract tests
- no committed frontend unit tests
- no automated integration coverage for wallet flows
- no deployment verification scripts

These gaps matter more than visual polish because contract/client mismatches are easy to miss without automated checks.

## Validation Coverage

All validators in `validation-50.ts` should have tests for:
- Empty / null input
- Minimum boundary (inclusive)
- Maximum boundary (inclusive)
- One value above maximum (should fail)
- Typical valid input
