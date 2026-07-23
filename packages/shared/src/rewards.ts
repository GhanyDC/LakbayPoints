import type {
  CalculateTripRewardsInput,
  RewardEligibility,
  RewardResult,
  UserRewardState,
} from "./types";

function finiteNonNegative(value: number, fallback = 0) {
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function roundedWhole(value: number) {
  return Math.round(finiteNonNegative(value));
}

function roundedDecimal(value: number) {
  return Math.round(finiteNonNegative(value) * 100) / 100;
}

function normalizeRewardState(
  state: UserRewardState,
  requestedCap: number,
): UserRewardState {
  const campaignPointsCap = roundedWhole(requestedCap);

  return {
    userId: state.userId,
    lakbayScore: roundedWhole(state.lakbayScore),
    campaignPoints: Math.min(
      roundedWhole(state.campaignPoints),
      campaignPointsCap,
    ),
    campaignPointsCap,
    verifiedTrips: roundedWhole(state.verifiedTrips),
    estimatedCo2eAvoidedKg: roundedDecimal(state.estimatedCo2eAvoidedKg),
  };
}

function getEffectiveEligibility(
  input: CalculateTripRewardsInput["classifierResult"],
): RewardEligibility {
  if (
    input.result === "Verified sustainable trip chain" &&
    input.rewardEligibility === "Full"
  ) {
    return "Full";
  }
  if (
    input.result === "Partially verified trip" &&
    input.rewardEligibility === "Reduced"
  ) {
    return "Reduced";
  }
  return "None";
}

export function calculateTripRewards({
  classifierResult,
  selectedRoute,
  currentUserRewardState,
  campaignPointsCap = currentUserRewardState.campaignPointsCap,
}: CalculateTripRewardsInput): RewardResult {
  const normalizedState = normalizeRewardState(
    currentUserRewardState,
    campaignPointsCap,
  );
  const fullLakbayScore = roundedWhole(selectedRoute.lakbayScoreReward ?? 0);
  const fullCampaignPoints = roundedWhole(
    selectedRoute.campaignPointsReward ?? 0,
  );
  const effectiveEligibility = getEffectiveEligibility(classifierResult);
  const capRemainingBeforeTrip = Math.max(
    0,
    normalizedState.campaignPointsCap - normalizedState.campaignPoints,
  );
  let lakbayScoreEarned = 0;
  let campaignPointsEarned = 0;
  let estimatedCo2eAvoidedKg = 0;
  let rewardMessage = "No reward - trip was not verified.";

  if (classifierResult.result === "Suspicious pattern") {
    rewardMessage = "No reward - suspicious movement detected.";
  } else if (effectiveEligibility === "Full") {
    lakbayScoreEarned = fullLakbayScore;
    campaignPointsEarned = Math.min(fullCampaignPoints, capRemainingBeforeTrip);
    if (
      selectedRoute.co2eMethodologyStatus !== "pending_confirmation" &&
      selectedRoute.estimatedCo2eAvoidedKg !== null
    ) {
      estimatedCo2eAvoidedKg = roundedDecimal(
        selectedRoute.estimatedCo2eAvoidedKg,
      );
    }
    rewardMessage =
      campaignPointsEarned < fullCampaignPoints
        ? "Verified sustainable trip chain. Campaign Points were limited by the campaign cap."
        : "Full reward earned for a verified sustainable trip chain.";
  } else if (effectiveEligibility === "Reduced") {
    lakbayScoreEarned = Math.round(fullLakbayScore * 0.5);
    rewardMessage =
      "Reduced Lakbay Score earned. Campaign Points require full verification.";
  }

  const updatedLakbayScore = roundedWhole(
    normalizedState.lakbayScore + lakbayScoreEarned,
  );
  const updatedCampaignPoints = Math.min(
    normalizedState.campaignPointsCap,
    roundedWhole(normalizedState.campaignPoints + campaignPointsEarned),
  );
  const campaignCapRemaining = Math.max(
    0,
    normalizedState.campaignPointsCap - updatedCampaignPoints,
  );
  const updatedUserRewardState: UserRewardState = {
    ...normalizedState,
    lakbayScore: updatedLakbayScore,
    campaignPoints: updatedCampaignPoints,
    verifiedTrips:
      effectiveEligibility === "Full"
        ? normalizedState.verifiedTrips + 1
        : normalizedState.verifiedTrips,
    estimatedCo2eAvoidedKg: roundedDecimal(
      normalizedState.estimatedCo2eAvoidedKg + estimatedCo2eAvoidedKg,
    ),
  };

  return {
    rewardEligibility: effectiveEligibility,
    lakbayScoreEarned,
    campaignPointsEarned,
    updatedLakbayScore,
    updatedCampaignPoints,
    campaignPointsCap: normalizedState.campaignPointsCap,
    campaignCapRemaining,
    estimatedCo2eAvoidedKg,
    rewardMessage,
    lakbayScore: {
      earned: lakbayScoreEarned,
      updatedTotal: updatedLakbayScore,
      nonCash: true,
    },
    campaignPoints: {
      earned: campaignPointsEarned,
      updatedTotal: updatedCampaignPoints,
      cap: normalizedState.campaignPointsCap,
      capRemaining: campaignCapRemaining,
      capped:
        effectiveEligibility === "Full" &&
        fullCampaignPoints > campaignPointsEarned,
    },
    updatedUserRewardState,
  };
}
