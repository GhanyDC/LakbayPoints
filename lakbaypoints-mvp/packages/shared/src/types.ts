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
  | "ferry"
  | "bike"
  | "ebike"
  | "private_vehicle";

export type RouteOptionType =
  "private_baseline" | "sustainable" | "phase2_preview";

export type TrafficCondition = "Light" | "Moderate" | "Heavy";

export type RouteSegment = {
  id: string;
  mode: TransportMode;
  label: string;
  startName: string;
  endName: string;
  distanceKm: number;
  estimatedTimeMin: number;
  polyline?: [number, number][];
};

export type RouteOption = {
  id: string;
  name: string;
  type: RouteOptionType;
  origin: string;
  destination: string;
  segments: RouteSegment[];
  estimatedTimeMin: number;
  estimatedCostPhp: number;
  accessScore: AccessScore;
  estimatedCo2eAvoidedKg?: number;
  lakbayScoreReward?: number;
  campaignPointsReward?: number;
  notes?: string[];
  tripChainLabel?: string;
  trafficCondition?: TrafficCondition;
  co2eBaselineKg?: number;
  phaseLabel?: string;
  futureIntegrationNote?: string;
};
