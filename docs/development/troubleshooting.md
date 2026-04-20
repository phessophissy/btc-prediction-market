# Troubleshooting

## Frontend cannot load markets

- Verify `NEXT_PUBLIC_CONTRACT_ADDRESS`
- Verify `NEXT_PUBLIC_CONTRACT_NAME`
- Verify `NEXT_PUBLIC_NETWORK`
- Confirm Hiro API availability for the selected network

## Wallet flow issues

- Refresh after a cancelled or stale sign-in attempt
- Confirm the wallet supports the selected network

## UI copy mismatch

If fee or minimum bet values look wrong, compare the frontend constants with the deployed contract version before changing text.

## Rate Limit Errors

If you receive HTTP 429 from the Stacks API, the SDK rate-limiter
has a token bucket implementation in `sdk/src/utils/rate-limiter.ts`.
The default limit is 60 requests per minute. Use `refillBucket` and
`consumeToken` to integrate backpressure into custom tooling.
