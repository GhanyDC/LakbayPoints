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

For the current prototype, use sample trace playback and show the selected
route's segment labels. Playback progression and final route-bound trace data
remain pending stabilization.

### Step 5: Verify the Shift

Show the rule-based classifier's confidence score, result label, reward
eligibility, signal checklist, and explanation. The existing classifier rules
and fixtures still target the earlier corridor and must be migrated in a later
task; do not treat the final route binding as complete.

### Step 6: Reward Result

Show Lakbay Score and capped campaign Points only after verification. Route
screens may show reward potential, but must state that verification is required
and the campaign cap applies. Do not show cash redemption, XP, levels, streaks,
transit credits, QR tickets, merchant discounts, or raffle products on route
screens.

### Step 7: Report Access Barrier

The user can submit a prototype report for sidewalk obstruction, unsafe
crossing, flooding, illegal parking/loading obstruction, or damaged walkway or
access path.

### Step 8: Agency Dashboard Preview

The report can appear in a non-live institutional preview. This does not imply
an official MMDA workflow, integration, operation, or endorsement.

## Key UX Rule

> LakbayPoints guides a multimodal trip, verifies the mode shift, and helps
> improve access without presenting prototype data as live.
