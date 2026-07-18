# LakbayPoints MVP Progress Tracker

Update this file after every meaningful change.

## Current Phase

**Phase 0A: Challenge MVP Stabilization**

## Build Status

| Module | Status | Owner | Notes |
|---|---|---|---|
| Repo setup | Done | TBD | npm workspace monorepo foundation at repository root |
| Quality-gate foundation | Done | TBD | Root verification, lint, formatting, tests, and smoke checks established in `aca2c12` |
| Product route source | Done | TBD | Shared TypeScript owns the final five-segment Phase 0A journey; JSON is a validated mirror |
| Plan Trip | Done | TBD | Uses shared segments and derived totals; CTA opens Route Comparison |
| Mobile route comparison | Done | TBD | Shared recommended route plus pending private baseline and non-live Phase 2 preview |
| Route detail | Done | TBD | Uses the same shared access points, segments, statuses, and totals |
| Trip playback | Partial | TBD | Displays final route labels; progression and final route-bound traces remain pending |
| Classifier | Partial | TBD | Rule-based prototype exists, but route binding and hardening still target legacy corridor assumptions |
| GPS traces | Partial | TBD | Valid and suspicious fixtures exist for the legacy corridor; final route fixtures are pending |
| Reward logic | Partial | TBD | Shared calculation exists; boundary stabilization remains pending |
| Reward result screen | Partial | TBD | Existing prototype screen is connected; calibrated CO2e and reward boundaries remain pending |
| Rewards tab cleanup | Pending | TBD | Out-of-scope XP, levels, streaks, and redemption concepts require a separate cleanup task |
| Access report form | Done | TBD | Prototype mobile form and confirmation flow exist |
| Seed access-barrier reports | Done | TBD | Approximate prototype/sample reports are seeded |
| Dashboard layout | Not started | TBD | Agency preview only; no live integration |
| Report queue | Not started | TBD | |
| Dashboard map | Not started | TBD | |
| Analytics cards | Not started | TBD | |
| Demo script | Not started | TBD | |

## Change Log

### 2026-07-19

- Migrated the authoritative shared route source to the final Cubao-to-Hulo
  five-segment multimodal pilot journey.
- Centralized travel, wait/dwell, distance, fare, status, access-point, reward
  eligibility, version, review-date, disclaimer, and CO2e methodology fields.
- Derived the 91-minute, 14.1 km, and PHP 35 + ferry fare TBC displays from
  segment values; CO2e remains pending pilot calibration.
- Updated Plan Trip, Route Comparison, and Route Detail to consume the shared
  route source and added a working Plan Trip comparison CTA.
- Removed route-screen heatmap, crowd-density, route-safety, live-traffic, and
  official-endorsement implications.
- Added route arithmetic, ordered-mode, pending-state, eligibility, JSON-mirror,
  Plan Trip, unsupported-label, and CTA-navigation coverage.
- Classifier final-route binding, reward-boundary fixes, playback progression,
  dashboard functionality, backend work, and live APIs remain pending.

### 2026-07-18

- Completed the Phase 0A implementation audit and refreshed it after merging `origin/carl` frontend changes.
- Audit report: `docs/audits/phase-0a-audit-report.md`.
- Decision: NO-GO; refreshed readiness score: 51/100 (pre-merge score: 63/100).
- Audit findings remain authoritative until the Critical and Must Fix items are resolved and re-audited; existing module rows were not promoted to Done by this audit.

### 2026-07-16

- Aligned the mobile workspace with Expo SDK 54 and Expo Go 54.0.8 on Android.
- Pinned the monorepo to React 19.1 and React Native 0.81.5 to prevent duplicate native runtimes.
- Removed an invalid `expo-status-bar` config plugin entry so Expo config loads correctly.
- Added Expo Go LAN, tunnel, and cache-clear scripts for mobile testing.
- Documented SDK compatibility and when to use tunnel mode across phones or networks.

### 2026-07-14

- Moved the monorepo from the nested `lakbaypoints-mvp/` folder to the repository root for cleaner GitHub collaboration.
- Replaced the placeholder root README with project setup, structure, and collaboration notes.
- Added contributor guidance, editor defaults, and a root `verify` script for pre-PR checks.

### 2026-07-10

- Added shared access-barrier report types for category, severity, status, and report records.
- Added prototype/sample access-barrier report seed data for the Guadalupe to Cubao corridor.
- Added the mobile Report Access Barriers form, validation, confirmation screen, and MMDA dashboard preview placeholder.

### 2026-07-08

- Added shared Lakbay Score and capped campaign points reward logic.
- Added demo commuter reward state for the MVP reward result.
- Connected mobile verification output to the Reward the Shift screen.
- Implemented the rule-based Sustainable Trip Chain Classifier.
- Added valid and suspicious sample GPS traces.
- Connected mobile trip verification to classifier output with a suspicious-trace demo path.
- Added a route detail flow from the recommended sustainable route CTA.
- Added a trip playback placeholder with progress state and a static verification result.
- Initially kept verification as a placeholder before the classifier task.

### 2026-07-07

- Added static Guadalupe to Cubao route data for the private baseline, recommended sustainable trip, and Phase 2 preview.
- Added shared route types and exported demo route options.
- Replaced the mobile starter screen with the route comparison screen.
- Set up the npm workspace monorepo foundation.
- Added Expo, Next.js, and shared TypeScript package starters.
- Preserved existing planning documents and updated tracker status.

### YYYY-MM-DD

- Created initial planning documents.
- Defined core MVP loop.
- Defined controlled pilot corridor.
- Defined commit workflow.

## MVP Demo Readiness Checklist

- [x] Can open the shared-data Plan Trip journey
- [x] Can compare the recommended journey with qualified alternatives
- [x] Can open the five-segment shared Route Detail
- [x] Can show derived time, distance, and known/pending fare
- [x] Can show ferry fare and CO2e as pending
- [ ] Has final route-bound playback progression and GPS fixtures
- [ ] Has classifier rules hardened and bound to the final route
- [ ] Has reward boundaries stabilized
- [x] Can submit an access-barrier report
- [ ] Can view report in dashboard
- [ ] Can update report status
- [ ] Can show basic dashboard metrics
- [ ] Has backup screenshots/video
- [ ] Has rehearsed 5–7 minute script
- [ ] Has known limitations slide

## Active Risks

| Risk | Mitigation |
|---|---|
| Scope creep | Only build approved MVP loop |
| Classifier overclaiming | Mark final route binding and hardening as pending |
| Rewards appear guaranteed | Label route rewards as potential, verification-required, and capped |
| Prototype appears officially operated | Use neutral agency-preview language and avoid ownership/endorsement claims |
| Static data appears live | Show data status, review date, disclaimer, and pending calibration labels |
| Parallel totals drift | Derive totals from shared segments and validate the JSON mirror in tests |

## Next Actions

1. Complete navigation consistency and the out-of-scope Rewards-tab cleanup.
