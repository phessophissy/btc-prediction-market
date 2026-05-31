# Emergency Controls

V3 adds emergency operations for contract operators.

## Controls

- `enable-emergency-mode`
- `emergency-withdraw-all`
- `emergency-withdraw`
- `set-platform-paused`

## Risk model

These controls improve recoverability, but they also increase operator responsibility. Frontend and docs should make it clear which version is deployed and who controls it.

## Recommended Guardrails

- Add a timelock for emergency withdrawals in future contract versions.
- Publish emergency runbooks with explicit owner-signoff requirements.
- Require two-step ownership transfer before invoking emergency paths.
- Announce emergency actions in a public operations log for transparency.
