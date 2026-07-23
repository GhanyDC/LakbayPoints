# LakbayPoints Agency Mobility Insights

**Simulated Phase 0B Pilot Dashboard**

Next.js prototype decision-support view for the LakbayPoints MMITS
demonstration. It is not a live MMDA dashboard, operational control center,
commuter-monitoring tool, enforcement or dispatch system, production rewards
ledger, or carbon-accounting system.

> All metrics, reports, trip results, and campaign values shown in this
> dashboard are deterministic simulated prototype data for the MMITS
> demonstration. No live MMDA system or commuter data is connected.

## Implemented Phase 0B Foundation and Overview

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

Workstream 2 now presents the shared foundation as one server-rendered agency
prototype page with:

- the exact persistent simulated-data disclosure near the top of the page;
- the LakbayPoints agency mobility title, pilot subtitle, product message,
  final route context, seed version, and review date;
- six overview cards in the approved pitch order, with values and supporting
  rates derived from `deriveDashboardOverview` and the canonical seed;
- `Pending pilot calibration` for CO2e, without a numeric environmental claim;
- a three-column wide, two-column medium, and one-column narrow layout; and
- a visible method and limitations note covering deterministic data, future
  local-only status changes, reload reset behavior, pending CO2e, and the lack
  of backend or live MMDA integration.

No dashboard component duplicates the approved aggregate totals. Presentation
formatting lives in `apps/dashboard/lib/dashboard-overview.ts` and consumes only
public `@lakbaypoints/shared` exports.

## Run and Verify

From the repository root:

```powershell
npm run dev -w @lakbaypoints/dashboard
npm run test -w @lakbaypoints/dashboard
npm run lint -w @lakbaypoints/dashboard
npm run typecheck -w @lakbaypoints/dashboard
npm run build -w @lakbaypoints/dashboard
```

Dashboard tests use Node's test runner, `tsx`, and React server rendering. They
cover the six shared-derived metrics, disclosure and product copy, semantic
order, pending CO2e behavior, route metadata, local/reset limitations, and the
absence of controls or sections reserved for later workstreams.

## Remaining Presentation Scope

Workstream 2 intentionally does not include:

- report queue and status-control UI;
- hotspot schematic;
- trip or campaign detail presentation; and
- end-to-end dashboard demonstration state.

The next implementation task is **Phase 0B Workstream 3 — access-barrier report
queue, selected-report detail, and local status-transition workflow.**
