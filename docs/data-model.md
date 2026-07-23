# Data Model

The application uses simple TypeScript objects and static prototype data. The
authoritative route source is `packages/shared/src/routes.ts`; the file
`data/routes/phase-0a-multimodal-pilot-routes.json` is a test-validated mirror.

Frontend screens must use the shared selectors and formatting helpers. They
must not store their own copies of route totals.

## Data Status

```ts
type DataStatus =
  | "prototype_estimate"
  | "official_reference"
  | "pending_confirmation"
  | "not_applicable";
```

These values qualify individual fares and route-level methodology or data
status. They do not imply that the application is connected to live services.

## RouteAccessPoint

```ts
type RouteAccessPoint = {
  id: string;
  label: string;
  kind:
    | "home_access_zone"
    | "mrt_station"
    | "ferry_station"
    | "demo_destination"
    | "concept_transfer";
};
```

Access-point IDs let every segment reference the same approved public labels
without using a personal address.

## RouteSegment

```ts
type RouteSegment = {
  id: string;
  mode:
    | "walk"
    | "mrt"
    | "bus"
    | "jeepney"
    | "public_road_transport"
    | "ferry"
    | "bike"
    | "ebike"
    | "private_vehicle";
  displayMode: string;
  label: string;
  originAccessPointId: string;
  destinationAccessPointId: string;
  travelTimeMin: number | null;
  waitDwellTimeMin: number | null;
  distanceKm: number | null;
  farePhp: number | null;
  fareStatus: DataStatus;
  fareDisplay?: string;
};
```

The first pilot segment uses the generalized internal mode
`public_road_transport` and the public display label `Jeepney`.

## RouteOption

```ts
type RouteOption = {
  id: string;
  name: string;
  type: "private_baseline" | "sustainable" | "phase2_preview";
  recommendationStatus:
    | "recommended"
    | "comparison_only"
    | "future_preview";
  dataStatus: DataStatus;
  dataStatusLabel: string;
  dataVersion: string;
  lastReviewedDate: string;
  disclaimer: string;
  originAccessPointId: string;
  destinationAccessPointId: string;
  accessPoints: RouteAccessPoint[];
  segments: RouteSegment[];
  accessScore: "Poor" | "Fair" | "Good" | "Excellent";
  rewardEligibility: "verification_required" | "ineligible";
  estimatedCo2eAvoidedKg: number | null;
  co2eMethodologyStatus: DataStatus;
  co2eDisplay: string;
  lakbayScoreReward?: number;
  campaignPointsReward?: number;
  notes?: string[];
  phaseLabel?: string;
  futureIntegrationNote?: string;
};
```

Route-level reward eligibility describes whether the option may enter
verification. It is distinct from the classifier's `Full`, `Reduced`, or
`None` result.

## Derived RouteTotals

`getRouteTotals(route)` calculates:

```ts
type RouteTotals = {
  travelTimeMin: number | null;
  waitDwellTimeMin: number | null;
  totalTimeMin: number | null;
  distanceKm: number | null;
  knownFarePhp: number;
  hasPendingFare: boolean;
};
```

If any required time or distance is `null`, that total remains pending. Known
fare sums only non-null values while `hasPendingFare` preserves the unresolved
ferry fare in UI formatting.

## Approved Segment Values

| # | Mode | Travel | Wait/dwell | Distance | Fare | Fare status |
|---|---|---:|---:|---:|---:|---|
| 1 | Jeepney | 12 min | 5 min | 3.0 km | PHP 15 | `prototype_estimate` |
| 2 | MRT-3 | 17 min | 5 min | 6.5 km | PHP 20 | `official_reference` |
| 3 | Walk | 15 min | 0 min | 1.1 km | PHP 0 | `not_applicable` |
| 4 | Pasig River Ferry | 12 min | 10 min | 2.4 km | null / To be confirmed | `pending_confirmation` |
| 5 | Walk | 15 min | 0 min | 1.1 km | PHP 0 | `not_applicable` |

The derived result is 91 minutes, 14.1 km, PHP 35 in known fares plus ferry
fare TBC. `estimatedCo2eAvoidedKg` is `null` and its methodology status remains
`pending_confirmation`.

## Comparison Data Rules

- Private baseline time, cost/fare, distance, and CO2e are `null` pending
  calibration; it is reward-ineligible.
- Phase 2 Future Preview metrics are `null`, it is not live, and it is
  reward-ineligible.
- All route options carry a data version, review date, and disclaimer.

## GPS Trace and Classifier

`GpsTracePoint` accepts a timestamp, finite valid latitude/longitude, optional
finite non-negative speed, and an optional supported activity. Runtime
validation rejects malformed data safely before scoring and requires strictly
increasing timestamps.

