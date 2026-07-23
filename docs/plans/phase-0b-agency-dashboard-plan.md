# LakbayPoints Phase 0B Agency Dashboard Plan

## 1. Planning Context

Phase 0B plans a reliable, presentation-ready agency dashboard for the
LakbayPoints competition prototype. The product position remains **A Verified
Multimodal Mode-Shift Platform for Metro Manila**, with the message **Guide the
Trip. Verify the Shift. Improve Access.**

This is a prototype decision-support view, not an operational control center.
It must show how verified multimodal trips and commuter-reported access
barriers could become useful agency signals without claiming production data,
live monitoring, agency adoption, dispatch, or enforcement.

Planning assumptions:

- Phase 0A is the frozen mobile baseline. Phase 0B may consume its shared route,
  classifier, report, reward, and demo-data contracts but must not redesign or
  behaviorally change `apps/mobile`.
- The dashboard remains a Next.js application in `apps/dashboard` and consumes
  reusable exports from `@lakbaypoints/shared`.
- All visible pilot records and counts are deterministic seeded prototype data.
  A persistent disclosure must say this on every dashboard section where a
  viewer could otherwise infer live or official data.
- Report status changes use local React state. They reset on reload and are not
  presented as saved, synchronized, dispatched, or transmitted to an agency.
- The mobile-to-dashboard story is a coordinated seed narrative. It is not live
  cross-application synchronization.
- No production prototype is required. Reliability, claim discipline, and a
  sub-45-second dashboard walkthrough take priority over feature breadth.
- The implementation branch must start only after local `main` and
  `origin/main` are reconciled on the accepted Phase 0A history and the clean
  baseline quality gate is reproducible.

Decisions that must be closed before Workstream 1 is accepted:

1. Approve the exact simulated trip and participant counts used by the demo.
2. Define campaign cap usage as either issued Points divided by the sum of
   participant caps (recommended for the existing per-user model) or a
   separately approved pilot budget. Do not silently introduce an agency
   budget.
3. Define a repeat participant as a participant with at least two verified,
   qualifying pilot-route trips in the seeded campaign window (recommended).
4. Approve the dashboard title **LakbayPoints Agency Dashboard - Simulated
   Pilot**. Avoid wording that implies MMDA ownership or endorsement.
5. Approve the seeded Araneta-Cubao sidewalk report as the report narrated as
   submitted from the mobile prototype.
6. Confirm the presentation machine, target browser, and projector resolution
   no later than demo hardening.

## 2. Phase 0A Handoff

The Phase 0A final technical audit scored the mobile foundation **92/100, GO**.
The accepted final Phase 0A documentation commit is
`02eb24882b38820f8b3f34cf8790a80697045758`, contained in the local accepted
`main` history at planning time.

Phase 0A assets Phase 0B should reuse:

- `packages/shared/src/types.ts`: route, report, classifier, and reward types,
  including the existing five-value `ReportStatus` union.
- `packages/shared/src/routes.ts`: the final five-segment Cubao-to-Hulo pilot
  route, access-point identifiers, static estimates, and calibration language.
- `packages/shared/src/classifier.ts` and `packages/shared/src/rewards.ts`: the
  verification and reward rules that distinguish verified from suspicious or
  rejected trips.
- `packages/shared/src/demo-data.ts`: the current demonstrator user reward
  state; use it where compatible rather than copying values into dashboard
  components.
- `data/seed/access-barrier-reports.json`: five existing prototype reports, one
  for each required hotspot area and one for each workflow status. It is not
  currently consumed by application code and should be migrated into one typed
  shared seed source during Workstream 1.

Frozen boundaries:

- Do not modify Phase 0A mobile screens, visual styling, navigation, classifier
  behavior, route values, reward rules, or disclosures.
- Do not reinterpret prototype route values as live schedules, official fares,
  or measured environmental outcomes.
- Do not change existing shared behavior merely to make a dashboard card easier
  to implement. Dashboard-specific records and view models must extend or
  compose the stable contracts.
- Before and after each implementation workstream, verify that `git diff --
  apps/mobile` is empty.

The current dashboard is only a starter. Its hard-coded corridor copy and
“MMDA Dashboard” title are not an accepted Phase 0B information architecture.
Phase 0B should replace that dashboard-only content with the final pilot route,
neutral agency-prototype wording, and explicit static-data disclosures.

## 3. Competition and Time Constraints

- Submission deadline: **July 28, 2026 at 11:59 PM**.
- Pitch: first week of August 2026.
- Presentation format: five-minute pitch followed by ten minutes of questions.
- The dashboard portion must be reliably demonstrable in **45 seconds or less**.
- A working walkthrough or mockup is sufficient; video inserts are allowed.
- No feature is worth risking the stable mobile demo, the final build, or claim
  accuracy.

Recommended delivery envelope from July 22:

