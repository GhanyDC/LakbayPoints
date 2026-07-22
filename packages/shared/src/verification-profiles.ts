import type { RouteVerificationProfile } from "./types";

export const phase0AMultimodalVerificationProfile: RouteVerificationProfile = {
  routeId: "phase-0a-multimodal-pilot-route",
  eligibleRouteType: "sustainable",
  orderedSegmentModes: [
    "public_road_transport",
    "mrt",
    "walk",
    "ferry",
    "walk",
  ],
  expectedStartAccessZone: {
    accessPointId: "cubao-home-access-zone",
    latitude: 14.6375,
    longitude: 121.0315,
  },
  expectedEndAccessZone: {
    accessPointId: "hulo-office-demo-destination",
    latitude: 14.579,
    longitude: 121.027,
  },
  expectedTransferAccessLocations: [
    {
      accessPointId: "mrt3-araneta-cubao",
      latitude: 14.6196,
      longitude: 121.051,
    },
    {
      accessPointId: "mrt3-guadalupe",
      latitude: 14.5664,
      longitude: 121.0455,
    },
    {
      accessPointId: "guadalupe-ferry",
      latitude: 14.5617,
      longitude: 121.0372,
    },
    {
      accessPointId: "hulo-ferry",
      latitude: 14.571,
      longitude: 121.021,
    },
  ],
  proximityThresholds: {
    startKm: 0.45,
    endKm: 0.45,
    transferKm: 0.35,
  },
  allowedMovementSpeedRanges: {
    walking: { minKph: 0.5, maxKph: 7 },
    publicRoadTransport: { minKph: 5, maxKph: 60 },
    mrt: { minKph: 8, maxKph: 90 },
    ferry: { minKph: 4, maxKph: 45 },
  },
  minimumTracePointCount: 20,
  chronologyRequirements: {
    validIsoCompatibleTimestamps: true,
    strictlyIncreasing: true,
  },
  dwellRequirements: [
    { accessPointId: "mrt3-araneta-cubao", minimumMinutes: 3 },
    { accessPointId: "mrt3-guadalupe", minimumMinutes: 3 },
    { accessPointId: "guadalupe-ferry", minimumMinutes: 5 },
  ],
  walkingRequirements: [
    {
      segmentId: "walk-guadalupe-mrt-to-ferry",
      minimumSupportingPoints: 3,
      minimumPositionChangeKm: 0.12,
    },
    {
      segmentId: "walk-hulo-ferry-to-office",
      minimumSupportingPoints: 3,
      minimumPositionChangeKm: 0.12,
    },
  ],
  impossibleMovementThresholds: {
    reportedSpeedKph: 100,
    computedSpeedKph: 120,
    teleportDistanceKm: 3,
    teleportMaximumMinutes: 3,
  },
};

export const routeVerificationProfiles: Readonly<
  Record<string, RouteVerificationProfile>
> = {
  [phase0AMultimodalVerificationProfile.routeId]:
    phase0AMultimodalVerificationProfile,
};

export function getRouteVerificationProfile(
  routeId: string,
): RouteVerificationProfile | undefined {
  return routeVerificationProfiles[routeId];
}
