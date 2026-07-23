import type { RouteAccessPoint, RouteOption, RouteTotals } from "./types";

export const PHASE_0A_ROUTE_DATA_VERSION = "phase-0a-2026-07-19";
export const PHASE_0A_ROUTE_LAST_REVIEWED_DATE = "2026-07-19";
export const PHASE_0A_ROUTE_DISCLAIMER =
  "Static prototype estimates for the MMITS demonstration. Travel time, ferry fare, and environmental impact require pilot-data calibration.";

const pilotAccessPoints: RouteAccessPoint[] = [
  {
    id: "mrt-guadalupe-train-station",
    label: "MRT-GUADALUPE TRAIN STATION",
    kind: "mrt_station",
  },
  {
    id: "city-of-mandaluyong",
    label: "City of Mandaluyong Science High School",
    kind: "demo_destination",
  },
  {
    id: "guadalupe-ferry-station",
    label: "Guadalupe Ferry Station",
    kind: "ferry_station",
  },
  {
    id: "hulo-ferry-station",
    label: "Hulo Ferry Station",
    kind: "ferry_station",
  },
];

export const phase0ARouteOptions: RouteOption[] = [
  {
    id: "private-vehicle-baseline",
    name: "Private Vehicle Baseline",
    type: "private_baseline",
    recommendationStatus: "comparison_only",
    dataStatus: "pending_confirmation",
    dataStatusLabel: "Prototype comparison — pending calibration",
    dataVersion: PHASE_0A_ROUTE_DATA_VERSION,
    lastReviewedDate: PHASE_0A_ROUTE_LAST_REVIEWED_DATE,
    disclaimer: PHASE_0A_ROUTE_DISCLAIMER,
    originAccessPointId: "cubao-home-access-zone",
    destinationAccessPointId: "hulo-office-demo-destination",
    accessPoints: [...pilotAccessPoints],
    accessScore: "Poor",
    rewardEligibility: "ineligible",
    estimatedCo2eAvoidedKg: null,
    co2eMethodologyStatus: "pending_confirmation",
    co2eDisplay: "Pending pilot calibration",
    notes: [
      "Comparison only; final baseline metrics are not yet approved",
      "Not eligible for Lakbay Score or campaign Points",
    ],
    segments: [
      {
        id: "private-cubao-hulo-baseline",
        mode: "private_vehicle",
        displayMode: "Private vehicle",
        label: "Private vehicle comparison route",
        originAccessPointId: "cubao-home-access-zone",
        destinationAccessPointId: "hulo-office-demo-destination",
        travelTimeMin: null,
        waitDwellTimeMin: null,
        distanceKm: null,
        farePhp: null,
        fareStatus: "pending_confirmation",
        fareDisplay: "To be confirmed",
      },
    ],
  },
  {
    id: "phase-0a-multimodal-pilot-route",
    name: "Recommended Multimodal Pilot Route",
    type: "sustainable",
    recommendationStatus: "recommended",
    dataStatus: "prototype_estimate",
    dataStatusLabel: "Static prototype data",
    dataVersion: PHASE_0A_ROUTE_DATA_VERSION,
    lastReviewedDate: PHASE_0A_ROUTE_LAST_REVIEWED_DATE,
    disclaimer: PHASE_0A_ROUTE_DISCLAIMER,
    originAccessPointId: "mrt-guadalupe-train-station",
    destinationAccessPointId: "city-of-mandaluyong",
    accessPoints: [...pilotAccessPoints],
    accessScore: "Good",
    rewardEligibility: "verification_required",
    estimatedCo2eAvoidedKg: null,
    co2eMethodologyStatus: "pending_confirmation",
    co2eDisplay: "Pending pilot calibration",
    lakbayScoreReward: 120,
    campaignPointsReward: 40,
    notes: [
      "Potential rewards are subject to trip verification",
      "Campaign Points are subject to the campaign cap",
    ],
    segments: [
      {
        id: "walk-to-guadalupe-ferry",
        mode: "walk",
        displayMode: "Walk",
        label: "Walk to Guadalupe Ferry Station",
        originAccessPointId: "mrt-guadalupe-train-station",
        destinationAccessPointId: "guadalupe-ferry-station",
        travelTimeMin: 5,
        waitDwellTimeMin: 0,
        distanceKm: 0.3,
        farePhp: 0,
        fareStatus: "not_applicable",
      },
      {
        id: "ferry-guadalupe-to-hulo",
        mode: "ferry",
        displayMode: "Ferry",
        label: "Pasig River Ferry to Hulo",
        originAccessPointId: "guadalupe-ferry-station",
        destinationAccessPointId: "hulo-ferry-station",
        travelTimeMin: 15,
        waitDwellTimeMin: 10,
        distanceKm: 3.0,
        farePhp: 0,
        fareStatus: "official_reference",
      },
      {
        id: "walk-hulo-to-mandaluyong",
        mode: "walk",
        displayMode: "Walk",
        label: "Walk to City of Mandaluyong Science High School",
        originAccessPointId: "hulo-ferry-station",
        destinationAccessPointId: "city-of-mandaluyong",
        travelTimeMin: 10,
        waitDwellTimeMin: 0,
        distanceKm: 0.8,
        farePhp: 0,
        fareStatus: "not_applicable",
      },
    ],
  },
  {
    id: "phase-2-multimodal-preview",
    name: "Phase 2 Multimodal Future Preview",
    type: "phase2_preview",
    recommendationStatus: "future_preview",
    dataStatus: "pending_confirmation",
    dataStatusLabel: "Future Preview — not live",
    dataVersion: PHASE_0A_ROUTE_DATA_VERSION,
    lastReviewedDate: PHASE_0A_ROUTE_LAST_REVIEWED_DATE,
    disclaimer: PHASE_0A_ROUTE_DISCLAIMER,
    originAccessPointId: "cubao-home-access-zone",
    destinationAccessPointId: "hulo-office-demo-destination",
    accessPoints: [
      ...pilotAccessPoints,
      {
        id: "future-connector",
        label: "Future connector point",
        kind: "concept_transfer",
      },
    ],
    accessScore: "Fair",
    rewardEligibility: "ineligible",
    estimatedCo2eAvoidedKg: null,
    co2eMethodologyStatus: "pending_confirmation",
    co2eDisplay: "Pending pilot calibration",
    phaseLabel: "Phase 2 Future Preview",
    futureIntegrationNote: "Requires future partner and data integration",
    notes: [
      "Concept preview only",
      "No live schedule, routing, fare, or environmental data",
    ],
    segments: [
      {
        id: "phase2-future-connector-concept",
        mode: "ebike",
        displayMode: "Future connector concept",
        label: "Future multimodal connector concept",
        originAccessPointId: "cubao-home-access-zone",
        destinationAccessPointId: "hulo-office-demo-destination",
        travelTimeMin: null,
        waitDwellTimeMin: null,
        distanceKm: null,
        farePhp: null,
        fareStatus: "pending_confirmation",
        fareDisplay: "To be confirmed",
      },
    ],
  },
];