| Date | Milestone |
| --- | --- |
| July 22 | Close seed-policy decisions; implement contracts and aggregation tests |
| July 23 | Build information architecture, overview, and disclosures |
| July 24 | Complete report queue, local workflow, and hotspot schematic |
| July 25 | Complete trip and campaign insights; join demonstration state |
| July 26 | Automated gates, device/browser QA, accessibility, copy review |
| July 27 | Rehearsal, backup video capture, release-candidate freeze |
| July 28 | Submission buffer only; no discretionary features |

The working estimate is **3.75 to 4.5 ideal engineer-days**, excluding approval
latency and presentation rehearsal. If time compresses, preserve the overview,
single report transition, linked hotspot, truthful disclosures, and verified
trip/campaign impact; cut secondary filters, decorative charts, and animation.

## 4. Phase 0B Scope

### In scope

- A responsive agency dashboard shell with overview, reports, hotspots, trip
  insights, campaign insights, and disclosures.
- Six overview cards:
  - Verified Sustainable Trips
  - Access-Barrier Reports
  - Reports Under Review
  - Estimated CO2e Avoided
  - Campaign Points Issued
  - Repeat Sustainable-Trip Users
- A deterministic access-barrier queue showing identifier, location, category,
  severity, reported time, status, and concise description.
- An allowed local status path:
  `Submitted -> Under Review -> Verified -> Assigned -> Resolved`.
- A selected-report detail surface and a single, obvious “Move to Under Review”
  demo action for the seeded Submitted report.
- A lightweight route schematic covering:
  - MRT-3 Araneta-Cubao access area
  - MRT-3 Guadalupe access area
  - Guadalupe Ferry access area
  - Hulo Ferry access area
  - Hulo office last-mile access area
- Verified, suspicious/rejected, classifier-confidence, five-segment-completion,
  and common access/transfer-point indicators.
- One clearly simulated pilot campaign showing participating commuters,
  verified qualifying trips, Points issued, cap usage, and repeat-trip rate.
- Typed seeds, pure aggregation helpers, local demonstration state, automated
  tests, and a repeatable demo reset.
- Dashboard-specific README/demo instructions and a backup video capture during
  hardening.

### Out of scope

- Authentication, roles, authorization, user administration, or agency tenancy.
- Backend services, databases, persistence, real-time subscriptions, or mobile
  synchronization.
- Live GPS, commuter tracking, production classifier telemetry, or live route
  monitoring.
- Actual dispatch, case assignment, enforcement, notification, escalation, or
  service-level workflows.
- Paid map APIs, production GIS, geocoding, routing, heatmap infrastructure, or
  official geographic analysis.
- Payment, Points redemption, partner settlement, wallets, or financial value.
- Production carbon accounting, carbon credits, regulatory reporting, or an
  invented CO2e total. The CO2e card must display **Pending pilot calibration**
  and no number.
- New routes, changed fares, changed reward rules, expanded classifier logic, or
  Phase 0A mobile visual/behavior changes.
- Phase 0B operational security, scalability, observability, or deployment
  architecture beyond what is required for the reliable static demo.

## 5. Dashboard Information Architecture

Use one scrollable page with compact in-page navigation. This is faster and
more reliable for the pitch than routing across multiple pages, while still
creating clear agency-facing sections.

1. **Persistent prototype banner** - “Simulated pilot data. Local demo actions
   reset on reload. No live agency integration.” It remains visible at the top.
2. **Overview** - six cards in pitch order. Verified trips is visually primary;
   CO2e is a text-state card rather than a number card.
3. **Access-barrier reports** - queue on the left or full width, with selected
   report details and the next allowed local status action. Default selection is
   the seeded Submitted Araneta-Cubao report.
4. **Pilot-route hotspots** - an inline SVG or semantic CSS schematic with five
   ordered access areas, report counts, severity/status markers, and selected
   report emphasis. It must be called a schematic, not a live map.
5. **Verified trip insights** - compact cards/bars for outcomes, confidence
   bands, complete five-segment chains, and common transfer points. Copy states
   that the values summarize seeded prototype records, not commuters in motion.
6. **Pilot campaign** - a small campaign summary with participant, qualifying
   trip, Points, cap, and repeat-rate indicators; no redemption controls.
7. **Method and limitations** - static seed version, aggregation definitions,
   CO2e calibration status, local-state limitation, and no agency integration.

Interaction contract:

- One client-side `AgencyDashboardDemo` island owns the selected report and a
  cloned report-status array. Static route and seed data stay in shared modules.
- Clicking a queue row selects it and highlights the corresponding schematic
  access area via the stable `accessPointId`.
- Only valid next transitions are enabled. The primary demo record initially
  exposes `Move to Under Review`; completed or later-stage records are read-only
  unless the selected record has a valid next stage.
- The overview “Reports Under Review” metric is derived from current local
  report state, so it updates when the demo transition occurs. Other metrics
  remain derived from the stable seed records.
- A clearly labeled `Reset simulated demo` control restores the initial seed.
  Browser reload provides the same result.
- Do not add animations that make the 45-second path timing-dependent.

Accessibility and presentation rules:

