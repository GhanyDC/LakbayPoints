import { phase0ARouteOptions } from "./routes";
import type {
  ClassifierResult,
  ClassifierSignalChecklist,
  ClassifySustainableTripChainInput,
  GpsTracePoint,
  RewardEligibility,
  StationAccessPoint,
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

const defaultStationAccessPoints: StationAccessPoint[] = [
  {
    id: "guadalupe-mrt3",
    name: "Guadalupe MRT3",
    latitude: 14.5664,
    longitude: 121.0455,
  },
  {
    id: "boni-mrt3",
    name: "Boni MRT3",
    latitude: 14.5735,
    longitude: 121.048,
  },
  {
    id: "shaw-boulevard-mrt3",
    name: "Shaw Boulevard MRT3",
    latitude: 14.5818,
    longitude: 121.0531,
  },
  {
    id: "ortigas-mrt3",
    name: "Ortigas MRT3",
    latitude: 14.5868,
    longitude: 121.056,
  },
  {
    id: "santolan-annapolis-mrt3",
    name: "Santolan-Annapolis MRT3",
    latitude: 14.608,
    longitude: 121.0562,
  },
  {
    id: "araneta-center-cubao-mrt3",
    name: "Araneta Center-Cubao MRT3",
    latitude: 14.6196,
    longitude: 121.051,
  },
];

const guadalupeAccessPoint = defaultStationAccessPoints[0];
const cubaoAccessPoint =
  defaultStationAccessPoints[defaultStationAccessPoints.length - 1];

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceKm(
  a: GpsTracePoint | StationAccessPoint,
  b: GpsTracePoint | StationAccessPoint,
) {
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
  const startTime = new Date(a.timestamp).getTime();
  const endTime = new Date(b.timestamp).getTime();

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
    return 0;
  }

  return Math.max(0, (endTime - startTime) / 60000);
}

function isNearAnyStation(
  point: GpsTracePoint,
  accessPoints: StationAccessPoint[],
  thresholdKm: number,
) {
  return accessPoints.some(
    (accessPoint) => distanceKm(point, accessPoint) <= thresholdKm,
  );
}

function isWalkingLike(point: GpsTracePoint) {
  return point.activity === "walking" || (point.speedKph ?? 99) <= 7;
}

function resolveRoute(input: ClassifySustainableTripChainInput) {
  if (typeof input.selectedRoute !== "string") {
    return input.selectedRoute;
  }

  const options = input.routeOptions ?? phase0ARouteOptions;

  return (
    input.expectedRoute ??
    options.find((route) => route.id === input.selectedRoute) ??
    options.find((route) => route.type === "sustainable")
  );
}

function hasCorridorShape(trace: GpsTracePoint[]) {
  const pointsInPilotCorridor = trace.filter(
    (point) =>
      point.latitude >= 14.555 &&
      point.latitude <= 14.628 &&
      point.longitude >= 121.038 &&
      point.longitude <= 121.062,
  );
  const ratioInCorridor =
    pointsInPilotCorridor.length / Math.max(trace.length, 1);
  const firstPoint = trace[0];
  const lastPoint = trace[trace.length - 1];
  const northboundProgress =
    firstPoint && lastPoint
      ? lastPoint.latitude - firstPoint.latitude >= 0.035
      : false;

  return ratioInCorridor >= 0.8 && northboundProgress;
}

function getComputedSpeeds(trace: GpsTracePoint[]) {
  const computedSpeeds: number[] = [];
  const jumpDistances: number[] = [];

  for (let index = 1; index < trace.length; index += 1) {
    const previousPoint = trace[index - 1];
    const point = trace[index];
    const elapsedMinutes = minutesBetween(previousPoint, point);
    const distance = distanceKm(previousPoint, point);

    jumpDistances.push(distance);

    if (elapsedMinutes > 0) {
      computedSpeeds.push(distance / (elapsedMinutes / 60));
    }
  }

  return { computedSpeeds, jumpDistances };
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
    return {
      result: "Suspicious pattern",
      rewardEligibility: "None",
    };
  }

  if (score >= 80) {
    return {
      result: "Verified sustainable trip chain",
      rewardEligibility: "Full",
    };
  }

  if (score >= 60) {
    return {
      result: "Partially verified trip",
      rewardEligibility: "Reduced",
    };
  }

  return {
    result: "Unverified trip",
    rewardEligibility: "None",
  };
}

