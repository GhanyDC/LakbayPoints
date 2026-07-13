# Contributing

Thanks for helping with LakbayPoints. This is a competition MVP, so keep changes
small, scoped, and easy to demo.

## Setup

```bash
npm install
```

## Daily Commands

```bash
npm run mobile
npm run dashboard
npm run verify
```

## Before Opening a Pull Request

1. Confirm the change fits `docs/mvp-scope.md`.
2. Run `npm run format:check`.
3. Run `npm run verify`.
4. Update `docs/progress-tracker.md` for meaningful product or workflow changes.
5. Use a Conventional Commit message.

## Scope Guardrails

Do not add these without an explicit scope update:

- Authentication or user accounts
- Firebase, Supabase, or production backend integration
- Real GPS capture, maps, camera upload, or real-time APIs
- Payment, reward redemption, carbon credits, or driver features
- Automated enforcement, dispatch, or surveillance framing

## Commit Style

Use Conventional Commits:

```txt
feat: add dashboard report queue
fix: correct reward cap calculation
docs: update demo setup notes
chore: reorganize repository layout
```