- Never communicate status or severity by color alone; pair color with text and
  a symbol or border treatment.
- Use semantic headings, buttons, tables/lists, visible focus, and descriptive
  labels. The status control must be keyboard-operable.
- Avoid horizontal scrolling at 1366x768. Collapse the queue to stacked cards on
  narrow widths without changing the information order.
- Use large, high-contrast metric values readable on a projector.

## 6. Data Contracts and Seed Strategy

### Canonical data flow

```text
Phase 0A shared route / classifier / reward contracts
                         +
Typed Phase 0B prototype records in @lakbaypoints/shared
                         |
                 pure aggregation helpers
                         |
            immutable dashboard initial view model
                         |
       local report selection and status transition state
                         |
       overview + queue + schematic + insight sections
```

The dashboard must import public exports from `@lakbaypoints/shared`, not reach
through to private source files and not redefine route, status, classifier, or
reward unions.

### Proposed shared contracts

- `DashboardAccessReport` composes `AccessBarrierReport` with `accessPointId`,
  human-readable location, and a source label such as `simulated_mobile_seed`.
- `DashboardTripRecord` references a participant, the existing pilot route ID,
  classifier outcome/confidence, completed segment IDs, verification result,
  and reward result. It does not contain live coordinates.
- `DashboardParticipant` contains only a prototype identifier and the minimum
  campaign attributes needed to derive participation and repeat behavior.
- `DashboardCampaign` defines campaign ID, display name, active seed window,
  participant IDs, and the approved cap model; it has no redemption fields.
- `DashboardSeed` groups a seed version, disclosure, access reports, trip
  records, participants, and one campaign.
- `DashboardOverviewMetrics`, `TripInsightSummary`, `CampaignInsightSummary`,
  and `HotspotSummary` are computed view-model types, never separate sources of
  truth.

### Seed rules

- Put the canonical typed dataset in
  `packages/shared/src/dashboard-demo-data.ts` and export it from
  `packages/shared/src/index.ts`.
- Migrate the five reports from `data/seed/access-barrier-reports.json` into the
  typed seed and remove the now-unused JSON in the same implementation commit
  only after a repository search confirms no consumer. Do not keep two editable
  report fixtures.
- Reuse the five required route access IDs from the Phase 0A route. The home
  access zone is part of the five-segment trip chain but is not one of the five
  required hotspot areas.
- Keep the stable report ID
  `demo-report-araneta-cubao-sidewalk-001` for the narrated mobile-submitted
  report. Label its source `Simulated mobile submission` in the UI.
- Seed enough trip and participant records to demonstrate verified,
  suspicious/rejected, complete/incomplete chain, confidence, cap usage, and
  repeat behavior. Exact counts require approval under Section 1.
- All dates are fixed ISO timestamps within the named demo window. No
  `Date.now()`, randomness, current-time labels, or network lookup may affect the
  initial demo.
- CO2e remains `null` and renders `Pending pilot calibration`; aggregation must
  never coerce `null` to zero or derive an unapproved number.

### Pure helper contract

Implement pure functions that:

- validate report access-point references and trip route/segment references;
- aggregate reports by exact status, access point, category, and severity;
- count verified and suspicious/rejected trips from classifier/verification
  results;
- calculate confidence summaries without implying statistical precision beyond
  the fixture;
- count full five-segment completion by comparing IDs to the existing route;
- derive common access/transfer points from seeded trip references;
- derive campaign participation, qualifying trips, issued Points, cap usage,
  repeat participant count, and repeat rate from records;
- return a non-numeric CO2e display state while methodology is pending; and
- apply only the next allowed `ReportStatus` transition without mutating input.

Do not store both raw records and independently hard-coded metric totals. Tests
must prove the cards and insight summaries reconcile to their inputs.

## 7. Workstream Consolidation

Keep the eight required workstreams as reviewable commits, but execute them in
four dependency groups:

| Group | Workstreams | Reason |
| --- | --- | --- |
| Foundation | 1 | Contracts, approved seeds, definitions, and pure helpers unblock every visible section. |
| Primary demo path | 2, 3, 4 | Build the shell first, then the queue and linked schematic used in the 45-second interaction. |
| Evidence and integration | 5, 6 | Add trip/campaign evidence, then connect selection and local state across all sections. |
| Release candidate | 7, 8 | Enforce gates, run physical-device QA, rehearse, and capture fallback media. |

Workstreams 2 and 5 should share the same metric components but should not be
collapsed into one large commit; overview readiness must be reviewable before
analytics detail. Workstreams 3 and 4 must stay separate so the local workflow
can be rolled back without losing the route schematic. Tests ship with each
behavioral workstream; Workstream 7 adds cross-cutting coverage and release
verification rather than postponing all tests.

Scope triage order if schedule risk appears:

1. Preserve the disclosure banner and truthful labels.
2. Preserve derived overview metrics and non-numeric CO2e state.
3. Preserve the seeded report selection, one valid status update, and linked
   hotspot highlight.
