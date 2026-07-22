import { strict as assert } from "assert";
import { classifySustainableTripChain } from "../packages/shared/src/classifier";
import { demoUserRewardState } from "../packages/shared/src/demo-data";
import { phase0ARouteOptions } from "../packages/shared/src/routes";
import { calculateTripRewards } from "../packages/shared/src/rewards";
import type {
  GpsTracePoint,
  UserRewardState,
} from "../packages/shared/src/types";
import suspiciousTrace from "../data/traces/suspicious_phase_0a_multimodal_trace.json";
import validTrace from "../data/traces/valid_phase_0a_multimodal_trace.json";

const sustainableRoute = phase0ARouteOptions.find(
  (route) => route.type === "sustainable",
);

if (!sustainableRoute) {
  throw new Error("Expected sustainable route fixture");
}

const validClassifierResult = classifySustainableTripChain({
  selectedRoute: sustainableRoute,
  gpsTrace: validTrace as GpsTracePoint[],
});
const suspiciousClassifierResult = classifySustainableTripChain({
  selectedRoute: sustainableRoute,
  gpsTrace: suspiciousTrace as GpsTracePoint[],
});
const validRewards = calculateTripRewards({
  classifierResult: validClassifierResult,
  selectedRoute: sustainableRoute,
  currentUserRewardState: demoUserRewardState,
});
const suspiciousRewards = calculateTripRewards({
  classifierResult: suspiciousClassifierResult,
  selectedRoute: sustainableRoute,
  currentUserRewardState: demoUserRewardState,
});
const nearCapState: UserRewardState = {
  ...demoUserRewardState,
  campaignPoints: 95,
};
const cappedRewards = calculateTripRewards({
  classifierResult: validClassifierResult,
  selectedRoute: sustainableRoute,
  currentUserRewardState: nearCapState,
});

assert.equal(validRewards.lakbayScoreEarned, 120);
assert.equal(validRewards.campaignPointsEarned, 40);
assert.equal(validRewards.updatedLakbayScore, 360);
assert.equal(validRewards.updatedCampaignPoints, 60);
assert.equal(validRewards.campaignCapRemaining, 40);
assert.equal(validRewards.estimatedCo2eAvoidedKg, 0);
assert.equal(suspiciousRewards.lakbayScoreEarned, 0);
assert.equal(suspiciousRewards.campaignPointsEarned, 0);
assert.equal(suspiciousRewards.rewardEligibility, "None");
assert.equal(suspiciousRewards.campaignPoints.capped, false);
assert.equal(cappedRewards.campaignPointsEarned, 5);
assert.equal(cappedRewards.campaignCapRemaining, 0);
assert.equal(cappedRewards.campaignPoints.capped, true);

console.log("Reward check passed");
console.log(
  `Valid rewards: +${validRewards.lakbayScoreEarned} Lakbay Score, +${validRewards.campaignPointsEarned} campaign Points, ${validRewards.campaignCapRemaining} cap remaining`,
);
console.log(
  `Suspicious rewards: +${suspiciousRewards.lakbayScoreEarned} Lakbay Score, +${suspiciousRewards.campaignPointsEarned} campaign Points`,
);
