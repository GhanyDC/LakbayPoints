# LakbayPoints Agency Mobility Insights

**Simulated Phase 0B Pilot Dashboard**

Next.js prototype decision-support view for the LakbayPoints MMITS
demonstration. It is not a live MMDA dashboard, operational control center,
commuter-monitoring tool, enforcement or dispatch system, production rewards
ledger, or carbon-accounting system.

> All metrics, reports, trip results, and campaign values shown in this
> dashboard are deterministic simulated prototype data for the MMITS
> demonstration. No live MMDA system or commuter data is connected.

## Workstream 1 Data Foundation

The dashboard can consume the following public exports from
`@lakbaypoints/shared`:

- contracts: `packages/shared/src/dashboard-types.ts`;
- canonical seed: `packages/shared/src/dashboard-seed.ts`;
- pure aggregations and validation:
  `packages/shared/src/dashboard-analytics.ts`; and
- local report workflow: `packages/shared/src/report-workflow.ts`.

Approved deterministic aggregates:

- 120 participants and 84 repeat participants (70%);
- 360 trip attempts: 288 fully verified, 36 partial, and 36 suspicious or
  rejected;
- 100-Point individual cap, 12,000-Point allocation, and 8,640 Points issued
  (72% utilization);
- 25 reports across five final-route access areas, with status counts of 4
  Submitted, 8 Under Review, 6 Verified, 4 Assigned, and 3 Resolved; and
- CO2e value `null`, displayed as `Pending pilot calibration`.

A repeat participant has at least two fully verified qualifying pilot-route
trips during the simulated campaign window. Campaign allocation uses 120
participants multiplied by the 100-Point individual cap. Campaign Points do
not represent redemption, payment, a wallet, a merchant benefit, settlement,
ticketing, transit credit, or financial value.

The report workflow is local and non-persistent:

`Submitted -> Under Review -> Verified -> Assigned -> Resolved`

It permits a same-status no-op or the immediate next forward status only.
Backward and skipped transitions fail safely without mutating the canonical
seed. No backend or live integration exists.

## Presentation Status

Workstream 1 supplies data only. The existing starter page has not been
restyled or behaviorally changed. These remain pending:

- dashboard layout and persistent disclosure UI;
- overview metric cards;
- report queue and status-control UI;
- hotspot schematic;
- trip and campaign presentation; and
- end-to-end dashboard demonstration state.
