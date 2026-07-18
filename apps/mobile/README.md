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

Plan Trip, Route Comparison, and Route Detail import the authoritative model
from `packages/shared/src/routes.ts`. Their totals are derived from segments.
The values are static rather than live; ferry fare and CO2e remain pending.

The Plan Trip CTA opens Route Comparison. The classifier's final-route binding,
playback progression, and detailed Rewards-tab cleanup remain separate Phase 0A
stabilization work.
