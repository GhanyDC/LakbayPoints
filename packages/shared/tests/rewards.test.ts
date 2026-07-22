import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateTripRewards,
  classifySustainableTripChain,
  demoUserRewardState,
  phase0APilotRoute,
  suspiciousPhase0AMultimodalTrace,
  validPhase0AMultimodalTrace,
  type ClassifierResult,
  type RouteOption,
  type UserRewardState,
} from "../src/index";

const fullResult = classifySustainableTripChain({
  selectedRoute: phase0APilotRoute,
  gpsTrace: validPhase0AMultimodalTrace,
});
const suspiciousResult = classifySustainableTripChain({
  selectedRoute: phase0APilotRoute,
  gpsTrace: suspiciousPhase0AMultimodalTrace,
});
const reducedResult: ClassifierResult = {
  ...fullResult,
  confidenceScore: 70,
  result: "Partially verified trip",
  rewardEligibility: "Reduced",
};
const unverifiedResult: ClassifierResult = {
  ...fullResult,
  confidenceScore: 20,
  result: "Unverified trip",
  rewardEligibility: "None",
};

function calculate(
  classifierResult: ClassifierResult,
  state: UserRewardState = demoUserRewardState,
  route: RouteOption = phase0APilotRoute,
  cap?: number,
) {
  return calculateTripRewards({
    classifierResult,
    selectedRoute: route,
    currentUserRewardState: state,
    campaignPointsCap: cap,
  });
}

test("Full verification earns approved rewards and increments the full-trip count", () => {
  const reward = calculate(fullResult);

  assert.equal(reward.rewardEligibility, "Full");
  assert.equal(reward.lakbayScoreEarned, 120);
  assert.equal(reward.campaignPointsEarned, 40);
  assert.equal(reward.updatedLakbayScore, 360);
  assert.equal(reward.updatedCampaignPoints, 60);
  assert.equal(reward.updatedUserRewardState.verifiedTrips, 3);
});

test("Reduced verification earns half Lakbay Score and no campaign Points", () => {
  const reward = calculate(reducedResult);

  assert.equal(reward.rewardEligibility, "Reduced");
  assert.equal(reward.lakbayScoreEarned, 60);
  assert.equal(reward.campaignPointsEarned, 0);
  assert.equal(reward.updatedUserRewardState.verifiedTrips, 2);
  assert.equal(reward.estimatedCo2eAvoidedKg, 0);
});

test("Unverified and Suspicious results always earn zero", () => {
  for (const classifierResult of [unverifiedResult, suspiciousResult]) {
    const reward = calculate(classifierResult);
    assert.equal(reward.rewardEligibility, "None");
    assert.equal(reward.lakbayScoreEarned, 0);
    assert.equal(reward.campaignPointsEarned, 0);
    assert.equal(reward.estimatedCo2eAvoidedKg, 0);
    assert.equal(reward.updatedUserRewardState.verifiedTrips, 2);
  }
});

test("near-cap reward is limited to remaining capacity", () => {
  const reward = calculate(fullResult, {
    ...demoUserRewardState,
    campaignPoints: 95,
  });

  assert.equal(reward.campaignPointsEarned, 5);
  assert.equal(reward.updatedCampaignPoints, 100);
  assert.equal(reward.campaignCapRemaining, 0);
  assert.equal(reward.campaignPoints.capped, true);
});

test("at-cap reward earns no additional campaign Points", () => {
  const reward = calculate(fullResult, {
    ...demoUserRewardState,
    campaignPoints: 100,
  });

  assert.equal(reward.campaignPointsEarned, 0);
  assert.equal(reward.updatedCampaignPoints, 100);
  assert.equal(reward.campaignCapRemaining, 0);
});

test("over-cap input is normalized to the cap", () => {
  const reward = calculate(fullResult, {
    ...demoUserRewardState,
    campaignPoints: 150,
  });

  assert.equal(reward.campaignPointsEarned, 0);
  assert.equal(reward.updatedCampaignPoints, 100);
  assert.ok(reward.updatedCampaignPoints <= reward.campaignPointsCap);
});

