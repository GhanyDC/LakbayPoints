import { phase0ARouteOptions } from "./routes";
import { getRouteVerificationProfile } from "./verification-profiles";
import type {
  ClassifierResult,
  ClassifierSignalChecklist,
  ClassifySustainableTripChainInput,
  GpsTraceActivity,
  GpsTracePoint,
  RewardEligibility,
  RouteOption,
  RouteVerificationAccessLocation,
  RouteVerificationProfile,
  RouteVerificationSpeedRange,
  TransportMode,
  VerificationResultLabel,
} from "./types";

const scoreWeights = {
  routeMatch: 25,
  speedPatternValid: 15,
  walkingSegmentsDetected: 15,
  proximityValid: 15,
  stationDwellDetected: 10,
  activityRecognitionSupport: 10,
  noSuspiciousMovement: 10,
} as const;

const supportedActivities: ReadonlySet<GpsTraceActivity> = new Set([
  "walking",
  "still",
  "in_vehicle",
  "unknown",
]);

type Coordinate = Pick<GpsTracePoint, "latitude" | "longitude">;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceKm(a: Coordinate, b: Coordinate) {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(b.latitude - a.latitude);
  const longitudeDelta = toRadians(b.longitude - a.longitude);
  const startLatitude = toRadians(a.latitude);
  const endLatitude = toRadians(b.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(startLatitude) *
      Math.cos(endLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(haversine));
}

function minutesBetween(a: GpsTracePoint, b: GpsTracePoint) {
  return (Date.parse(b.timestamp) - Date.parse(a.timestamp)) / 60000;
}

function buildRejectedResult(explanation: string): ClassifierResult {
  return {
    confidenceScore: 0,
    result: "Unverified trip",
    rewardEligibility: "None",
    signals: {
      routeMatch: false,
      speedPatternValid: false,
      walkingSegmentsDetected: false,
      stationDwellDetected: false,
      proximityValid: false,
      impossibleMovementDetected: false,
      suspiciousPattern: true,
      activityRecognitionSupport: false,
    },
    explanation: [explanation],
  };
}

function resolveEligibleRoute(input: ClassifySustainableTripChainInput):
  | {
      route: RouteOption;
      profile: RouteVerificationProfile;
    }
  | { error: string } {
  const selectedRouteId =
    typeof input.selectedRoute === "string"
      ? input.selectedRoute
      : input.selectedRoute?.id;

  if (!selectedRouteId) {
    return { error: "Selected route is missing or invalid." };
  }

  const catalogRoute = phase0ARouteOptions.find(
    (candidate) => candidate.id === selectedRouteId,
  );
  if (!catalogRoute) {
    return { error: `Selected route ${selectedRouteId} is unknown.` };
  }

  const selectedRoute =
    typeof input.selectedRoute === "string"
      ? catalogRoute
      : input.selectedRoute;
  if (selectedRoute.type !== "sustainable") {
    return { error: "Selected route is not a sustainable route." };
  }
  if (selectedRoute.rewardEligibility !== "verification_required") {
    return { error: "Selected route is not eligible for verification." };
  }
  if (
    catalogRoute.type !== "sustainable" ||
    catalogRoute.rewardEligibility !== "verification_required"
  ) {
    return { error: "Selected route is not eligible for verification." };
  }

  const profile = getRouteVerificationProfile(catalogRoute.id);
  if (!profile || profile.eligibleRouteType !== catalogRoute.type) {
    return { error: "Selected route has no eligible verification profile." };
  }

  return { route: catalogRoute, profile };
}

function validateTrace(
  traceInput: unknown,
  profile: RouteVerificationProfile,
): { trace: GpsTracePoint[] } | { error: string } {
  if (!Array.isArray(traceInput)) {
    return { error: "Invalid trace data: GPS trace must be an array." };
  }
  if (traceInput.length < profile.minimumTracePointCount) {
    return {
      error: `Invalid trace data: at least ${profile.minimumTracePointCount} points are required.`,
    };
  }

  let previousTimestamp = Number.NEGATIVE_INFINITY;
  for (let index = 0; index < traceInput.length; index += 1) {
    const point = traceInput[index] as Partial<GpsTracePoint> | null;
    if (!point || typeof point !== "object") {
      return {
        error: `Invalid trace data: point ${index + 1} is null or malformed.`,
      };
    }

    if (typeof point.timestamp !== "string") {
      return {
        error: `Invalid trace data: point ${index + 1} has no valid timestamp.`,
      };
    }
    const timestamp = Date.parse(point.timestamp);
    if (!Number.isFinite(timestamp)) {
      return {
        error: `Invalid trace data: point ${index + 1} has a malformed timestamp.`,
      };
    }
    if (timestamp <= previousTimestamp) {
      return {
        error: `Invalid trace data: timestamps must be strictly increasing at point ${index + 1}.`,
      };
    }
    previousTimestamp = timestamp;

    if (
      typeof point.latitude !== "number" ||
      !Number.isFinite(point.latitude) ||
      point.latitude < -90 ||
      point.latitude > 90
    ) {
      return {
        error: `Invalid trace data: point ${index + 1} has an invalid latitude.`,
      };
    }
    if (
      typeof point.longitude !== "number" ||
      !Number.isFinite(point.longitude) ||
      point.longitude < -180 ||
      point.longitude > 180
    ) {
      return {
        error: `Invalid trace data: point ${index + 1} has an invalid longitude.`,
      };
    }
    if (
      point.speedKph !== undefined &&
      (typeof point.speedKph !== "number" ||
        !Number.isFinite(point.speedKph) ||
        point.speedKph < 0)
    ) {
      return {
        error: `Invalid trace data: point ${index + 1} has an invalid speed.`,
      };
    }
    if (
      point.activity !== undefined &&
      !supportedActivities.has(point.activity)
    ) {
      return {
        error: `Invalid trace data: point ${index + 1} has an unsupported activity.`,
      };
    }
  }

  return { trace: traceInput as GpsTracePoint[] };
}

function validateActivityLabels(activityLabels: unknown) {
  if (activityLabels === undefined) {
    return true;
  }
  return (
    Array.isArray(activityLabels) &&
    activityLabels.every((activity) => supportedActivities.has(activity))
  );
}

function getAccessSequence(profile: RouteVerificationProfile) {
  return [
    profile.expectedStartAccessZone,
    ...profile.expectedTransferAccessLocations,
    profile.expectedEndAccessZone,
  ];
}

function getLocationThreshold(
  location: RouteVerificationAccessLocation,
  profile: RouteVerificationProfile,
) {
  if (
    location.accessPointId === profile.expectedStartAccessZone.accessPointId
  ) {
    return profile.proximityThresholds.startKm;
  }
  if (location.accessPointId === profile.expectedEndAccessZone.accessPointId) {
    return profile.proximityThresholds.endKm;
  }
  return profile.proximityThresholds.transferKm;
}

function isNearLocation(
  point: GpsTracePoint,
  location: RouteVerificationAccessLocation,
  profile: RouteVerificationProfile,
) {
  return distanceKm(point, location) <= getLocationThreshold(location, profile);
}

function findOrderedAccessIndexes(
  trace: GpsTracePoint[],
  profile: RouteVerificationProfile,
): number[] | null {
  const indexes: number[] = [];
  let searchFrom = 0;

  for (const location of getAccessSequence(profile)) {
    const relativeIndex = trace
      .slice(searchFrom)
      .findIndex((point) => isNearLocation(point, location, profile));
    if (relativeIndex < 0) {
      return null;
    }
    const absoluteIndex = searchFrom + relativeIndex;
    indexes.push(absoluteIndex);
    searchFrom = absoluteIndex;
  }

  return indexes;
}

function routeStructureMatches(
  route: RouteOption,
  profile: RouteVerificationProfile,
) {
  const accessSequence = getAccessSequence(profile).map(
    (location) => location.accessPointId,
  );
  const routeAccessSequence = [
    route.originAccessPointId,
    ...route.segments.map((segment) => segment.destinationAccessPointId),
  ];

  return (
    route.originAccessPointId ===
      profile.expectedStartAccessZone.accessPointId &&
    route.destinationAccessPointId ===
      profile.expectedEndAccessZone.accessPointId &&
    route.segments.length === profile.orderedSegmentModes.length &&
    route.segments.every(
      (segment, index) => segment.mode === profile.orderedSegmentModes[index],
    ) &&
    routeAccessSequence.length === accessSequence.length &&
    routeAccessSequence.every(
      (accessPointId, index) => accessPointId === accessSequence[index],
    )
  );
}

function getComputedMovement(trace: GpsTracePoint[]) {
  const computedSpeeds: number[] = [];
  const jumps: Array<{ distance: number; elapsedMinutes: number }> = [];

  for (let index = 1; index < trace.length; index += 1) {
    const previousPoint = trace[index - 1];
    const point = trace[index];
    const elapsedMinutes = minutesBetween(previousPoint, point);
    const distance = distanceKm(previousPoint, point);
    computedSpeeds.push(distance / (elapsedMinutes / 60));
    jumps.push({ distance, elapsedMinutes });
  }

  return { computedSpeeds, jumps };
}

function getSpeedRangeForMode(
  mode: TransportMode,
  profile: RouteVerificationProfile,
): RouteVerificationSpeedRange | undefined {
  switch (mode) {
    case "walk":
      return profile.allowedMovementSpeedRanges.walking;
    case "public_road_transport":
    case "jeepney":
    case "bus":
      return profile.allowedMovementSpeedRanges.publicRoadTransport;
    case "mrt":
      return profile.allowedMovementSpeedRanges.mrt;
    case "ferry":
      return profile.allowedMovementSpeedRanges.ferry;
    default:
      return undefined;
  }
}

function pointSupportsWalking(
  point: GpsTracePoint,
  walkingRange: RouteVerificationSpeedRange,
) {
  if (point.activity === "still" || point.speedKph === 0) {
    return false;
  }
  if (point.activity === "walking") {
    return (
      point.speedKph === undefined ||
      (point.speedKph >= walkingRange.minKph &&
        point.speedKph <= walkingRange.maxKph)
    );
  }
  return (
    point.activity !== "in_vehicle" &&
    point.speedKph !== undefined &&
    point.speedKph >= walkingRange.minKph &&
    point.speedKph <= walkingRange.maxKph
  );
}

function hasCredibleWalkingEvidence(
  traceWindow: GpsTracePoint[],
  minimumSupportingPoints: number,
  minimumPositionChangeKm: number,
  profile: RouteVerificationProfile,
) {
  const walkingRange = profile.allowedMovementSpeedRanges.walking;
  let longestRun: GpsTracePoint[] = [];
  let currentRun: GpsTracePoint[] = [];

  for (const point of traceWindow) {
    if (pointSupportsWalking(point, walkingRange)) {
      currentRun.push(point);
      if (currentRun.length > longestRun.length) {
        longestRun = [...currentRun];
      }
    } else {
      currentRun = [];
    }
  }

  if (longestRun.length < Math.max(2, minimumSupportingPoints)) {
    return false;
  }

  return (
    distanceKm(longestRun[0], longestRun[longestRun.length - 1]) >=
    minimumPositionChangeKm
  );
}

function hasMovementInRange(
  traceWindow: GpsTracePoint[],
  range: RouteVerificationSpeedRange,
) {
  return traceWindow.some(
    (point) =>
      point.speedKph !== undefined &&
      point.speedKph >= range.minKph &&
      point.speedKph <= range.maxKph,
  );
}

function hasRequiredDwell(
  trace: GpsTracePoint[],
  profile: RouteVerificationProfile,
) {
  const locations = getAccessSequence(profile);

  return profile.dwellRequirements.every((requirement) => {
    const location = locations.find(
      (candidate) => candidate.accessPointId === requirement.accessPointId,
    );
    if (!location) {
      return false;
    }
    const slowPoints = trace.filter(
      (point) =>
        isNearLocation(point, location, profile) &&
        (point.activity === "still" || (point.speedKph ?? Infinity) <= 2),
    );
    if (slowPoints.length < 2) {
      return false;
    }
    return (
      minutesBetween(slowPoints[0], slowPoints[slowPoints.length - 1]) >=
      requirement.minimumMinutes
    );
  });
}

function scoreSignals(signals: ClassifierSignalChecklist) {
  return (
    (signals.routeMatch ? scoreWeights.routeMatch : 0) +
    (signals.speedPatternValid ? scoreWeights.speedPatternValid : 0) +
    (signals.walkingSegmentsDetected
      ? scoreWeights.walkingSegmentsDetected
      : 0) +
    (signals.proximityValid ? scoreWeights.proximityValid : 0) +
    (signals.stationDwellDetected ? scoreWeights.stationDwellDetected : 0) +
    (signals.activityRecognitionSupport
      ? scoreWeights.activityRecognitionSupport
      : 0) +
    (!signals.suspiciousPattern ? scoreWeights.noSuspiciousMovement : 0)
  );
}

function getResult(
  score: number,
  suspiciousPattern: boolean,
): {
  result: VerificationResultLabel;
  rewardEligibility: RewardEligibility;
} {
  if (suspiciousPattern) {
    return { result: "Suspicious pattern", rewardEligibility: "None" };
  }
  if (score >= 80) {
    return {
      result: "Verified sustainable trip chain",
      rewardEligibility: "Full",
    };
  }
  if (score >= 60) {
    return { result: "Partially verified trip", rewardEligibility: "Reduced" };
  }
  return { result: "Unverified trip", rewardEligibility: "None" };
}

export function classifySustainableTripChain(
  input: ClassifySustainableTripChainInput,
): ClassifierResult {
  const routeResolution = resolveEligibleRoute(input);
  if ("error" in routeResolution) {
    return buildRejectedResult(routeResolution.error);
  }

  const { route, profile } = routeResolution;
  const traceValidation = validateTrace(input.gpsTrace, profile);
  if ("error" in traceValidation) {
    return buildRejectedResult(traceValidation.error);
  }
  if (!validateActivityLabels(input.activityLabels)) {
    return buildRejectedResult(
      "Invalid trace data: activity labels contain an unsupported value.",
    );
  }

  const trace = traceValidation.trace;
  const explanation: string[] = [];
  const structureMatches = routeStructureMatches(route, profile);
  const accessIndexes = findOrderedAccessIndexes(trace, profile);
  const routeMatch = structureMatches && accessIndexes !== null;
  const accessSequence = getAccessSequence(profile);
  const firstPoint = trace[0];
  const lastPoint = trace[trace.length - 1];
  const proximityValid =
    isNearLocation(firstPoint, profile.expectedStartAccessZone, profile) &&
    isNearLocation(lastPoint, profile.expectedEndAccessZone, profile) &&
    profile.expectedTransferAccessLocations.every((location) =>
      trace.some((point) => isNearLocation(point, location, profile)),
    );
  const stationDwellDetected = hasRequiredDwell(trace, profile);
  const { computedSpeeds, jumps } = getComputedMovement(trace);
  const reportedSpeeds = trace
    .map((point) => point.speedKph)
    .filter((speed): speed is number => speed !== undefined);
  const maxReportedSpeed = Math.max(0, ...reportedSpeeds);
  const maxComputedSpeed = Math.max(0, ...computedSpeeds);
  const maxJumpDistance = Math.max(0, ...jumps.map((jump) => jump.distance));
  const impossibleMovementDetected =
    maxReportedSpeed > profile.impossibleMovementThresholds.reportedSpeedKph ||
    maxComputedSpeed > profile.impossibleMovementThresholds.computedSpeedKph ||
    jumps.some(
      ({ distance, elapsedMinutes }) =>
        distance > profile.impossibleMovementThresholds.teleportDistanceKm &&
        elapsedMinutes <=
          profile.impossibleMovementThresholds.teleportMaximumMinutes,
    );

  const walkingSegmentsDetected =
    accessIndexes !== null &&
    profile.walkingRequirements.every((requirement) => {
      const segmentIndex = route.segments.findIndex(
        (segment) => segment.id === requirement.segmentId,
      );
      if (segmentIndex < 0) {
        return false;
      }
      return hasCredibleWalkingEvidence(
        trace.slice(
          accessIndexes[segmentIndex],
          accessIndexes[segmentIndex + 1] + 1,
        ),
        requirement.minimumSupportingPoints,
        requirement.minimumPositionChangeKm,
        profile,
      );
    });

  const movementSegmentsValid =
    accessIndexes !== null &&
    route.segments.every((segment, index) => {
      const range = getSpeedRangeForMode(segment.mode, profile);
      if (!range) {
        return false;
      }
      const traceWindow = trace.slice(
        accessIndexes[index],
        accessIndexes[index + 1] + 1,
      );
      if (segment.mode === "walk") {
        const requirement = profile.walkingRequirements.find(
          (candidate) => candidate.segmentId === segment.id,
        );
        return Boolean(
          requirement &&
          hasCredibleWalkingEvidence(
            traceWindow,
            requirement.minimumSupportingPoints,
            requirement.minimumPositionChangeKm,
            profile,
          ),
        );
      }
      return hasMovementInRange(traceWindow, range);
    });

  const speedPatternValid =
    !impossibleMovementDetected && movementSegmentsValid;
  const traceActivities = [
    ...trace.map((point) => point.activity).filter(Boolean),
    ...(input.activityLabels ?? []),
  ];
  const activityRecognitionSupport =
    traceActivities.includes("walking") &&
    traceActivities.includes("in_vehicle") &&
    traceActivities.includes("still");
  const suspiciousPattern =
    impossibleMovementDetected ||
    !routeMatch ||
    !proximityValid ||
    !stationDwellDetected ||
    !walkingSegmentsDetected ||
    !movementSegmentsValid;

  const signals: ClassifierSignalChecklist = {
    routeMatch,
    speedPatternValid,
    walkingSegmentsDetected,
    stationDwellDetected,
    proximityValid,
    impossibleMovementDetected,
    suspiciousPattern,
    activityRecognitionSupport,
  };

  explanation.push(
    routeMatch
      ? "Trace visits the final route's start, transfers, and destination in the required order."
      : "Trace does not match the final route's ordered access and transfer locations.",
  );
  explanation.push(
    speedPatternValid
      ? "Reported and computed movement fit the route profile's prototype speed ranges."
      : "Movement is incomplete or outside the selected route profile's speed ranges.",
  );
  explanation.push(
    walkingSegmentsDetected
      ? "Credible walking movement was detected from Guadalupe MRT to the ferry and from Hulo Ferry to the demo destination."
      : "One or both required walking segments lack sustained, non-zero movement evidence.",
  );
  explanation.push(
    proximityValid
      ? "Start, transfer, ferry, and destination access locations are within prototype proximity thresholds."
      : "Required final-route access proximity is incomplete.",
  );
  explanation.push(
    stationDwellDetected
      ? "Required dwell near MRT and ferry transfer locations supports the trip chain."
      : "Required MRT or ferry transfer dwell is missing.",
  );
  explanation.push(
    activityRecognitionSupport
      ? "Phone activity labels support walking, dwell, and vehicle movement."
      : "Phone activity labels are limited or do not support all route modes.",
  );
  explanation.push(
    impossibleMovementDetected
      ? `Suspicious movement detected: max speed ${Math.round(
          Math.max(maxReportedSpeed, maxComputedSpeed),
        )} kph, max jump ${maxJumpDistance.toFixed(1)} km.`
      : "No impossible movement was detected by the route profile thresholds.",
  );
  explanation.push(
    `Verification used the ${profile.routeId} generated-prototype profile with ${accessSequence.length} ordered access locations.`,
  );

  const rawScore = scoreSignals(signals);
  const confidenceScore = suspiciousPattern
    ? Math.min(rawScore, 45)
    : Math.min(rawScore, 95);
  const { result, rewardEligibility } = getResult(
    confidenceScore,
    suspiciousPattern,
  );

  return {
    confidenceScore,
    result,
    rewardEligibility,
    signals,
    explanation,
  };
}
