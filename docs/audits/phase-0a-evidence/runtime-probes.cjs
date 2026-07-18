/*
 * Phase 0A audit probe.
 *
 * Prerequisite: run `npm run check:classifier` from the repository root so
 * `.check-output` contains the compiled CommonJS shared modules.
 */

const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const compiledShared = path.join(root, ".check-output/packages/shared/src");

const { classifySustainableTripChain } = require(
  path.join(compiledShared, "classifier.js"),
);
const { demoUserRewardState } = require(
  path.join(compiledShared, "demo-data.js"),
);
const { calculateTripRewards } = require(
  path.join(compiledShared, "rewards.js"),
);
const { guadalupeCubaoRoutes } = require(
  path.join(compiledShared, "routes.js"),
);
const {
  suspiciousTraceRejected,
  validSustainableGuadalupeCubaoTrace,
} = require(path.join(compiledShared, "traces.js"));

const jsonRoutes = require(path.join(
  root,
  "data/routes/guadalupe-cubao-routes.json",
));
const jsonValidTrace = require(path.join(
  root,
  "data/traces/valid_sustainable_guadalupe_cubao.json",
));
const jsonSuspiciousTrace = require(path.join(
  root,
  "data/traces/suspicious_trace_rejected.json",
));

const sustainableRoute = guadalupeCubaoRoutes.find(
  (route) => route.type === "sustainable",
);

if (!sustainableRoute) {
  throw new Error("Sustainable route fixture is missing");
}

const toRadians = (value) => (value * Math.PI) / 180;

