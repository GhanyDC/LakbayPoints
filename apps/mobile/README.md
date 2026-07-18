# LakbayPoints Mobile App

Expo React Native commuter prototype for LakbayPoints: **A Verified Multimodal
Mode-Shift Platform for Metro Manila**.

Primary Phase 0A flow:

1. Plan the shared five-segment Cubao-to-Hulo pilot journey
2. Compare the recommended route with pending/non-live alternatives
3. Inspect the shared segment breakdown
4. Run prototype trip verification
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
are not part of the active interface. Classifier final-route binding, reward
boundary hardening, and playback progression remain separate Phase 0A work.
