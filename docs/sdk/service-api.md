# SDK Service API

`MarketContractService` currently exposes:

- market creation helpers
- bet placement
- settlement and claiming helpers
- market count and market detail reads
- user position reads

The SDK defaults to the original contract name unless a caller overrides it.

## Input Validation

All SDK write functions validate their inputs before building transactions.
Errors are surfaced as `ValidationError[]` with `field`, `message`, and `code`.

Use the standalone helpers from `sdk/src/utils/validation-50.ts` for
pre-validation in UI forms before submitting to the SDK.
