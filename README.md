# LakbayPoints MVP

LakbayPoints is MMDA's Verified Mode-Shift Data Layer for Metro Manila.

**Tagline:** Guide the Trip. Verify the Shift. Improve the Road.

This repository contains a competition MVP for the MMITS Bagong Gawi, Bagong
Galaw Challenge. It focuses on one controlled pilot corridor:

**EDSA-MRT3 Guadalupe to Cubao Sustainable Trip Chain Corridor**

## Core MVP Loop

Guide the Trip -> Verify the Shift -> Reward Behavior -> Report Access Barriers
-> MMDA Dashboard

## Repository Structure

```txt
apps/
  mobile/          Expo React Native commuter prototype
  dashboard/       Next.js MMDA dashboard prototype
packages/
  shared/          Shared TypeScript types, classifier, rewards, demo data
data/
  routes/          Static route data
  traces/          Sample GPS traces
  seed/            Demo reports and reward state
docs/              Product scope, data model, UI guide, workflow, progress
scripts/           Local smoke-check scripts
```

## Local Development

Install dependencies from the repository root:

```bash
npm install
```

Run the Expo mobile app:

```bash
npm run mobile
```

Run the Next.js dashboard app:

```bash
npm run dashboard
```

Run the main project checks:

```bash
npm run verify
```

Useful individual checks:

```bash
npm run typecheck
npm run format:check
npm run check:classifier
npm run check:rewards
```

## Collaboration Notes

- Read `docs/mvp-scope.md` before adding product behavior.
- Use Conventional Commits, as documented in `docs/git-workflow.md`.
- Keep changes scoped to the approved MVP loop.
- Do not add auth, live APIs, maps, GPS capture, camera upload, payment,
  reward redemption, carbon credits, or driver features unless the scope changes.
- Update `docs/progress-tracker.md` after meaningful changes.

## Build Principle

This is a competition prototype, not a full production system. The code should
stay simple, demo-stable, and easy for collaborators to understand.
