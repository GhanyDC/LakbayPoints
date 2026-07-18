import type {
  CalculateTripRewardsInput,
  RewardResult,
  UserRewardState,
} from "./types";

function getCampaignCapRemaining(points: number, cap: number) {
  return Math.max(0, cap - points);
}

function buildUpdatedRewardState(
  currentUserRewardState: UserRewardState,
  lakbayScoreEarned: number,
  campaignPointsEarned: number,
  estimatedCo2eAvoidedKg: number,
): UserRewardState {
  return {
    ...currentUserRewardState,
    lakbayScore: currentUserRewardState.lakbayScore + lakbayScoreEarned,
    campaignPoints:
      currentUserRewardState.campaignPoints + campaignPointsEarned,
    verifiedTrips:
      lakbayScoreEarned > 0
        ? currentUserRewardState.verifiedTrips + 1
        : currentUserRewardState.verifiedTrips,
    estimatedCo2eAvoidedKg:
      currentUserRewardState.estimatedCo2eAvoidedKg + estimatedCo2eAvoidedKg,
  };
}

export function calculateTripRewards({
  classifierResult,
  selectedRoute,
  currentUserRewardState,
  campaignPointsCap = currentUserRewardState.campaignPointsCap,
}: CalculateTripRewardsInput): RewardResult {
  const fullLakbayScore = selectedRoute.lakbayScoreReward ?? 0;
  const fullCampaignPoints = selectedRoute.campaignPointsReward ?? 0;
  const capRemainingBeforeTrip = getCampaignCapRemaining(
    currentUserRewardState.campaignPoints,
    campaignPointsCap,
  );
  let lakbayScoreEarned = 0;
  let campaignPointsEarned = 0;
  let estimatedCo2eAvoidedKg = 0;
  let rewardMessage = "No reward - trip was not verified.";

  if (classifierResult.result === "Suspicious pattern") {
    rewardMessage = "No reward - suspicious movement detected.";
  } else if (classifierResult.rewardEligibility === "Full") {
    lakbayScoreEarned = fullLakbayScore;
    campaignPointsEarned = Math.min(fullCampaignPoints, capRemainingBeforeTrip);
    estimatedCo2eAvoidedKg = selectedRoute.estimatedCo2eAvoidedKg ?? 0;
    rewardMessage =
      campaignPointsEarned < fullCampaignPoints
        ? "Verified sustainable trip chain. campaign Points were limited by the campaign cap."
        : "Full reward earned for a verified sustainable trip chain.";
  } else if (classifierResult.rewardEligibility === "Reduced") {
    lakbayScoreEarned = Math.round(fullLakbayScore * 0.5);
    campaignPointsEarned = 0;
    estimatedCo2eAvoidedKg = selectedRoute.estimatedCo2eAvoidedKg ?? 0;
    rewardMessage =
      "Reduced Lakbay Score earned. Campaign points require full verification.";
  }

  const updatedUserRewardState = buildUpdatedRewardState(
    {
      ...currentUserRewardState,
      campaignPointsCap,
    },
    lakbayScoreEarned,
    campaignPointsEarned,
    estimatedCo2eAvoidedKg,
  );
  const campaignCapRemaining = getCampaignCapRemaining(
    updatedUserRewardState.campaignPoints,
    campaignPointsCap,
  );

  return {
    rewardEligibility: classifierResult.rewardEligibility,
    lakbayScoreEarned,
    campaignPointsEarned,
    updatedLakbayScore: updatedUserRewardState.lakbayScore,
    updatedCampaignPoints: updatedUserRewardState.campaignPoints,
    campaignPointsCap,
    campaignCapRemaining,
    estimatedCo2eAvoidedKg,
    rewardMessage,
    lakbayScore: {
      earned: lakbayScoreEarned,
      updatedTotal: updatedUserRewardState.lakbayScore,
      nonCash: true,
    },
    campaignPoints: {
      earned: campaignPointsEarned,
      updatedTotal: updatedUserRewardState.campaignPoints,
      cap: campaignPointsCap,
      capRemaining: campaignCapRemaining,
      capped:
        classifierResult.rewardEligibility === "Full" &&
        campaignPointsEarned < fullCampaignPoints &&
        fullCampaignPoints > 0,
    },
    updatedUserRewardState,
  };
}
