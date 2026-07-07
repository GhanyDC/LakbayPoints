# LakbayPoints MVP Progress Tracker

Update this file after every meaningful change.

## Current Phase

**Phase 0: Challenge MVP**

## Build Status

| Module | Status | Owner | Notes |
|---|---|---|---|
| Repo setup | Done | TBD | npm workspace monorepo foundation added |
| Docs setup | Done | Team | Initial docs preserved |
| Mobile route search | Not started | TBD | |
| Static route data | Done | TBD | Guadalupe to Cubao demo route options added |
| Mobile route comparison | Done | TBD | Three static route cards in Expo starter |
| Route detail | Done | TBD | Recommended sustainable route detail screen added |
| Trip playback | Done | TBD | Placeholder playback and verification result state added |
| Classifier | Not started | TBD | |
| Valid GPS trace | Not started | TBD | Collect or seed |
| Suspicious GPS trace | Not started | TBD | For anti-cheating demo |
| Reward screen | Not started | TBD | Lakbay Score + Points |
| Access report form | Not started | TBD | |
| Dashboard layout | Not started | TBD | |
| Report queue | Not started | TBD | |
| Dashboard map | Not started | TBD | |
| Analytics cards | Not started | TBD | |
| UI polish | Not started | TBD | |
| Demo script | Not started | TBD | |

## Change Log

### 2026-07-08

- Added a route detail flow from the recommended sustainable route CTA.
- Added a trip playback placeholder with progress state and a static verification result.
- Kept verification as a placeholder for the future classifier task.

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
- [ ] Can reject suspicious trace
- [ ] Can show Lakbay Score and campaign points
- [ ] Can submit access-barrier report
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

1. Implement Sustainable Trip Chain Classifier with valid and suspicious sample traces.
