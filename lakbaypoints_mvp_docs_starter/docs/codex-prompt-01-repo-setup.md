# Codex Prompt 01 — Repository Setup and Documentation

Use this prompt as the first Codex task.

---

Set up the LakbayPoints MVP monorepo.

## Context

LakbayPoints is a competition MVP for the MMITS Bagong Gawi, Bagong Galaw Challenge.

Core positioning:

**LakbayPoints: MMDA’s Verified Mode-Shift Data Layer for Metro Manila**

Tagline:

**Guide the Trip. Verify the Shift. Improve the Road.**

Core MVP loop:

**Guide the Trip → Verify the Shift → Reward Behavior → Report Access Barriers → MMDA Dashboard**

The MVP corridor is:

**EDSA–MRT3 Guadalupe to Cubao Sustainable Trip Chain Corridor**

This is a competition prototype, not full production. Do not add features outside the approved MVP scope.

## Required Repository Structure

Create the following structure:

```txt
lakbaypoints-mvp/
  apps/
    mobile/
    dashboard/
  packages/
    shared/
  data/
    routes/
    traces/
    seed/
  docs/
    mvp-scope.md
    app-user-flow.md
    data-model.md
    classifier-rules.md
    ui-style-guide.md
    git-workflow.md
    progress-tracker.md
```

## Technical Requirements

- Use TypeScript throughout.
- Prepare `apps/mobile` for an Expo React Native app.
- Prepare `apps/dashboard` for a Next.js dashboard.
- Prepare `packages/shared` for shared types, classifier logic, and utilities.
- Prepare `data/routes`, `data/traces`, and `data/seed` for static MVP demo data.
- Add a root `README.md`.
- Add basic package/workspace configuration if applicable.
- Do not implement app screens yet.
- Do not implement the classifier yet.
- Do not add authentication, payment, real-time APIs, reward redemption, carbon-credit functionality, or driver-facing features.

## Documentation Requirements

Create or preserve these documents:

1. `docs/mvp-scope.md`
2. `docs/app-user-flow.md`
3. `docs/data-model.md`
4. `docs/classifier-rules.md`
5. `docs/ui-style-guide.md`
6. `docs/git-workflow.md`
7. `docs/progress-tracker.md`

## Git / Commit Discipline

After implementation:
1. Summarize all changed files.
2. Recommend tests or commands to run.
3. Provide a proposed commit message using Conventional Commits.
4. Update `docs/progress-tracker.md`.
5. Do not commit unrelated work.

Suggested commit message:

```txt
chore: set up lakbaypoints mvp monorepo
```

## Acceptance Criteria

The task is complete when:
- the monorepo folder structure exists;
- mobile, dashboard, shared, data, and docs folders are present;
- root README exists;
- planning documents are present;
- the project can be initialized locally;
- no non-MVP features were added.
