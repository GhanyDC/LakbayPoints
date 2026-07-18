# UI Style Guide

## Product Tone

LakbayPoints should feel civic, clean, trustworthy, commuter-friendly, and
modern without implying an official agency endorsement or live integration.
Avoid making it look like a game-only app.

## Product Language

Use these exact phrases consistently:

- LakbayPoints
- A Verified Multimodal Mode-Shift Platform for Metro Manila
- Guide the Trip. Verify the Shift. Improve Access.
- Sustainable Trip Chain
- Sustainable Trip Chain Classifier
- Lakbay Score
- campaign Points
- Report Access Barriers
- Agency Dashboard Preview
- Estimated CO2e avoided
- Static prototype data
- Pending pilot calibration

Avoid:

- possessive language such as “MMDA's LakbayPoints”
- claims of MMDA ownership, operation, integration, or endorsement
- carbon credits, cash rewards, XP, levels, or streaks on route screens
- live traffic, heatmap, crowd-density, service-frequency, or route-safety
  claims without supporting data
- full NCR routing or official-looking pending values

## Mobile UI Priorities

The commuter should quickly understand:

1. Which multimodal route is being demonstrated?
2. Which values are known, estimated, or pending?
3. What reward could become eligible after verification?
4. What access barrier can be reported?

## Route Card Layout

Each route card should show:

- route title and recommendation/future status
- ordered shared trip-chain labels
- derived time, distance, and fare display
- access score
- CO2e as pending until calibrated
- potential Lakbay Score and capped campaign Points, if eligible
- data-status label and prototype disclaimer
- a clear CTA only where the route supports the current demo flow

Private baseline and future-preview cards must show pending/non-live states
instead of invented official-looking metrics.

## Color Guidance

Use calm civic colors:

- blue/navy for trust and mobility
- green for sustainability and verified progress
- amber/orange for warnings, access barriers, and pending states
- neutral grays for dashboard backgrounds

Do not overuse bright reward colors.

## Agency Preview Priorities

The future dashboard should look useful to an agency while remaining visibly a
prototype. Planned content includes a report queue, map pins, status, verified
trips, campaign performance, and calibrated impact metrics. Do not present
these as live before their implementation and data sources are approved.

## Presentation Mode

- Use large headings and clear contrast.
- Keep each screen to a small number of meaningful metrics.
- Qualify static and pending values near where they appear.
- Avoid dense mobile tables.
- Keep future dashboard tables simple and readable.
