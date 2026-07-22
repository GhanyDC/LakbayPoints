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