`RouteVerificationProfile` binds verification to one exact route ID. It owns:

- the eligible route type and ordered segment modes;
- expected start, end, and transfer/access locations;
- start, transfer, and end proximity thresholds;
- walking, public-road-transport, MRT, and ferry speed ranges;
- minimum trace-point and chronology requirements;
- dwell and both walking-leg requirements; and
- impossible-speed and teleport thresholds.

The active final-route profile is exported from
`packages/shared/src/verification-profiles.ts`. It supports coarse ordered
access checks and does not claim full GIS map matching.

`ClassifierResult` contains a confidence score, verification label, reward
eligibility, signal checklist, and explanation. Invalid traces and unknown,
private, future, or profile-ineligible routes fail closed with confidence 0 and
reward eligibility `None`.

## Rewards and Reports

Lakbay Score is a non-cash progress value. Campaign Points are capped campaign
incentives. Reward calculation is pure and normalizes every numeric input:

- Lakbay Score, campaign Points, cap, verified-trip count, route rewards, and
  CO2e must be finite and non-negative;
- existing campaign Points are clamped into `0..cap`, and updated Points never
  exceed the normalized cap;
- Full verification earns the configured Lakbay Score and remaining capped
  campaign Points and increments the fully verified trip count;
- Reduced verification earns half the configured Lakbay Score, zero campaign
  Points, zero pending CO2e, and does not increment the fully verified count;
- Unverified and Suspicious results earn zero; and
- CO2e credit remains zero while methodology calibration is pending.

Whole Score/Point/count values and two-decimal CO2e totals use consistent
rounding at the calculation boundary. Repeated calculation does not mutate the
input state or create duplicate awards.

Access-barrier reports retain category, severity, description, coordinates,
status, and timestamp fields. Seeded coordinates are approximate prototype
data for the final route's access areas and are not evidence of a live agency
workflow.

## Phase 0B Dashboard Data Foundation

The authoritative Phase 0B dashboard seed is
`packages/shared/src/dashboard-seed.ts`. Dashboard applications consume it
through the public `@lakbaypoints/shared` exports. The previous standalone
five-report JSON seed was removed so report and hotspot data cannot drift from
the typed source.

Dashboard contracts are defined in
`packages/shared/src/dashboard-types.ts`. They compose the existing report
category, severity, status, classifier-result, and reward-eligibility types
rather than redefining those unions. The contracts cover:

- deterministic data provenance and the required simulated-data disclosure;
- participant, trip-verification, trip-chain, and confidence summaries;
- the per-participant campaign-cap model;
- report locations, reports, and hotspot summaries;
- six future overview metrics, including nullable CO2e; and
- typed local report-status transition results.

The approved aggregate seed is:

| Measure | Simulated value |
|---|---:|
| Participants | 120 |
| Repeat participants | 84 (70%) |
| Total trip attempts | 360 |
| Fully verified trips | 288 (80%) |
| Partially verified trips | 36 |
| Suspicious or rejected trips | 36 |
| Individual campaign cap | 100 Points |
| Total campaign allocation | 12,000 Points |
| Campaign Points issued | 8,640 (72% utilization) |
| Access-barrier reports | 25 |

A repeat participant has at least two fully verified qualifying pilot-route
trips during the simulated campaign window. Total campaign allocation is
derived as 120 participants multiplied by the 100-Point individual cap. Points
are simulated capped incentives with no redemption, wallet, payment, merchant,
settlement, ticket, or financial-value model.

The 25 deterministic reports cover only the five final-route access areas.
Their exact status distribution is 4 Submitted, 8 Under Review, 6 Verified, 4
Assigned, and 3 Resolved. The narrated record is the single High-severity unsafe
crossing report at the MRT-3 Araneta-Cubao access area and is labeled as a
simulated mobile prototype submission.

Pure aggregation and seed-validation helpers live in
`packages/shared/src/dashboard-analytics.ts`. Validation reports predictable
errors instead of throwing for ordinary invalid seed input. It reconciles
participant, trip, campaign, report, hotspot, disclosure, route, and CO2e
invariants. CO2e remains `null` with the display `Pending pilot calibration`.

The local-only report workflow is in
`packages/shared/src/report-workflow.ts`:

`Submitted -> Under Review -> Verified -> Assigned -> Resolved`

The helper accepts a same-status no-op and only the immediate next forward
status. Backward or skipped transitions and unknown report IDs return typed
failures. Input reports are not mutated. No backend, persistence, agency
dispatch, enforcement, or live MMDA integration exists.

Required dashboard disclosure:

> All metrics, reports, trip results, and campaign values shown in this
> dashboard are deterministic simulated prototype data for the MMITS
> demonstration. No live MMDA system or commuter data is connected.
