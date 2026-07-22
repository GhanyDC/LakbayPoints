# App User Flow

## Main Demo Story

Persona: a commuter traveling from Cubao Home/Access Zone to Hulo Office Demo
Destination through the final Phase 0A multimodal pilot journey.

### Step 1: Plan Trip

Plan Trip shows the approved origin, destination, five segments, and totals
from the shared route source. It labels the values as static prototype data and
shows:

- 91 minutes
- 14.1 km
- PHP 35 + ferry fare TBC
- CO2e avoided: Pending pilot calibration

Primary CTA: **Compare Route Options**.

The screen does not claim live heatmaps, crowd density, service frequency,
traffic, or route-safety information.

### Step 2: Route Comparison

Show three route cards:

1. **Private Vehicle Baseline** — comparison only, metrics pending
   calibration, no rewards.
2. **Recommended Multimodal Pilot Route** — the approved five-segment journey,
   static prototype data, potentially +120 Lakbay Score and up to +40 campaign
   Points subject to verification and the campaign cap.
3. **Phase 2 Multimodal Future Preview** — visibly not live and dependent on
   future partner/data integration.

The CTA on the recommended option opens Route Detail.

### Step 3: Route Detail

Show the same shared route data used by Plan Trip and Route Comparison:

1. Jeepney: Cubao Home/Access Zone → MRT-3 Araneta-Cubao Station
2. MRT-3: MRT-3 Araneta-Cubao Station → MRT-3 Guadalupe Station
3. Walk: MRT-3 Guadalupe Station → Guadalupe Ferry Station
4. Pasig River Ferry: Guadalupe Ferry Station → Hulo Ferry Station
5. Walk: Hulo Ferry Station → Hulo Office Demo Destination

Each segment shows travel time, wait/dwell, distance, fare status, and access
points. Totals are calculated through shared helpers rather than stored by the
screen.

### Step 4: Start Trip / Playback

Playback is a deterministic prototype simulation using the generated valid or
suspicious final-route trace. It begins on segment 1 (index 0), advances through
all five shared route segments in order, updates the progress/current status,
and does not expose verification until the fifth segment. Restart returns to
segment 1 and clears the prior result. No live GPS or map is implied.

### Step 5: Verify the Shift

Show the rule-based classifier's confidence score, result label, reward
eligibility, signal checklist, and explanation. Verification resolves the exact
selected sustainable route and consumes its final-route profile. Invalid data,
unknown routes, the private baseline, the future preview, missing walking legs,
and suspicious movement fail closed with no reward.

### Step 6: Reward Result

Show Lakbay Score and capped campaign Points only after verification. Route
screens may show reward potential, but must state that verification is required
and the campaign cap applies. Do not show cash redemption, XP, levels, streaks,
transit credits, QR tickets, merchant discounts, or raffle products on route
screens.

The retained Rewards tab opens a verification-gated overview when the current
session has no result. It may show clearly labeled seeded balances, the shared
route's potential reward, the campaign cap, and reward rules, but it does not
issue a result. After verification, the Rewards tab returns to the calculated
result for that session.

### Step 7: Report Access Barrier

The user can submit a prototype report for sidewalk obstruction, unsafe
crossing, flooding, illegal parking/loading obstruction, or damaged walkway or
access path. Selectable locations cover MRT-3 Araneta-Cubao, MRT-3 Guadalupe,
Guadalupe Ferry, Hulo Ferry, and the Hulo office last-mile access area. The
confirmation says: **Submitted to the LakbayPoints prototype review queue for
demonstration.** It does not imply a live MMDA integration.

### Step 8: Agency Dashboard Preview

The report can appear in a non-live institutional preview. This does not imply
an official MMDA workflow, integration, operation, or endorsement.

## Persistent Navigation

- **Home** opens the Phase 0A welcome and shared route summary.
- **Trips** opens Plan Trip.
- **Rewards** opens the verification-gated overview or current verified result.
- **Report** opens the access-barrier form.
- **Profile** opens a session-only prototype disclosure rather than a live
  account.

The active tab is derived from the current screen. Tab changes preserve a
verified result for the current session, while explicit “Back to Routes” actions
reset verification/report state. Android hardware back follows a documented
screen-destination map and exits normally from top-level Home or Plan Trip.

## Key UX Rule

> LakbayPoints guides a multimodal trip, verifies the mode shift, and helps
> improve access without presenting prototype data as live.