4. Preserve verified and repeat-trip/campaign evidence.
5. Cut optional sorting/filtering, extra chart types, decorative movement, and
   nonessential video polish first.

## 8. Detailed Implementation Sequence

### Workstream 1 - Dashboard data contracts and seed data

- **Objective:** establish the one typed, deterministic Phase 0B data source,
  approved metric definitions, pure aggregations, and report transition rules.
- **Likely files:**
  `packages/shared/src/types.ts`,
  `packages/shared/src/dashboard.ts`,
  `packages/shared/src/dashboard-demo-data.ts`,
  `packages/shared/src/index.ts`,
  `packages/shared/tests/dashboard.test.ts`, and removal of
  `data/seed/access-barrier-reports.json` after the no-consumer check.
- **Dependencies:** close the six decisions in Section 1; reuse existing route,
  classifier, reward, report, and user-state exports.
- **Exclusions:** no dashboard JSX/CSS, no mobile edits, no network layer, no
  live timestamps, no CO2e calculation.
- **Tests:** fixture referential integrity; unique IDs; five required hotspot
  access areas; all five report statuses; exact aggregation results; cap and
  repeat definitions; full segment completion; `null` CO2e preservation; valid
  and invalid status transitions; input immutability.
- **Commit:** `feat: add phase 0b dashboard data contracts`
- **Acceptance:** shared package lint, typecheck, build, and tests pass; all
  visible numeric metrics can be derived; no new report/status/route/reward
  union is duplicated in dashboard code; mobile diff is empty.
- **Effort:** 0.5 day.

### Workstream 2 - Layout and overview metrics

- **Objective:** replace the starter dashboard with the neutral agency-prototype
  shell, persistent disclosure, in-page navigation, six derived overview cards,
  and responsive presentation styling.
- **Likely files:**
  `apps/dashboard/app/layout.tsx`,
  `apps/dashboard/app/page.tsx`,
  `apps/dashboard/app/globals.css`,
  `apps/dashboard/app/components/agency-dashboard-demo.tsx`,
  `apps/dashboard/app/components/prototype-disclosure.tsx`, and
  `apps/dashboard/app/components/overview-metrics.tsx`.
- **Dependencies:** Workstream 1 overview helper and disclosure strings.
- **Exclusions:** no functional report update yet, no map, no advanced charts,
  no MMDA logo/ownership claim.
- **Tests:** overview labels and values match helper output; CO2e shows no number;
  disclosure and local-reset limitation are visible; semantic heading/order
  smoke test; targeted visual QA at 1366x768 and narrow width.
- **Commit:** `feat: build phase 0b dashboard overview`
- **Acceptance:** all six cards render from shared data, the verified metric is
  primary, CO2e says `Pending pilot calibration`, no starter corridor content
  remains, no overflow occurs at target sizes, mobile diff is empty.
- **Effort:** 0.5 to 0.75 day.

### Workstream 3 - Report queue and status workflow

- **Objective:** implement the deterministic report queue, selected report
  detail, and next-only local status control needed for the pitch.
- **Likely files:**
  `apps/dashboard/app/components/report-queue.tsx`,
  `apps/dashboard/app/components/report-detail.tsx`,
  `apps/dashboard/lib/report-workflow.ts`, and
  `apps/dashboard/tests/report-workflow.test.ts`.
- **Dependencies:** Workstream 1 reports and transition helper; Workstream 2
  client demo shell.
- **Exclusions:** no persistence, assignment identity, notifications, bulk
  action, API call, or claim of agency processing.
- **Tests:** all required fields render; Submitted seed is initially selected;
  Submitted advances only to Under Review; invalid/skipped transitions are
  rejected; local array is copied rather than mutating shared seed; Under Review
  overview count updates; reset restores initial state; keyboard focus remains
  clear.
- **Commit:** `feat: add prototype report queue workflow`
- **Acceptance:** the narrator can open the seeded mobile report and move it from
  Submitted to Under Review in two obvious actions; UI states the change is
  local and temporary; reload/reset is deterministic; mobile diff is empty.
- **Effort:** 0.5 to 0.75 day.

### Workstream 4 - Pilot-corridor hotspot visualization

- **Objective:** show the five required access areas and their seeded reports in
  a lightweight, legible route schematic linked to report selection.
- **Likely files:**
  `apps/dashboard/app/components/hotspot-schematic.tsx`,
  `apps/dashboard/app/components/hotspot-marker.tsx`, and dashboard CSS.
- **Dependencies:** Workstream 1 hotspot aggregation; Workstream 3 selected
  report/access-point state.
- **Exclusions:** no paid map API, map tiles, real GIS, geocoding, pan/zoom,
  routing, spatial accuracy claim, or live feed.
- **Tests:** all five required labels render in order; each report maps to a
  valid access point; selected report highlights the matching node; marker text
  includes simulated-prototype wording; status/severity remains understandable
  without color.
