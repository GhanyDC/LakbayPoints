# Data Model

This MVP uses simple TypeScript-friendly objects and seeded data.

## RouteOption

```ts
type RouteOption = {
  id: string;
  name: string;
  type: "private_baseline" | "sustainable" | "phase2_preview";
  origin: string;
  destination: string;
  segments: RouteSegment[];
  estimatedTimeMin: number;
  estimatedCostPhp: number;
  accessScore: "Poor" | "Fair" | "Good" | "Excellent";
  estimatedCo2eAvoidedKg?: number;
  lakbayScoreReward?: number;
  campaignPointsReward?: number;
  notes?: string[];
};
```

## RouteSegment

```ts
type RouteSegment = {
  id: string;
  mode: "walk" | "mrt" | "bus" | "jeepney" | "ferry" | "bike" | "ebike" | "private_vehicle";
  label: string;
  startName: string;
  endName: string;
  distanceKm: number;
  estimatedTimeMin: number;
  polyline?: [number, number][];
};
```

## GpsTracePoint

```ts
type GpsTracePoint = {
  timestamp: string;
  latitude: number;
  longitude: number;
  speedKph?: number;
  activity?: "walking" | "still" | "in_vehicle" | "unknown";
};
```

## ClassifierResult

```ts
type ClassifierResult = {
  confidenceScore: number;
  result:
    | "Verified sustainable trip chain"
    | "Partially verified trip"
    | "Unverified trip"
    | "Suspicious pattern";
  rewardEligibility: "Full" | "Reduced" | "None";
  signals: {
    routeMatch: boolean;
    speedPatternValid: boolean;
    walkingSegmentsDetected: boolean;
    stationDwellDetected: boolean;
    proximityValid: boolean;
    impossibleMovementDetected: boolean;
    suspiciousPattern: boolean;
    activityRecognitionSupport?: boolean;
  };
  explanation: string[];
};
```

## UserRewardState

```ts
type UserRewardState = {
  userId: string;
  lakbayScore: number;
  campaignPoints: number;
  campaignPointsCap: number;
  verifiedTrips: number;
  estimatedCo2eAvoidedKg: number;
};
```

## RewardResult

Lakbay Score is a non-cash progress meter. Lakbay Points are capped, campaign-based incentives for verified sustainable trip chains.

```ts
type LakbayScoreReward = {
  earned: number;
  updatedTotal: number;
  nonCash: true;
};

type CampaignPointsReward = {
  earned: number;
  updatedTotal: number;
  cap: number;
  capRemaining: number;
  capped: boolean;
};

type RewardResult = {
  rewardEligibility: "Full" | "Reduced" | "None";
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
```

## AccessBarrierReport

```ts
type AccessBarrierReport = {
  id: string;
  category:
    | "sidewalk_obstruction"
    | "unsafe_crossing"
    | "flooding"
    | "illegal_parking_or_loading_obstruction"
    | "damaged_walkway_or_access_path";
  severity: "Low" | "Medium" | "High";
  description: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  status: "Submitted" | "Under Review" | "Verified" | "Assigned" | "Resolved";
  createdAt: string;
};
```

## DashboardMetric

```ts
type DashboardMetric = {
  verifiedSustainableTrips: number;
  accessBarrierReports: number;
  reportsUnderReview: number;
  estimatedCo2eAvoidedKg: number;
  campaignPointsIssued: number;
  repeatTripUsers: number;
};
```
