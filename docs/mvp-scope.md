# LakbayPoints MVP Scope

## Product Positioning

**LakbayPoints: A Verified Multimodal Mode-Shift Platform for Metro Manila**

> Guide the Trip. Verify the Shift. Improve Access.

LakbayPoints must not be described as owned, operated, or officially endorsed
by MMDA.

## MVP Objective

Build a focused, presentation-ready proof of mechanism for the MMITS Bagong
Gawi, Bagong Galaw Challenge. The MVP should show how LakbayPoints can:

- guide a commuter through a multimodal trip chain;
- verify a completed trip with a transparent rule-based confidence engine;
- show potential non-cash and capped campaign rewards after verification;
- collect access-barrier reports; and
- preview how an agency could inspect corridor-level information.

## Phase 0A Pilot Journey

The final controlled journey runs from **Cubao Home/Access Zone** to **Hulo
Office Demo Destination**:

1. Jeepney to MRT-3 Araneta-Cubao Station
2. MRT-3 to MRT-3 Guadalupe Station
3. Walk to Guadalupe Ferry Station
4. Pasig River Ferry to Hulo Ferry Station
5. Walk to Hulo Office Demo Destination

The shared segment values derive these display totals:

- 91 minutes, including travel and wait/dwell time
- 14.1 km
- PHP 35 in known fares plus ferry fare TBC
- CO2e avoided pending pilot calibration

These values are static prototype estimates, not live operational data. The
ferry fare remains pending confirmation.

## Comparison Options

- The private-vehicle baseline is comparison-only and reward-ineligible. Its
  time, cost, distance, and CO2e remain pending calibration because final
  values are not approved.
- The Phase 2 option is labeled **Future Preview — not live**, has no invented
  metrics, and requires future partner and data integration.

## Must Build

### Mobile App

1. Plan Trip screen
2. Route Comparison screen
3. Route Detail screen
4. Trip playback and verification screen
5. Reward result screen
6. Report Access Barrier screen
7. Report confirmation screen

### Institutional Preview

1. Agency dashboard overview
2. Report queue
3. Map-pin or hotspot placeholder
4. Verified-trip summary
5. Campaign-performance summary

### Shared Logic

1. Authoritative static route data and derived-total helpers
2. Sample GPS traces
3. Sustainable Trip Chain Classifier
4. Reward eligibility logic
5. Seed demo data

## Current Stabilization Boundary

The product route source, route-facing screens, generated traces, classifier
profile, rewards, and deterministic playback now use the final journey.
Verification remains a coarse rule-based prototype rather than full GIS map
matching or field-calibrated mode detection. Physical-device QA remains
required; dashboard implementation and all live integrations remain outside
this stabilization task.

## Future Only

Do not build these in the Phase 0A MVP:

- full NCR routing or live transit APIs
- production GIS or real-time maps
- real PRFS/e-bike integration
- reward redemption, Beep/payment, or QR-ticket integration
- a full machine-learning classifier
- official agency dispatch workflow
- carbon-credit or carbon-trading modules
- driver-facing features, social feeds, or chatbots
- complex admin permissions

## MVP Completion Definition

The final demo should let a commuter review the approved journey, compare
clearly labeled prototype options, complete a simulated trace, receive an
appropriately qualified verification result, see eligible potential rewards,
and submit an access-barrier report for an agency-dashboard preview. No step may
present static or pending data as live or official.
