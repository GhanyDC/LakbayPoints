import {
  DASHBOARD_REPORT_CATEGORY_LABELS,
  PHASE_0B_DASHBOARD_DISCLOSURE,
  PHASE_0B_DASHBOARD_SUBTITLE,
  PHASE_0B_DASHBOARD_TITLE,
  deriveCampaignAllocation,
  deriveCampaignUtilization,
  deriveRepeatParticipantRate,
  deriveVerifiedTripRate,
} from "./dashboard-analytics";
import { phase0APilotRoute } from "./routes";
import type {
  CampaignSummary,
  DashboardAccessBarrierReport,
  DashboardReportLocation,
  DashboardSeedData,
  PilotParticipantSummary,
  PilotTripSummary,
  TripChainInsight,
} from "./dashboard-types";
import type {
  AccessBarrierCategory,
  ReportSeverity,
  ReportStatus,
} from "./types";

export const PHASE_0B_DASHBOARD_SEED_VERSION =
  "phase-0b-dashboard-seed-2026-07-23";
export const PHASE_0B_NARRATED_REPORT_ID =
  "phase-0b-report-araneta-unsafe-crossing-001";

const participantSummary: PilotParticipantSummary = {
  totalParticipants: 120,
  repeatParticipants: 84,
  repeatParticipantDefinition:
    "A participant with at least two fully verified qualifying pilot-route trips during the simulated campaign window.",
  repeatParticipantRatePercent: deriveRepeatParticipantRate(84, 120),
  dataStatus: "deterministic_simulated",
};

const tripSummary: PilotTripSummary = {
  routeId: phase0APilotRoute.id,
  totalAttempts: 360,
  verification: {
    fullyVerified: 288,
    partiallyVerified: 36,
    suspiciousOrRejected: 36,
  },
  verifiedTripRatePercent: deriveVerifiedTripRate(288, 360),
  dataStatus: "deterministic_simulated",
};

const campaignAllocation = deriveCampaignAllocation(
  participantSummary.totalParticipants,
  100,
);

const campaignSummary: CampaignSummary = {
  campaignId: "phase-0b-simulated-mode-shift-campaign",
  displayName: "Simulated Multimodal Mode-Shift Pilot",
  participantCount: participantSummary.totalParticipants,
  capModel: {
    kind: "per_participant",
    participantCount: participantSummary.totalParticipants,
    individualCapPoints: 100,
    totalAllocationPoints: campaignAllocation,
  },
  pointsIssued: 8640,
  remainingAllocationPoints: campaignAllocation - 8640,
  utilizationPercent: deriveCampaignUtilization(8640, campaignAllocation),
  qualifyingTrips: tripSummary.verification.fullyVerified,
  repeatParticipantRatePercent: participantSummary.repeatParticipantRatePercent,
  dataStatus: "deterministic_simulated",
};

const reportLocations: DashboardReportLocation[] = [
  {
    id: "araneta-cubao-access-area",
    label: "MRT-3 Araneta-Cubao access area",
    accessPointId: "mrt3-araneta-cubao",
    latitude: 14.6196,
    longitude: 121.051,
    displayOrder: 1,
  },
  {
    id: "guadalupe-mrt-access-area",
    label: "MRT-3 Guadalupe access area",
    accessPointId: "mrt3-guadalupe",
    latitude: 14.5664,
    longitude: 121.0455,
    displayOrder: 2,
  },
  {
    id: "guadalupe-ferry-access-area",
    label: "Guadalupe Ferry access area",
    accessPointId: "guadalupe-ferry",
    latitude: 14.5617,
    longitude: 121.0372,
    displayOrder: 3,
  },
  {
    id: "hulo-ferry-access-area",
    label: "Hulo Ferry access area",
    accessPointId: "hulo-ferry",
    latitude: 14.571,
    longitude: 121.021,
    displayOrder: 4,
  },
  {
    id: "hulo-office-last-mile-access-area",
    label: "Hulo office last-mile access area",
    accessPointId: "hulo-office-demo-destination",
    latitude: 14.579,
    longitude: 121.027,
    displayOrder: 5,
  },
];

