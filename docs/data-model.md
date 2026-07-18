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

`GpsTracePoint` and `ClassifierResult` remain shared prototype types. The
current rule-based classifier and sample traces still reflect the previous
corridor assumptions. Binding those rules, station points, and fixtures to the
final multimodal route is explicitly pending and is not part of this route-data
migration.

## Rewards and Reports

Lakbay Score is a non-cash progress value. Campaign Points are capped campaign
incentives. Existing reward-boundary stabilization remains pending.

Access-barrier reports retain category, severity, description, coordinates,
status, and timestamp fields. Seeded coordinates are approximate prototype
data and are not evidence of a live agency workflow.