- **Commit:** `feat: add pilot hotspot schematic`
- **Acceptance:** selecting the Araneta-Cubao report visibly emphasizes its
  access area; all five locations are readable at presentation resolution; the
  surface is consistently labeled `Pilot-route access schematic` and
  `Simulated prototype reports`; mobile diff is empty.
- **Effort:** 0.5 day.

### Workstream 5 - Trip and campaign analytics

- **Objective:** render compact, derived evidence for verified mode shift,
  classifier outcomes, route completion, transfer points, campaign use, and
  repeat behavior.
- **Likely files:**
  `apps/dashboard/app/components/trip-insights.tsx`,
  `apps/dashboard/app/components/campaign-insights.tsx`, and shared/dashboard
  tests if a presentation formatter is added.
- **Dependencies:** Workstream 1 trip/campaign helpers and approved cap/repeat
  definitions; Workstream 2 visual system.
- **Exclusions:** no live user list, real commuter identity, operational
  monitoring, predictive analysis, real redemption, or carbon total.
- **Tests:** verified plus suspicious/rejected counts reconcile to fixture;
  confidence display uses the intended bands/rounding; complete route count
  requires all five segment IDs; common points are stable under record order;
  Points and cap usage derive from reward/campaign inputs; repeat rate uses the
  approved denominator; empty datasets are handled truthfully.
- **Commit:** `feat: add trip and campaign insights`
- **Acceptance:** every value is derived and labeled simulated; the viewer can
  distinguish verification from suspicion, see five-segment completion, and
  connect repeat verified trips to the campaign without any redemption/live
  claim; mobile diff is empty.
- **Effort:** 0.5 day.

### Workstream 6 - End-to-end demonstration state

- **Objective:** connect overview, queue, selected report, hotspot, and campaign
  evidence into one deterministic 45-second path with reset behavior.
- **Likely files:**
  `apps/dashboard/app/components/agency-dashboard-demo.tsx`,
  `apps/dashboard/lib/dashboard-view-model.ts`,
  `apps/dashboard/tests/dashboard-view-model.test.ts`, and targeted component
  files from Workstreams 2-5.
- **Dependencies:** Workstreams 2-5 complete.
- **Exclusions:** no cross-app runtime transport, URL deep-link contract,
  persistence, timers, autoplay, or brittle guided-tour library.
- **Tests:** selection is shared between queue and schematic; status update
  changes only current local report-derived metrics; reset restores the entire
  initial view; fixture is not mutated; all pitch anchors are reachable in page
  order.
- **Commit:** `feat: connect seeded dashboard demo flow`
- **Acceptance:** a cold load always opens in the same state, the selected report
  remains visible while moving to its hotspot, the complete flow rehearses in
  45 seconds or less, and no network is required after the app loads.
- **Effort:** 0.25 to 0.5 day.

### Workstream 7 - Tests and quality gates

- **Objective:** add the smallest maintainable dashboard test harness, close
  integration gaps, and prove the monorepo release candidate without changing
  Phase 0A behavior.
- **Likely files:**
  `apps/dashboard/package.json`,
  `apps/dashboard/tests/*.test.ts`,
  `package-lock.json`, and test/config files only if required.
- **Dependencies:** all functional workstreams; use the existing Node test style
  where practical.
- **Exclusions:** no dependency upgrades, audit fixes, broad tooling migration,
  snapshot-heavy suite, or unrelated formatting sweep.
- **Tests:** add `tsx --test` for dashboard pure state/view-model tests; use
  shared package tests for aggregations; rely on Next build plus manual browser
  QA for rendering. Add DOM test dependencies only if an interaction cannot be
  adequately proven through pure workflow tests and browser QA.
- **Commit:** `test: cover phase 0b dashboard behavior`
- **Acceptance:** dashboard has a real `test` script; clean `npm ci`, root
  verify, root build, and dashboard-specific lint/typecheck/test/build all pass;
  no generated outputs are committed; mobile diff is empty.
- **Effort:** 0.5 day.

### Workstream 8 - Demo hardening and video capture

- **Objective:** make the release candidate presentation-safe, document the
  exact narration/reset steps, perform physical QA, and capture a fallback
  walkthrough.
- **Likely files:**
  `apps/dashboard/README.md` and, only if QA finds dashboard-specific defects,
  the smallest relevant dashboard component/CSS/test files. Store submission
  video outside Git unless repository policy explicitly approves media assets.
- **Dependencies:** Workstream 7 passes on a clean install.
- **Exclusions:** no new features, mobile redesign, late dependency changes,
  production hosting promise, or committed generated build/video output.
- **Tests:** three timed cold-load rehearsals; reload/reset; keyboard path;
  offline-after-load path; current Chrome and Edge; projector resolution;
  narrow layout; disclosure/claims checklist; backup video playback with audio.
- **Commit:** `docs: harden phase 0b demo walkthrough` (or no commit if only
  external video/rehearsal artifacts change).
- **Acceptance:** median walkthrough is at most 45 seconds and no run exceeds 45
  seconds; fallback video plays locally; all simulated/local/static limitations
  are visible; final gates remain green; mobile diff is empty.