type ReportSeedInput = {
  id: string;
  category: AccessBarrierCategory;
  severity: ReportSeverity;
  locationId: string;
  description: string;
  submittedAt: string;
  status: ReportStatus;
  narrated?: true;
};

function createReport(input: ReportSeedInput): DashboardAccessBarrierReport {
  const location = reportLocations.find(
    (candidate) => candidate.id === input.locationId,
  );
  if (!location) {
    throw new Error(
      `Unknown canonical dashboard location: ${input.locationId}`,
    );
  }

  const narrated = input.narrated === true;
  return {
    id: input.id,
    category: input.category,
    categoryLabel: DASHBOARD_REPORT_CATEGORY_LABELS[input.category],
    severity: input.severity,
    locationId: location.id,
    locationLabel: location.label,
    accessPointId: location.accessPointId,
    description: input.description,
    submittedAt: input.submittedAt,
    status: input.status,
    source: narrated
      ? "simulated_mobile_prototype_submission"
      : "deterministic_dashboard_seed",
    sourceLabel: narrated
      ? "Simulated mobile prototype submission"
      : "Deterministic simulated prototype seed",
    simulatedData: true,
  };
}

const reports: DashboardAccessBarrierReport[] = [
  createReport({
    id: PHASE_0B_NARRATED_REPORT_ID,
    category: "unsafe_crossing",
    severity: "High",
    locationId: "araneta-cubao-access-area",
    description:
      "Simulated report of a difficult pedestrian crossing near the station access area.",
    submittedAt: "2026-07-15T08:00:00.000Z",
    status: "Submitted",
    narrated: true,
  }),
  createReport({
    id: "phase-0b-report-araneta-sidewalk-002",
    category: "sidewalk_obstruction",
    severity: "Medium",
    locationId: "araneta-cubao-access-area",
    description:
      "Simulated sidewalk obstruction along the pedestrian approach.",
    submittedAt: "2026-07-15T08:05:00.000Z",
    status: "Under Review",
  }),
  createReport({
    id: "phase-0b-report-araneta-loading-003",
    category: "illegal_parking_or_loading_obstruction",
    severity: "High",
    locationId: "araneta-cubao-access-area",
    description:
      "Simulated loading activity narrowing the station access path.",
    submittedAt: "2026-07-15T08:10:00.000Z",
    status: "Verified",
  }),
  createReport({
    id: "phase-0b-report-araneta-walkway-004",
    category: "damaged_walkway_or_access_path",
    severity: "Low",
    locationId: "araneta-cubao-access-area",
    description: "Simulated damaged paving on the station approach.",
    submittedAt: "2026-07-15T08:15:00.000Z",
    status: "Assigned",
  }),
  createReport({
    id: "phase-0b-report-araneta-flooding-005",
    category: "flooding",
    severity: "Medium",
    locationId: "araneta-cubao-access-area",
    description: "Simulated pooled water beside the pedestrian access path.",
    submittedAt: "2026-07-15T08:20:00.000Z",
    status: "Resolved",
  }),
  createReport({
    id: "phase-0b-report-guadalupe-mrt-flooding-006",
    category: "flooding",
    severity: "High",
    locationId: "guadalupe-mrt-access-area",
    description: "Simulated flooding on the MRT transfer approach.",
    submittedAt: "2026-07-16T08:00:00.000Z",
    status: "Submitted",
  }),
  createReport({
    id: "phase-0b-report-guadalupe-mrt-crossing-007",
    category: "unsafe_crossing",
    severity: "Medium",
    locationId: "guadalupe-mrt-access-area",
    description: "Simulated unsafe crossing on the walking transfer route.",
    submittedAt: "2026-07-16T08:05:00.000Z",
    status: "Under Review",
  }),
  createReport({
    id: "phase-0b-report-guadalupe-mrt-sidewalk-008",
    category: "sidewalk_obstruction",
    severity: "Low",
    locationId: "guadalupe-mrt-access-area",
    description: "Simulated sidewalk obstruction near the station exit.",
    submittedAt: "2026-07-16T08:10:00.000Z",
    status: "Under Review",
  }),
  createReport({
    id: "phase-0b-report-guadalupe-mrt-walkway-009",
    category: "damaged_walkway_or_access_path",
    severity: "Medium",
    locationId: "guadalupe-mrt-access-area",
    description: "Simulated uneven walkway on the ferry transfer path.",
    submittedAt: "2026-07-16T08:15:00.000Z",
    status: "Verified",
  }),
  createReport({
    id: "phase-0b-report-guadalupe-mrt-loading-010",
    category: "illegal_parking_or_loading_obstruction",
    severity: "High",
    locationId: "guadalupe-mrt-access-area",
    description: "Simulated loading obstruction beside the station exit.",
    submittedAt: "2026-07-16T08:20:00.000Z",
    status: "Assigned",
  }),
  createReport({
    id: "phase-0b-report-guadalupe-ferry-sidewalk-011",
    category: "sidewalk_obstruction",
    severity: "Medium",
    locationId: "guadalupe-ferry-access-area",
    description: "Simulated sidewalk blockage near the ferry approach.",
    submittedAt: "2026-07-17T08:00:00.000Z",
    status: "Submitted",
  }),
  createReport({
    id: "phase-0b-report-guadalupe-ferry-flooding-012",
    category: "flooding",
    severity: "High",
    locationId: "guadalupe-ferry-access-area",
    description: "Simulated pooled water on the ferry access path.",
    submittedAt: "2026-07-17T08:05:00.000Z",
    status: "Under Review",
  }),
  createReport({
    id: "phase-0b-report-guadalupe-ferry-crossing-013",
    category: "unsafe_crossing",
    severity: "Medium",
    locationId: "guadalupe-ferry-access-area",
    description: "Simulated crossing concern near the ferry entrance.",
    submittedAt: "2026-07-17T08:10:00.000Z",
    status: "Under Review",
  }),
  createReport({
    id: "phase-0b-report-guadalupe-ferry-walkway-014",
    category: "damaged_walkway_or_access_path",
    severity: "Low",
    locationId: "guadalupe-ferry-access-area",
    description: "Simulated damaged access surface near the station gate.",
    submittedAt: "2026-07-17T08:15:00.000Z",
    status: "Verified",
  }),
  createReport({
    id: "phase-0b-report-guadalupe-ferry-loading-015",
    category: "illegal_parking_or_loading_obstruction",
    severity: "Medium",
    locationId: "guadalupe-ferry-access-area",
    description: "Simulated loading obstruction on the ferry approach.",
    submittedAt: "2026-07-17T08:20:00.000Z",
    status: "Resolved",
  }),
  createReport({
    id: "phase-0b-report-hulo-ferry-walkway-016",
    category: "damaged_walkway_or_access_path",
    severity: "High",
    locationId: "hulo-ferry-access-area",
    description: "Simulated damaged walkway at the ferry exit.",
    submittedAt: "2026-07-18T08:00:00.000Z",
    status: "Submitted",
  }),
  createReport({
    id: "phase-0b-report-hulo-ferry-loading-017",
    category: "illegal_parking_or_loading_obstruction",
    severity: "Medium",
    locationId: "hulo-ferry-access-area",
    description: "Simulated loading obstruction beside the ferry access.",
    submittedAt: "2026-07-18T08:05:00.000Z",
    status: "Under Review",
  }),
  createReport({
    id: "phase-0b-report-hulo-ferry-flooding-018",
    category: "flooding",
    severity: "Medium",
    locationId: "hulo-ferry-access-area",
    description: "Simulated pooled water on the ferry exit path.",
    submittedAt: "2026-07-18T08:10:00.000Z",
    status: "Verified",
  }),
  createReport({
    id: "phase-0b-report-hulo-ferry-sidewalk-019",
    category: "sidewalk_obstruction",
    severity: "High",
    locationId: "hulo-ferry-access-area",
    description: "Simulated sidewalk obstruction on the last-mile route.",
    submittedAt: "2026-07-18T08:15:00.000Z",
    status: "Assigned",
  }),
  createReport({
    id: "phase-0b-report-hulo-ferry-crossing-020",
    category: "unsafe_crossing",
    severity: "Low",
    locationId: "hulo-ferry-access-area",
    description: "Simulated crossing concern near the ferry exit.",
    submittedAt: "2026-07-18T08:20:00.000Z",
    status: "Resolved",
  }),
  createReport({
    id: "phase-0b-report-hulo-office-sidewalk-021",
    category: "sidewalk_obstruction",
    severity: "Medium",
    locationId: "hulo-office-last-mile-access-area",
    description: "Simulated sidewalk obstruction on the office approach.",
    submittedAt: "2026-07-19T08:00:00.000Z",
    status: "Under Review",
  }),
  createReport({
    id: "phase-0b-report-hulo-office-crossing-022",
    category: "unsafe_crossing",
    severity: "High",
    locationId: "hulo-office-last-mile-access-area",
    description: "Simulated crossing concern on the last-mile approach.",
    submittedAt: "2026-07-19T08:05:00.000Z",
    status: "Under Review",
  }),
  createReport({
    id: "phase-0b-report-hulo-office-flooding-023",
    category: "flooding",
    severity: "Low",
    locationId: "hulo-office-last-mile-access-area",
    description: "Simulated pooled water beside the office approach.",
    submittedAt: "2026-07-19T08:10:00.000Z",
    status: "Verified",
  }),
  createReport({
    id: "phase-0b-report-hulo-office-loading-024",
    category: "illegal_parking_or_loading_obstruction",
    severity: "Medium",
    locationId: "hulo-office-last-mile-access-area",
    description: "Simulated loading obstruction on the last-mile path.",
    submittedAt: "2026-07-19T08:15:00.000Z",
    status: "Verified",
  }),
  createReport({
    id: "phase-0b-report-hulo-office-walkway-025",
    category: "damaged_walkway_or_access_path",
    severity: "High",
    locationId: "hulo-office-last-mile-access-area",
    description: "Simulated damaged surface on the office access path.",
    submittedAt: "2026-07-19T08:20:00.000Z",
    status: "Assigned",
  }),
];

