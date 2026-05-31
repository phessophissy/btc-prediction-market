# Market Ops Review Notes 04

These notes are intentionally short so they can sit beside small PRs without slowing review.

## Reviewer Prompts

- Does the change preserve the existing contract surface?
- Are any frontend labels still consistent with the contract behavior?
- Is the operational rollback path obvious from the changed files?

## Follow-up

If a change touches settlement behavior, add a focused test or document why manual verification is enough.