- **Effort:** 0.5 day plus presenter rehearsal.

## 9. File-Level Change Map

| Path | Planned action | Purpose |
| --- | --- | --- |
| `packages/shared/src/types.ts` | Extend | Add composed dashboard prototype record/view-model types without changing stable unions. |
| `packages/shared/src/dashboard.ts` | Add | Pure validation, aggregation, and status-transition helpers. |
| `packages/shared/src/dashboard-demo-data.ts` | Add | Canonical deterministic Phase 0B seed. |
| `packages/shared/src/index.ts` | Extend | Export public dashboard contracts, helpers, and seed. |
| `packages/shared/tests/dashboard.test.ts` | Add | Contract, aggregation, referential-integrity, and transition coverage. |
| `data/seed/access-barrier-reports.json` | Remove after verification | Eliminate the unused duplicate after migrating its five records to the canonical typed seed. |
| `apps/dashboard/app/layout.tsx` | Replace dashboard metadata only | Use neutral simulated-pilot title/description. |
| `apps/dashboard/app/page.tsx` | Replace | Compose the Phase 0B dashboard instead of the starter content. |
| `apps/dashboard/app/globals.css` | Refine | Responsive, accessible dashboard presentation styles. |
| `apps/dashboard/app/components/*.tsx` | Add | Disclosure, overview, report, hotspot, trip, and campaign sections. |
| `apps/dashboard/lib/report-workflow.ts` | Add if not fully shared | Dashboard-local state adapter around shared transition rules. |
| `apps/dashboard/lib/dashboard-view-model.ts` | Add | Create immutable initial state and presentation formatters. |
| `apps/dashboard/tests/*.test.ts` | Add | Local workflow/view-model integration coverage. |
| `apps/dashboard/package.json` | Extend | Add a dashboard test script and only the minimal scoped test dependency. |
| `package-lock.json` | Update mechanically | Lock only explicitly approved dashboard test tooling. |
| `apps/dashboard/README.md` | Update at hardening | Exact run, reset, disclosure, and 45-second demo instructions. |

Files that must remain untouched:

- `apps/mobile/**`
- Phase 0A audit evidence and frozen screenshots
- classifier, reward, and route behavior except additive public exports needed
  by the dashboard
- production/deployment configuration not required by the existing dashboard
  build

If an implementation discovers that a frozen file must change, stop that
workstream and request a scoped decision before editing it.

## 10. Automated Test Plan

### Shared unit tests

- Reject duplicate report, participant, trip, campaign, or segment identifiers.
- Reject unknown route/access-point/segment references.
- Prove the seed contains the five required hotspot areas and the five report
  statuses.
- Prove overview/report totals reconcile with the record arrays.
- Prove exact status counting: “Reports Under Review” means exact
  `Under Review`, not Submitted or all unresolved reports.
- Prove `Submitted -> Under Review -> Verified -> Assigned -> Resolved` is the
  only forward path and that terminal Resolved has no next status.
- Prove transition/aggregation helpers never mutate inputs.
- Prove verified versus suspicious/rejected trip counts follow the existing
  classifier/verification meanings.
- Prove full route completion requires all five final segment IDs.
- Prove common access-point ranking is deterministic, including ties.
- Prove campaign Points, cap usage, repeat count, and repeat rate use approved
  definitions and handle zero denominators.
- Prove pending CO2e stays `null` and formats as `Pending pilot calibration`.

### Dashboard state and rendering tests

- Initial state selects the seeded Araneta-Cubao report.
- Queue rows expose all required fields and unambiguous status text.
- The valid action changes only that local report to Under Review.
- Overview under-review count responds to local status; unrelated metrics do
  not drift.
- Selected report ID maps to the expected schematic access-point ID.
- Reset returns a deep-equal initial state and does not mutate shared seed data.
- Required disclosure, six overview labels, five hotspot labels, trip insight
  labels, and campaign insight labels are present.
- CO2e output contains no numeric unit/value while pending.
- There are no controls or labels for redemption, dispatch, enforcement, live
  tracking, or persistence.

### Regression strategy

- Keep existing shared classifier, reward, route, and mobile tests unchanged and
  passing.
- Run the full root verification after dashboard-specific tests, not instead of
  it.
- Treat any `apps/mobile` diff as a release blocker even if automated tests pass.
- Prefer behavioral assertions over full-page snapshots so copy and layout can
  be responsibly refined without opaque snapshot churn.

## 11. Quality Gates

Run from a clean checkout in this order:

```powershell
npm ci
npm run test -w @lakbaypoints/shared
npm run test -w @lakbaypoints/dashboard
npm run lint -w @lakbaypoints/dashboard
npm run typecheck -w @lakbaypoints/dashboard
npm run build -w @lakbaypoints/dashboard
npm run verify
npm run build
git diff --check
git diff -- apps/mobile
git status --short
```

Gate policy:

- Stop on the first failure and repair only the scoped cause.
- Do not run dependency upgrades or `npm audit fix` as part of Phase 0B.
- Do not commit `.next`, coverage, videos, logs, caches, or other generated
  outputs.