export const phase0APilotRoute = phase0ARouteOptions.find(
  (route) => route.id === "phase-0a-multimodal-pilot-route",
) as RouteOption;

function sumComplete(values: Array<number | null>): number | null {
  return values.some((value) => value === null)
    ? null
    : values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

export function getRouteTotals(route: RouteOption): RouteTotals {
  const travelTimeMin = sumComplete(
    route.segments.map((segment) => segment.travelTimeMin),
  );
  const waitDwellTimeMin = sumComplete(
    route.segments.map((segment) => segment.waitDwellTimeMin),
  );

  return {
    travelTimeMin,
    waitDwellTimeMin,
    totalTimeMin:
      travelTimeMin === null || waitDwellTimeMin === null
        ? null
        : travelTimeMin + waitDwellTimeMin,
    distanceKm: sumComplete(
      route.segments.map((segment) => segment.distanceKm),
    ),
    knownFarePhp: route.segments.reduce(
      (total, segment) => total + (segment.farePhp ?? 0),
      0,
    ),
    hasPendingFare: route.segments.some(
      (segment) =>
        segment.farePhp === null &&
        segment.fareStatus === "pending_confirmation",
    ),
  };
}

export function formatRouteTime(route: RouteOption): string {
  const totalTimeMin = getRouteTotals(route).totalTimeMin;
  return totalTimeMin === null ? "Pending calibration" : `${totalTimeMin} min`;
}

export function formatRouteDistance(route: RouteOption): string {
  const distanceKm = getRouteTotals(route).distanceKm;
  return distanceKm === null
    ? "Pending calibration"
    : `${distanceKm.toFixed(1)} km`;
}

export function formatRouteFare(route: RouteOption): string {
  const totals = getRouteTotals(route);
  if (!totals.hasPendingFare) {
    return `PHP ${totals.knownFarePhp}`;
  }

  const hasPendingFerryFare = route.segments.some(
    (segment) =>
      segment.mode === "ferry" && segment.fareStatus === "pending_confirmation",
  );
  if (hasPendingFerryFare && totals.knownFarePhp > 0) {
    return `PHP ${totals.knownFarePhp} + ferry fare TBC`;
  }

  return "To be confirmed";
}

export function formatRouteCo2e(route: RouteOption): string {
  return route.estimatedCo2eAvoidedKg === null
    ? route.co2eDisplay
    : `${route.estimatedCo2eAvoidedKg.toFixed(1)} kg`;
}

export function getRouteAccessPointLabel(
  route: RouteOption,
  accessPointId: string,
): string {
  return (
    route.accessPoints.find((accessPoint) => accessPoint.id === accessPointId)
      ?.label ?? accessPointId
  );
}

export function getRouteChainLabel(route: RouteOption): string {
  return route.segments.map((segment) => segment.displayMode).join(" → ");
}