function distanceKm(a, b) {
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

function traceMetrics(trace) {
  return {
    points: trace.length,
    start: [trace[0].latitude, trace[0].longitude],
    end: [trace.at(-1).latitude, trace.at(-1).longitude],
    durationMin:
      (Date.parse(trace.at(-1).timestamp) - Date.parse(trace[0].timestamp)) /
      60000,
    approximateDistanceKm: Number(
      trace
        .slice(1)
        .reduce((sum, point, index) => sum + distanceKm(trace[index], point), 0)
        .toFixed(3),
    ),
    maxRecordedSpeedKph: Math.max(...trace.map((point) => point.speedKph ?? 0)),
    activities: [...new Set(trace.map((point) => point.activity))],
  };
}

function relativeLuminance(hexColor) {
  const channels = hexColor
    .slice(1)
    .match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4,
    );

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

const validResult = classifySustainableTripChain({
  selectedRoute: sustainableRoute,
  gpsTrace: validSustainableGuadalupeCubaoTrace,
});
const suspiciousResult = classifySustainableTripChain({
  selectedRoute: sustainableRoute,
  gpsTrace: suspiciousTraceRejected,
});
const validReward = calculateTripRewards({
  classifierResult: validResult,
  selectedRoute: sustainableRoute,
  currentUserRewardState: demoUserRewardState,
});
const suspiciousReward = calculateTripRewards({
  classifierResult: suspiciousResult,
  selectedRoute: sustainableRoute,
  currentUserRewardState: demoUserRewardState,
});
const reducedReward = calculateTripRewards({
  classifierResult: {
    ...validResult,
    confidenceScore: 70,
    result: "Partially verified trip",
    rewardEligibility: "Reduced",
  },
  selectedRoute: sustainableRoute,
  currentUserRewardState: demoUserRewardState,
});
const invalidTimestampTrace = validSustainableGuadalupeCubaoTrace.map(
  (point) => ({
    ...point,
    timestamp: "not-a-date",
  }),
);
const invalidTimestampResult = classifySustainableTripChain({
  selectedRoute: sustainableRoute,
  gpsTrace: invalidTimestampTrace,
});
const invalidTimestampReward = calculateTripRewards({
  classifierResult: invalidTimestampResult,
  selectedRoute: sustainableRoute,
  currentUserRewardState: demoUserRewardState,
});
const unknownRouteResult = classifySustainableTripChain({
  selectedRoute: "does-not-exist",
  gpsTrace: validSustainableGuadalupeCubaoTrace,
});
const privateRouteResult = classifySustainableTripChain({
  selectedRoute: guadalupeCubaoRoutes[0],
  gpsTrace: validSustainableGuadalupeCubaoTrace,
});
const emptyTraceResult = classifySustainableTripChain({
  selectedRoute: sustainableRoute,
  gpsTrace: [],
});
const aboveCapReward = calculateTripRewards({
  classifierResult: validResult,
  selectedRoute: sustainableRoute,
  currentUserRewardState: {
    ...demoUserRewardState,
    campaignPoints: 150,
  },
});
const negativeRouteReward = calculateTripRewards({
  classifierResult: validResult,
  selectedRoute: {
    ...sustainableRoute,
    lakbayScoreReward: -120,
    campaignPointsReward: -40,
  },
  currentUserRewardState: demoUserRewardState,
});

let malformedNullPointError = null;

try {
  classifySustainableTripChain({
    selectedRoute: sustainableRoute,
    gpsTrace: [null, null, null, null, null, null, null, null],
  });
} catch (error) {
  malformedNullPointError = `${error.name}: ${error.message}`;
}

const output = {
  contrastRatios: {
    tealOnWhite: contrastRatio("#0f766e", "#ffffff"),
    whiteOnTeal: contrastRatio("#ffffff", "#0f766e"),
    slateOnWhite: contrastRatio("#475569", "#ffffff"),
    mutedSlateOnLight: contrastRatio("#64748b", "#f8fafc"),
    placeholderOnWhite: contrastRatio("#94a3b8", "#ffffff"),
    amberOnAmberLight: contrastRatio("#92400e", "#fef3c7"),
    blueOnBlueLight: contrastRatio("#1e3a8a", "#dbeafe"),
  },
  fixtureConsistency: {
    routes:
      JSON.stringify(guadalupeCubaoRoutes) === JSON.stringify(jsonRoutes),
    validTrace:
      JSON.stringify(validSustainableGuadalupeCubaoTrace) ===
      JSON.stringify(jsonValidTrace),
    suspiciousTrace:
      JSON.stringify(suspiciousTraceRejected) ===
      JSON.stringify(jsonSuspiciousTrace),
  },
  validTrace: {
    metrics: traceMetrics(validSustainableGuadalupeCubaoTrace),
    result: validResult,
    reward: validReward,
  },
  suspiciousTrace: {
    metrics: traceMetrics(suspiciousTraceRejected),
    result: suspiciousResult,
    reward: suspiciousReward,
  },
  boundaryProbes: {
    deterministic:
      JSON.stringify(validResult) ===
      JSON.stringify(
        classifySustainableTripChain({
          selectedRoute: sustainableRoute,
          gpsTrace: validSustainableGuadalupeCubaoTrace,
        }),
      ),
    emptyTraceResult,
    invalidTimestampResult,
    invalidTimestampReward: {
      lakbayScoreEarned: invalidTimestampReward.lakbayScoreEarned,
      campaignPointsEarned: invalidTimestampReward.campaignPointsEarned,
    },
    unknownRouteResult: {
      confidenceScore: unknownRouteResult.confidenceScore,
      result: unknownRouteResult.result,
      rewardEligibility: unknownRouteResult.rewardEligibility,
    },
    privateRouteResult: {
      confidenceScore: privateRouteResult.confidenceScore,
      result: privateRouteResult.result,
      rewardEligibility: privateRouteResult.rewardEligibility,
    },
    malformedNullPointError,
    reducedReward: {
      lakbayScoreEarned: reducedReward.lakbayScoreEarned,
      campaignPointsEarned: reducedReward.campaignPointsEarned,
      estimatedCo2eAvoidedKg: reducedReward.estimatedCo2eAvoidedKg,
      verifiedTrips: reducedReward.updatedUserRewardState.verifiedTrips,
      rewardMessage: reducedReward.rewardMessage,
    },
    repeatedCalculationStable:
      JSON.stringify(validReward) ===
        JSON.stringify(
          calculateTripRewards({
            classifierResult: validResult,
            selectedRoute: sustainableRoute,
            currentUserRewardState: demoUserRewardState,
          }),
        ) && demoUserRewardState.campaignPoints === 20,
    aboveCapReward: {
      updatedCampaignPoints: aboveCapReward.updatedCampaignPoints,
      campaignPointsCap: aboveCapReward.campaignPointsCap,
      campaignCapRemaining: aboveCapReward.campaignCapRemaining,
    },
    negativeRouteReward: {
      lakbayScoreEarned: negativeRouteReward.lakbayScoreEarned,
      campaignPointsEarned: negativeRouteReward.campaignPointsEarned,
      updatedCampaignPoints: negativeRouteReward.updatedCampaignPoints,
    },
  },
};

console.log(JSON.stringify(output, null, 2));