- `npm ci` must leave the tracked tree clean.
- A line-ending or formatter failure must be diagnosed and corrected without a
  repository-wide unrelated rewrite; do not waive `npm run verify`.
- Before the release-candidate merge, run all gates again from the intended
  merge commit, then rehearse from the same build.

## 12. Five-Minute Demo Integration

### Dashboard segment: target 42 seconds, hard maximum 45 seconds

| Time | Action | Narration purpose |
| --- | --- | --- |
| 0-5 s | Open overview; point to the simulated-data banner. | Establish truthful agency prototype context. |
| 5-10 s | Point to Verified Sustainable Trips. | Show verified mode shift as the primary outcome. |
| 10-18 s | Open the preselected simulated mobile-submitted report. | Connect commuter access evidence to an agency queue. |
| 18-24 s | Click `Move to Under Review`. | Demonstrate a local prototype workflow; say it is not persisted. |
| 24-32 s | Move to the schematic; show Araneta-Cubao highlighted. | Turn a report into a route-access hotspot signal. |
| 32-39 s | Point to verified qualifying trips and repeat-trip rate/cap usage. | Connect verification to campaign learning and sustained behavior. |
| 39-42 s | Close on “Guide the Trip. Verify the Shift. Improve Access.” | Return to the platform story. |

Presenter language:

- Say **simulated pilot**, **seeded records**, **local prototype update**, and
  **access schematic**.
- Do not say live, deployed, integrated with MMDA, agency-assigned, tracked,
  measured carbon, or redeemed.
- If asked about CO2e, say the methodology is intentionally pending pilot
  calibration and LakbayPoints does not claim an unverified environmental
  total.

### Placement in the full five-minute pitch

1. **0:00-0:35 - Problem:** fragmented multimodal trips and unresolved access
   barriers make sustainable mode shift difficult.
2. **0:35-1:05 - Platform:** introduce guidance, verification, and access
   feedback as one loop.
3. **1:05-2:45 - Mobile demonstration:** show the five-segment route, verified
   trip, rewards distinction, and access-report submission.
4. **2:45-3:27 - Dashboard demonstration:** run the 42-second sequence above.
5. **3:27-4:15 - Pilot value:** explain what a controlled pilot could learn from
   verified trips, barriers, repeat behavior, and campaign caps.
6. **4:15-4:45 - Boundaries and next step:** state static data, no live agency
   integration, and calibration needs; propose a pilot rather than deployment.
7. **4:45-5:00 - Close:** repeat the product message and call to action.

Use the backup video only if the live browser is unavailable or a rehearsal
shows unacceptable timing variance. The narration and claims remain identical.

## 13. Device and Browser QA

Test the release candidate, not a development-only intermediate state:

- Current stable Chrome and Edge on the presentation Windows machine.
- 1366x768 at 100% zoom as the minimum projector target.
- 1920x1080 at 100% zoom for recording.
- 768px-wide responsive check and one narrow/mobile-width sanity check; the
  agency dashboard need not mimic the mobile app but must remain readable.
- Keyboard-only path: overview to report row, status action, reset, and section
  navigation with visible focus.
- Contrast and non-color status/severity identification.
- Long category/location labels, all five statuses, and pending CO2e text.
- Cold load, hard reload, reset, and offline-after-initial-load behavior.
- Three timed runs from the same initial state; record each duration.
- Projector legibility from presentation distance and no clipped browser chrome.
- Browser console free of errors and no failed network dependency required for
  the core demo.
- Backup video file opens, has intelligible audio, matches the current UI, and
  is available locally without network access.

Do not modify `apps/mobile` to solve dashboard breakpoints. Separately smoke the
frozen mobile demo after the dashboard release candidate to confirm there is no
shared-package regression.

## 14. Commit and Merge Strategy

Implementation should occur on a new branch such as
`codex/phase-0b-agency-dashboard` created from the reconciled, clean Phase 0A
`main`. Do not begin the implementation branch while local and remote Phase 0A
history disagree or baseline gates fail.

Preferred commit sequence:

1. `feat: add phase 0b dashboard data contracts`
2. `feat: build phase 0b dashboard overview`
3. `feat: add prototype report queue workflow`
4. `feat: add pilot hotspot schematic`
5. `feat: add trip and campaign insights`
6. `feat: connect seeded dashboard demo flow`
7. `test: cover phase 0b dashboard behavior`
8. `docs: harden phase 0b demo walkthrough`

Each commit must be independently reviewable, include its scoped tests, and
leave mobile untouched. Before every commit:

```powershell
git diff --check
git diff -- apps/mobile
git status --short
```

Before merge:

- Rebase is not required; use the repository's approved non-destructive merge
  workflow.
- Review the complete diff for prototype claims, unexpected config/dependency
  changes, generated files, and mobile changes.
- Run Section 11 from a clean install.
- Merge only after the 45-second rehearsal and device/browser gate pass.
- Tag/release naming is a separate approval; Phase 0B planning does not assign
  or move a release tag.

