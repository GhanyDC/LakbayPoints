export type LakbayPointsModuleStatus = {
  module: string;
  implemented: boolean;
};

export type AccessScore = "Poor" | "Fair" | "Good" | "Excellent";

export type TransportMode =
  | "walk"
  | "mrt"
  | "bus"
  | "jeepney"
  | "public_road_transport"
  | "ferry"
  | "bike"
  | "ebike"
  | "private_vehicle";

export type RouteOptionType =
  "private_baseline" | "sustainable" | "phase2_preview";

export type DataStatus =
  | "prototype_estimate"
  | "official_reference"
  | "pending_confirmation"
  | "not_applicable";

export type RouteRecommendationStatus =
  "recommended" | "comparison_only" | "future_preview";

export type RouteRewardEligibility = "verification_required" | "ineligible";

export type RouteAccessPointKind =
  | "home_access_zone"
  | "mrt_station"
  | "ferry_station"
  | "demo_destination"
  | "concept_transfer";

export type RouteAccessPoint = {
  id: string;
  label: string;
  kind: RouteAccessPointKind;
};

export type RouteSegment = {
  id: string;
  mode: TransportMode;
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

export type RouteTotals = {
  travelTimeMin: number | null;
  waitDwellTimeMin: number | null;
  totalTimeMin: number | null;
  distanceKm: number | null;
  knownFarePhp: number;
  hasPendingFare: boolean;
};

export type RouteOption = {
  id: string;
  name: string;
  type: RouteOptionType;
  recommendationStatus: RouteRecommendationStatus;
  dataStatus: DataStatus;
  dataStatusLabel: string;
  dataVersion: string;
  lastReviewedDate: string;
  disclaimer: string;
  originAccessPointId: string;
  destinationAccessPointId: string;
  accessPoints: RouteAccessPoint[];
  segments: RouteSegment[];
  accessScore: AccessScore;
  rewardEligibility: RouteRewardEligibility;
  estimatedCo2eAvoidedKg: number | null;
  co2eMethodologyStatus: DataStatus;
  co2eDisplay: string;
  lakbayScoreReward?: number;
  campaignPointsReward?: number;
  notes?: string[];
  phaseLabel?: string;
  futureIntegrationNote?: string;
};

export type GpsTraceActivity = "walking" | "still" | "in_vehicle" | "unknown";

export type GpsTracePoint = {
  timestamp: string;
  latitude: number;
  longitude: number;
  speedKph?: number;
  activity?: GpsTraceActivity;
};

export type RewardEligibility = "Full" | "Reduced" | "None";

export type VerificationResultLabel =
  | "Verified sustainable trip chain"
  | "Partially verified trip"
  | "Unverified trip"
  | "Suspicious pattern";

export type ClassifierSignalChecklist = {
  routeMatch: boolean;
  speedPatternValid: boolean;
  walkingSegmentsDetected: boolean;
  stationDwellDetected: boolean;
  proximityValid: boolean;
  impossibleMovementDetected: boolean;
  suspiciousPattern: boolean;
  activityRecognitionSupport?: boolean;
};

export type ClassifierResult = {
  confidenceScore: number;
  result: VerificationResultLabel;
  rewardEligibility: RewardEligibility;
  signals: ClassifierSignalChecklist;
  explanation: string[];
};

export type StationAccessPoint = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export type ClassifySustainableTripChainInput = {
  selectedRoute: RouteOption | string;
  gpsTrace: GpsTracePoint[];
  expectedRoute?: RouteOption;
  routeOptions?: RouteOption[];
  stationAccessPoints?: StationAccessPoint[];
  activityLabels?: GpsTraceActivity[];
};

export type UserRewardState = {
  userId: string;
  lakbayScore: number;
  campaignPoints: number;
  campaignPointsCap: number;
  verifiedTrips: number;
  estimatedCo2eAvoidedKg: number;
};

export type LakbayScoreReward = {
  earned: number;
  updatedTotal: number;
  nonCash: true;
};

export type CampaignPointsReward = {
  earned: number;
  updatedTotal: number;
  cap: number;
  capRemaining: number;
  capped: boolean;
};

export type RewardResult = {
  rewardEligibility: RewardEligibility;
  lakbayScoreEarned: number;
  campaignPointsEarned: number;
  updatedLakbayScore: number;
  updatedCampaignPoints: number;
  campaignPointsCap: number;
  campaignCapRemaining: number;
  estimatedCo2eAvoidedKg: number;
  rewardMessage: string;
  lakbayScore: LakbayScoreReward;
  campaignPoints: CampaignPointsReward;
  updatedUserRewardState: UserRewardState;
};

export type CalculateTripRewardsInput = {
  classifierResult: ClassifierResult;
  selectedRoute: RouteOption;
  currentUserRewardState: UserRewardState;
  campaignPointsCap?: number;
};

export type AccessBarrierCategory =
  | "sidewalk_obstruction"
  | "unsafe_crossing"
  | "flooding"
  | "illegal_parking_or_loading_obstruction"
  | "damaged_walkway_or_access_path";

export type ReportSeverity = "Low" | "Medium" | "High";

export type ReportStatus =
  "Submitted" | "Under Review" | "Verified" | "Assigned" | "Resolved";

export type AccessBarrierReport = {
  id: string;
  category: AccessBarrierCategory;
  severity: ReportSeverity;
  description: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  status: ReportStatus;
  createdAt: string;
};
