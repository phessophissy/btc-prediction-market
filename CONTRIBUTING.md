# Contributing

## Scope

This repository contains three active surfaces:

- Clarity contracts in `contracts/`
- A Next.js frontend in `frontend/`
- TypeScript SDK and CLI scaffolding in `sdk/` and `cli/`

Keep changes narrow. A small reviewable commit is preferred over a broad refactor.

## Local workflow

1. Install root dependencies with `npm install`.
2. Install frontend dependencies with `cd frontend && npm install`.
3. Run `clarinet check` before contract-facing changes.
4. Run `npm run build` inside `frontend/` before frontend pushes.

## Commit guidance

- Use one commit per real unit of work.
- Prefer imperative commit messages.
- Do not mix unrelated contract, UI, and docs edits in one commit.

## Pull request notes

- Document which contract version the change targets.
- Call out any network-specific assumptions.
- Include screenshots for frontend visual changes when relevant.

<!-- [refactor/contract-service-split] commit 9/10: revise docs layer – 1776638498316026781 -->