## 15. Risks and Rollback

| Risk | Prevention / detection | Rollback |
| --- | --- | --- |
| Dashboard implies live MMDA integration or endorsement | Neutral title, persistent disclosure, copy checklist, presenter script | Revert the smallest copy/UI commit; never hide the limitation in fine print. |
| Seed counts drift from cards | One canonical seed plus pure helpers and reconciliation tests | Revert the workstream or restore last passing helper/fixture pair. |
| Mobile report appears falsely synchronized | Stable seeded ID and explicit `Simulated mobile submission` label | Remove the cross-app narrative, not the frozen mobile flow. |
| CO2e becomes an invented number | `null` contract, pending formatter, no numeric UI path, explicit test | Revert any CO2e calculation/display commit immediately. |
| Status action suggests persistence or real dispatch | Next-only local state, temporary label, reset/reload behavior | Revert Workstream 3 while preserving static queue and hotspot. |
| Duplicate route/report/status definitions | Shared exports, no-consumer check before fixture migration, import lint/review | Revert the duplicate and use the stable shared contract. |
| Hotspot schematic is mistaken for GIS | Call it a schematic; no basemap; simulated marker legend | Fall back to a five-node accessible list/route strip. |
| Test tooling expands dependency risk | Prefer existing `tsx`/Node style; approve only scoped dev dependency | Revert Workstream 7 tooling commit and retain pure shared tests plus build/manual QA until a smaller harness is approved. |
| Projector layout or timing fails | Fixed target resolution, three rehearsals, large typography, no timed animation | Use compact layout or fallback video; do not add late features. |
| Root formatter/line endings fail after checkout | Clean-install gate and diff review before implementation; no bulk unrelated rewrite | Diagnose checkout/config cause; stop release until a scoped fix or clean environment is established. |
| Deadline compression | Daily milestone and scope triage order in Sections 3 and 7 | Freeze at the last passing primary-demo-path commit and cut optional polish. |

Rollback is commit-oriented: revert the smallest Phase 0B workstream commit,
rerun its dependent tests and the root gate, and preserve the Phase 0A baseline.
Never reset, force-push, discard unrelated work, or edit frozen mobile files to
recover the dashboard.

## 16. Phase 0B Completion Criteria

Phase 0B is complete only when all statements are true:

- The overview displays all six required indicators from shared seeded data.
- Estimated CO2e Avoided displays `Pending pilot calibration` with no invented
  numeric total.
- The report queue shows every required field and all five prototype reports.
- The seeded Submitted report can be opened and advanced locally to Under
  Review, and reload/reset restores the initial state.
- The access schematic displays all five required final-route areas and links
  the selected report to the correct simulated marker.
- Trip insights show verified, suspicious/rejected, classifier confidence,
  five-segment completion, and common access/transfer points.
- One prototype campaign shows participating commuters, verified qualifying
  trips, Points issued, cap usage, and repeat-trip rate without redemption.
- Route, reward, report, classifier, and status definitions are consumed from
  shared contracts rather than duplicated in dashboard components.
- Every simulated value and local-only action is clearly labeled.
- The dashboard makes no live MMDA integration, agency adoption, dispatch,
  enforcement, GPS, GIS, redemption, or carbon-accounting claim.
- `apps/mobile` has no Phase 0B visual or behavioral diff and its existing tests
  remain passing.
- Clean-install dashboard test, lint, typecheck, and build commands pass.
- Root `npm run verify` and `npm run build` pass with a clean tracked tree.
- Device/browser, keyboard, projector, reload/reset, and offline-after-load QA
  pass.
- Three rehearsals complete the dashboard flow in 45 seconds or less.
- The backup video and exact presenter script are available locally.
- Only scoped source, test, lockfile, and dashboard documentation changes are in
  the release candidate; no generated output is committed.

## 17. Recommended First Implementation Prompt

> Implement only Phase 0B Workstream 1 from
> `docs/plans/phase-0b-agency-dashboard-plan.md`: dashboard data contracts,
> canonical deterministic seed data, pure aggregation/status helpers, and
> shared tests. Before editing, confirm the six Section 1 decisions, verify a
> clean implementation branch from reconciled Phase 0A `main`, and confirm
> `git diff -- apps/mobile` is empty. Reuse the existing shared route,
> classifier, reward, report, and status definitions; do not build dashboard UI
> or modify `apps/mobile`. Migrate the five unused JSON access-report records to
> one typed shared seed only after confirming no consumers. Keep CO2e `null` and
> formatted as `Pending pilot calibration`; do not invent totals, live data, or
> agency integration. Add referential-integrity, aggregation, campaign-cap,
> repeat-user, five-segment-completion, immutability, and valid-transition tests.
> Run the shared package lint, typecheck, test, and build gates plus
> `git diff --check`; stop and report any baseline or scope failure. Commit only
> the Workstream 1 files as `feat: add phase 0b dashboard data contracts`.
