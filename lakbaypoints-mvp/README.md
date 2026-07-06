# LakbayPoints MVP

**LakbayPoints** is an MMDA/JICA-aligned Travel Demand Management MVP that guides, verifies, rewards, and measures sustainable commuter trip chains.

## Core MVP Loop

**Guide the Trip → Verify the Shift → Reward Behavior → Report Access Barriers → MMDA Dashboard**

## MVP Corridor

**EDSA–MRT3 Guadalupe to Cubao Sustainable Trip Chain Corridor**

Selected station access zones:

- Guadalupe
- Boni
- Shaw Boulevard
- Ortigas
- Santolan-Annapolis
- Araneta Center-Cubao

## Repository Structure

```txt
lakbaypoints-mvp/
  apps/
    mobile/          # Expo React Native commuter app
    dashboard/       # Next.js MMDA dashboard
  packages/
    shared/          # shared types, classifier logic, seed utilities
  data/
    routes/          # static route JSON/GeoJSON
    traces/          # sample GPS traces
    seed/            # demo reports, users, trips
  docs/
    mvp-scope.md
    app-user-flow.md
    data-model.md
    classifier-rules.md
    ui-style-guide.md
    git-workflow.md
    progress-tracker.md
    codex-prompt-01-repo-setup.md
```

## Local Development

Install dependencies from the monorepo root:

```bash
cd lakbaypoints-mvp
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

Useful workspace checks:

```bash
npm run typecheck
npm run format:check
```

Package summary:

- `apps/mobile` is the Expo React Native TypeScript app.
- `apps/dashboard` is the Next.js TypeScript dashboard app.
- `packages/shared` is the placeholder shared TypeScript package.
- `data/routes`, `data/traces`, and `data/seed` are reserved for MVP demo data.

## Build Principle

This is a **competition MVP**, not full production.

The MVP must prove one loop:

1. Commuter selects a sustainable Guadalupe → Cubao route.
2. Trip is verified using a rule-based classifier.
3. User earns Lakbay Score and campaign-based Lakbay Points.
4. User reports one access barrier.
5. MMDA dashboard shows the report and corridor insight.

Do not add features outside the approved MVP scope.
