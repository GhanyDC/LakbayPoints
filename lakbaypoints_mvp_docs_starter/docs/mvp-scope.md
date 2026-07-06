# LakbayPoints MVP Scope

## Product Positioning

**LakbayPoints: MMDA’s Verified Mode-Shift Data Layer for Metro Manila**

Tagline:

> Guide the Trip. Verify the Shift. Improve the Road.

## MVP Objective

Build a focused, presentation-ready proof-of-mechanism for the MMITS Bagong Gawi, Bagong Galaw Challenge.

The MVP should prove that LakbayPoints can:
- guide commuters to a sustainable trip chain;
- verify the completed trip using a rule-based confidence engine;
- reward verified behavior using non-cash and capped campaign incentives;
- collect access-barrier reports;
- show MMDA corridor-level insights through a dashboard.

## MVP Corridor

**EDSA–MRT3 Guadalupe to Cubao**

Primary route story:
- Origin: Guadalupe area
- Destination: Cubao / Araneta Center area
- Sustainable trip chain: Walk → MRT3 / public transport → Walk
- Private vehicle route shown only as baseline comparison

Station access zones:
- Guadalupe
- Boni
- Shaw Boulevard
- Ortigas
- Santolan-Annapolis
- Araneta Center-Cubao

## Must Build

### Mobile App

1. Home / route search screen
2. Route comparison screen
3. Route detail screen
4. Trip playback / verification screen
5. Reward result screen
6. Report access barrier screen
7. Report confirmation screen

### Dashboard

1. Dashboard overview
2. Report queue
3. Map pins / hotspot placeholder
4. Verified trips summary
5. Campaign performance summary

### Shared Logic

1. Static route data
2. Sample GPS traces
3. Sustainable Trip Chain Classifier
4. Reward eligibility logic
5. Seed demo data

## Can Simulate

- GPS trace playback
- Route geometry
- MMDA travel time values
- Estimated CO2e avoided
- Campaign reward points
- Hotspot clustering
- Dashboard analytics

## Future Only

Do not build these in the MVP:
- full NCR routing
- real-time transit APIs
- real PRFS/e-bike integration
- real reward redemption
- Beep/payment/QR integration
- full ML classifier
- official MMDA dispatch workflow
- carbon-credit or carbon-trading module
- driver-facing features
- social feed
- chatbot
- complex admin permissions

## MVP Completion Definition

The MVP is complete when the team can demo this flow smoothly:

> A commuter searches Guadalupe to Cubao, chooses a sustainable route, completes a simulated or collected trace, receives a verification confidence score, earns Lakbay Score and campaign points, submits an access-barrier report, and MMDA sees the report plus corridor insights in the dashboard.