test("negative state is normalized without negative balances", () => {
  const reward = calculate(fullResult, {
    ...demoUserRewardState,
    lakbayScore: -20,
    campaignPoints: -40,
    campaignPointsCap: -100,
    verifiedTrips: -2,
    estimatedCo2eAvoidedKg: -5,
  });

  assert.equal(reward.updatedLakbayScore, 120);
  assert.equal(reward.updatedCampaignPoints, 0);
  assert.equal(reward.campaignPointsCap, 0);
  assert.equal(reward.updatedUserRewardState.verifiedTrips, 1);
  assert.equal(reward.updatedUserRewardState.estimatedCo2eAvoidedKg, 0);
});

test("negative route rewards normalize to zero", () => {
  const route: RouteOption = {
    ...phase0APilotRoute,
    lakbayScoreReward: -120,
    campaignPointsReward: -40,
  };
  const reward = calculate(fullResult, demoUserRewardState, route);

  assert.equal(reward.lakbayScoreEarned, 0);
  assert.equal(reward.campaignPointsEarned, 0);
  assert.equal(reward.updatedLakbayScore, demoUserRewardState.lakbayScore);
  assert.equal(
    reward.updatedCampaignPoints,
    demoUserRewardState.campaignPoints,
  );
});

test("non-finite reward inputs produce finite non-negative outputs", () => {
  const route: RouteOption = {
    ...phase0APilotRoute,
    lakbayScoreReward: Number.NaN,
    campaignPointsReward: Number.POSITIVE_INFINITY,
    estimatedCo2eAvoidedKg: Number.POSITIVE_INFINITY,
    co2eMethodologyStatus: "prototype_estimate",
  };
  const state: UserRewardState = {
    ...demoUserRewardState,
    lakbayScore: Number.NaN,
    campaignPoints: Number.POSITIVE_INFINITY,
    campaignPointsCap: Number.POSITIVE_INFINITY,
    verifiedTrips: Number.NaN,
    estimatedCo2eAvoidedKg: Number.NEGATIVE_INFINITY,
  };
  const reward = calculate(fullResult, state, route);

  for (const value of [
    reward.lakbayScoreEarned,
    reward.campaignPointsEarned,
    reward.updatedLakbayScore,
    reward.updatedCampaignPoints,
    reward.campaignPointsCap,
    reward.campaignCapRemaining,
    reward.estimatedCo2eAvoidedKg,
  ]) {
    assert.equal(Number.isFinite(value), true);
    assert.ok(value >= 0);
  }
  assert.ok(reward.updatedCampaignPoints <= reward.campaignPointsCap);
});

test("calculation is pure and repeated calls do not duplicate mutation", () => {
  const state = { ...demoUserRewardState };
  const before = { ...state };
  const first = calculate(fullResult, state);
  const second = calculate(fullResult, state);

  assert.deepEqual(state, before);
  assert.deepEqual(second, first);
});

test("pending CO2e remains zero and calibrated totals are rounded", () => {
  const pending = calculate(fullResult);
  assert.equal(pending.estimatedCo2eAvoidedKg, 0);
  assert.equal(
    pending.updatedUserRewardState.estimatedCo2eAvoidedKg,
    demoUserRewardState.estimatedCo2eAvoidedKg,
  );

  const calibratedRoute: RouteOption = {
    ...phase0APilotRoute,
    estimatedCo2eAvoidedKg: 2.345,
    co2eMethodologyStatus: "prototype_estimate",
  };
  const calibrated = calculate(
    fullResult,
    demoUserRewardState,
    calibratedRoute,
  );
  assert.equal(calibrated.estimatedCo2eAvoidedKg, 2.35);
  assert.equal(calibrated.updatedUserRewardState.estimatedCo2eAvoidedKg, 7.95);
});

test("only Full verification increments the fully verified trip count", () => {
  assert.equal(calculate(fullResult).updatedUserRewardState.verifiedTrips, 3);
  assert.equal(
    calculate(reducedResult).updatedUserRewardState.verifiedTrips,
    2,
  );
  assert.equal(
    calculate(unverifiedResult).updatedUserRewardState.verifiedTrips,
    2,
  );
  assert.equal(
    calculate(suspiciousResult).updatedUserRewardState.verifiedTrips,
    2,
  );
});
