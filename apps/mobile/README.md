# LakbayPoints Mobile App

Expo React Native commuter prototype for LakbayPoints: **A Verified Multimodal
Mode-Shift Platform for Metro Manila**.

Primary Phase 0A flow:

1. Plan the shared five-segment Cubao-to-Hulo pilot journey
2. Compare the recommended route with pending/non-live alternatives
3. Inspect the shared segment breakdown
4. Run deterministic five-segment prototype playback and verification
5. View eligible reward results
6. Report an access barrier

Retained bottom tabs have explicit destinations:

- Home: Phase 0A pilot welcome and shared route summary
- Trips: Plan Trip
- Rewards: verification-gated overview or the current verified result
- Report: Report Access Barrier form
- Profile: session-only prototype profile disclosure

Plan Trip, Route Comparison, and Route Detail import the authoritative model
from `packages/shared/src/routes.ts`. Their totals are derived from segments.
The values are static rather than live; ferry fare and CO2e remain pending.

The Plan Trip CTA opens Route Comparison. Tab selected state is derived from the
current screen, verified results remain available during session tab changes,
and Android hardware back follows explicit prototype destinations.

The Rewards overview uses shared seeded balances and route reward potential.
XP, levels, streaks, reward products, wallets, payments, and live-account claims
are not part of the active interface.

Playback starts on the first shared route segment, progresses deterministically
through all five, gates verification until completion, and supports restart.
Both generated prototype trace choices remain available. The classifier uses
the selected route's final verification profile and fails closed on malformed
or ineligible inputs. It is a coarse rule-based demonstration, not live GPS,
full GIS map matching, or perfect mode detection.

Reward calculation normalizes hostile numeric inputs, keeps campaign Points
within the cap, gives Reduced results half Lakbay Score and zero campaign
Points, and leaves CO2e at zero while calibration is pending. Report locations
match the final route access areas and submissions remain local/session-only
prototype behavior.

Automated component tests cover playback, valid/suspicious verification,
restart, and report locations. A physical-device walkthrough is still required
to confirm target-device rendering, taps, font scaling, orientation, and Expo
Go behavior.
