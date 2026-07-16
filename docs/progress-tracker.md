# LakbayPoints MVP Progress Tracker

Update this file after every meaningful change.

## Current Phase

**Phase 0: Challenge MVP**

## Build Status

| Module | Status | Owner | Notes |
|---|---|---|---|
| Repo setup | Done | TBD | npm workspace monorepo foundation moved to repository root |
| Docs setup | Done | Team | Initial docs preserved |
| Mobile route search | Not started | TBD | |
| Static route data | Done | TBD | Guadalupe to Cubao demo route options added |
| Mobile route comparison | Done | TBD | Three static route cards in Expo starter |
| Route detail | Done | TBD | Recommended sustainable route detail screen added |
| Trip playback | Done | TBD | Connected to shared classifier result |
| Classifier | Done | TBD | Rule-based Sustainable Trip Chain Classifier added |
| Valid GPS trace | Done | TBD | Seeded Guadalupe to Cubao sustainable trace |
| Suspicious GPS trace | Done | TBD | Seeded rejected anti-cheating trace |
| Reward logic | Done | TBD | Shared Lakbay Score and campaign cap calculation added |
| Reward screen | Done | TBD | Reward the Shift mobile screen added |
| Access report form | Done | TBD | Mobile report form added after the reward result screen |
| Report confirmation screen | Done | TBD | Submitted report confirmation and dashboard preview placeholder added |
| Seed access-barrier reports | Done | TBD | Prototype/sample corridor reports seeded |
| Dashboard layout | Not started | TBD | |
| Report queue | Not started | TBD | |
| Dashboard map | Not started | TBD | |
| Analytics cards | Not started | TBD | |
| UI polish | Not started | TBD | |
| Demo script | Not started | TBD | |

## Change Log

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

- [ ] Can search Guadalupe to Cubao route
- [x] Can compare private baseline vs sustainable trip
- [x] Can open sustainable route details
- [x] Can play sample trip trace
- [x] Can show classifier confidence score
- [x] Can reject suspicious trace
- [x] Can show Lakbay Score and campaign points
- [x] Can submit access-barrier report
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
| Classifier overclaiming | Use rule-based confidence language |
| Rewards appear expensive | Use Lakbay Score + capped campaign points |
| Dashboard appears decorative | Make it the institutional payoff |
| Data not yet available | Use seeded data, then swap official data later |

## Next Actions

1. Build MMDA Dashboard overview and report queue.
