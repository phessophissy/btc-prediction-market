# Wallet Flow

Wallet state is managed through `StacksAuthContext`.

## Behavior

- On load, the context resolves pending sign-in if present.
- Connected user data is stored in React state.
- Components use `isConnected` and `stxAddress` to gate actions.

## Write operations

Transactions are submitted through `openContractCall` with explicit post conditions where appropriate.