const tripChainInsight: TripChainInsight = {
  routeId: phase0APilotRoute.id,
  segmentCount: phase0APilotRoute.segments.length,
  fullyCompletedTrips: tripSummary.verification.fullyVerified,
  completionRatePercent: tripSummary.verifiedTripRatePercent,
  commonAccessOrTransferPoints: reportLocations.map((location) => ({
    accessPointId: location.accessPointId,
    label: location.label,
    verifiedTripCount: tripSummary.verification.fullyVerified,
  })),
  confidenceSummaries: [
    {
      result: "Verified sustainable trip chain",
      rewardEligibility: "Full",
      tripCount: tripSummary.verification.fullyVerified,
      representativeConfidencePercent: 95,
    },
    {
      result: "Partially verified trip",
      rewardEligibility: "Reduced",
      tripCount: tripSummary.verification.partiallyVerified,
      representativeConfidencePercent: 70,
    },
    {
      result: "Suspicious pattern",
      rewardEligibility: "None",
      tripCount: tripSummary.verification.suspiciousOrRejected,
      representativeConfidencePercent: 45,
    },
  ],
  dataStatus: "deterministic_simulated",
};

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) {
      deepFreeze(child);
    }
  }

  return value;
}

export const phase0BDashboardSeed = deepFreeze({
  metadata: {
    seedVersion: PHASE_0B_DASHBOARD_SEED_VERSION,
    reviewedDate: "2026-07-23",
    dataStatus: "deterministic_simulated",
    title: PHASE_0B_DASHBOARD_TITLE,
    subtitle: PHASE_0B_DASHBOARD_SUBTITLE,
    disclosure: {
      statement: PHASE_0B_DASHBOARD_DISCLOSURE,
      dataStatus: "deterministic_simulated",
      simulatedData: true,
      liveMmdaConnected: false,
      liveCommuterDataConnected: false,
      prototypeDecisionSupportOnly: true,
    },
    routeId: phase0APilotRoute.id,
    campaignWindow: {
      startDate: "2026-07-01",
      endDate: "2026-07-21",
    },
    co2e: {
      valueKg: null,
      status: "pending_pilot_calibration",
      display: "Pending pilot calibration",
    },
  },
  participants: participantSummary,
  trips: tripSummary,
  campaign: campaignSummary,
  reportLocations,
  reports,
  tripChainInsight,
  narratedReportId: PHASE_0B_NARRATED_REPORT_ID,
} satisfies DashboardSeedData);