export function classifySustainableTripChain(
  input: ClassifySustainableTripChainInput,
): ClassifierResult {
  const route = resolveRoute(input);
  const trace = input.gpsTrace;
  const accessPoints = input.stationAccessPoints ?? defaultStationAccessPoints;
  const explanation: string[] = [];

  if (!route) {
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
      explanation: [
        "No selected sustainable route was available for verification.",
      ],
    };
  }

  if (trace.length < 8) {
    explanation.push("Trace is too short to verify all trip-chain segments.");
  }

  const firstWindow = trace.slice(0, 3);
  const lastWindow = trace.slice(Math.max(trace.length - 3, 0));
  const firstPoint = trace[0];
  const lastPoint = trace[trace.length - 1];
  const middleWindow = trace.slice(2, Math.max(trace.length - 2, 2));
  const { computedSpeeds, jumpDistances } = getComputedSpeeds(trace);
  const reportedSpeeds = trace
    .map((point) => point.speedKph)
    .filter((speed): speed is number => typeof speed === "number");
  const maxReportedSpeed = Math.max(0, ...reportedSpeeds);
  const maxComputedSpeed = Math.max(0, ...computedSpeeds);
  const maxJumpDistance = Math.max(0, ...jumpDistances);
  const impossibleMovementDetected =
    maxReportedSpeed > 90 ||
    maxComputedSpeed > 120 ||
    jumpDistances.some((distance, index) => {
      const elapsedMinutes = minutesBetween(trace[index], trace[index + 1]);

      return distance > 3 && elapsedMinutes <= 3;
    });
  const routeMatch = hasCorridorShape(trace);
  const firstMileWalking = firstWindow.some(isWalkingLike);
  const lastMileWalking = lastWindow.some(isWalkingLike);
  const walkingSegmentsDetected = firstMileWalking && lastMileWalking;
  const transitLikeMovement = middleWindow.some(
    (point) => point.activity === "in_vehicle" || (point.speedKph ?? 0) >= 12,
  );
  const speedPatternValid =
    !impossibleMovementDetected &&
    firstMileWalking &&
    lastMileWalking &&
    transitLikeMovement &&
    maxReportedSpeed <= 75 &&
    maxComputedSpeed <= 90;
  const startsNearGuadalupe =
    firstPoint && distanceKm(firstPoint, guadalupeAccessPoint) <= 0.8;
  const endsNearCubao =
    lastPoint && distanceKm(lastPoint, cubaoAccessPoint) <= 0.9;
  const hasStationTouch = trace.some((point) =>
    isNearAnyStation(point, accessPoints, 0.65),
  );
  const proximityValid = Boolean(
    startsNearGuadalupe && endsNearCubao && hasStationTouch,
  );
  const stationDwellDetected = trace.some(
    (point) =>
      isNearAnyStation(point, accessPoints, 0.45) &&
      (point.activity === "still" || (point.speedKph ?? 99) <= 2),
  );
  const traceActivities = [
    ...trace.map((point) => point.activity).filter(Boolean),
    ...(input.activityLabels ?? []),
  ];
  const activityRecognitionSupport =
    traceActivities.includes("walking") &&
    traceActivities.includes("in_vehicle") &&
    (traceActivities.includes("still") || traceActivities.includes("unknown"));
  const suspiciousPattern =
    trace.length < 8 ||
    impossibleMovementDetected ||
    !walkingSegmentsDetected ||
    !transitLikeMovement;

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

  if (routeMatch) {
    explanation.push(
      "Trace stays within the Guadalupe to Cubao pilot corridor.",
    );
  } else {
    explanation.push(
      "Trace does not sufficiently match the pilot corridor shape.",
    );
  }

  if (speedPatternValid) {
    explanation.push(
      "Speed pattern supports walking access and transit corridor movement.",
    );
  } else {
    explanation.push("Speed pattern is incomplete or outside MVP thresholds.");
  }

  if (walkingSegmentsDetected) {
    explanation.push(
      "First-mile and last-mile walking-like segments were detected.",
    );
  } else {
    explanation.push(
      "First-mile or last-mile walking-like segment is missing.",
    );
  }

  if (proximityValid) {
    explanation.push(
      "Trace begins and ends near expected station/access areas.",
    );
  } else {
    explanation.push(
      "Station/access proximity is incomplete for the selected route.",
    );
  }

  if (stationDwellDetected) {
    explanation.push(
      "Low-speed dwell near a station/access point supports transfer behavior.",
    );
  } else {
    explanation.push("No clear station dwell or transfer pause was detected.");
  }

  if (activityRecognitionSupport) {
    explanation.push(
      "Phone activity labels support the trip-chain interpretation.",
    );
  } else {
    explanation.push(
      "Phone activity labels are limited or do not support all segments.",
    );
  }

  if (impossibleMovementDetected) {
    explanation.push(
      `Suspicious movement detected: max speed ${Math.round(
        Math.max(maxReportedSpeed, maxComputedSpeed),
      )} kph, max jump ${maxJumpDistance.toFixed(1)} km.`,
    );
  } else {
    explanation.push("No impossible movement was detected by MVP thresholds.");
  }

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

export { defaultStationAccessPoints };
