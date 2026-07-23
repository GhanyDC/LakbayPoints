import type {
  AccessBarrierCategory,
  ReportSeverity,
  ReportStatus,
  RewardEligibility,
  VerificationResultLabel,
} from "./types";

export type DashboardDataStatus =
  "deterministic_simulated" | "pending_calibration";

export type DashboardDisclosure = {
  statement: string;
  dataStatus: "deterministic_simulated";
  simulatedData: true;
  liveMmdaConnected: false;
  liveCommuterDataConnected: false;
  prototypeDecisionSupportOnly: true;
};

export type DashboardSeedMetadata = {
  seedVersion: string;
  reviewedDate: string;
  dataStatus: "deterministic_simulated";
  title: string;
  subtitle: string;
  disclosure: DashboardDisclosure;
  routeId: string;
  campaignWindow: {
    startDate: string;
    endDate: string;
  };
  co2e: {
    valueKg: number | null;
    status: "pending_pilot_calibration" | "calibrated";
    display: string;
  };
};

export type PilotParticipantSummary = {
  totalParticipants: number;
  repeatParticipants: number;
  repeatParticipantDefinition: string;
  repeatParticipantRatePercent: number;
  dataStatus: "deterministic_simulated";
};

export type TripVerificationBreakdown = {
  fullyVerified: number;
  partiallyVerified: number;
  suspiciousOrRejected: number;
};

export type PilotTripSummary = {
  routeId: string;
  totalAttempts: number;
  verification: TripVerificationBreakdown;
  verifiedTripRatePercent: number;
  dataStatus: "deterministic_simulated";
};

export type TripChainAccessPointInsight = {
  accessPointId: string;
  label: string;
  verifiedTripCount: number;
};

export type TripChainConfidenceSummary = {
  result: VerificationResultLabel;
  rewardEligibility: RewardEligibility;
  tripCount: number;
  representativeConfidencePercent: number;
};

export type TripChainInsight = {
  routeId: string;
  segmentCount: number;
  fullyCompletedTrips: number;
  completionRatePercent: number;
  commonAccessOrTransferPoints: TripChainAccessPointInsight[];
  confidenceSummaries: TripChainConfidenceSummary[];
  dataStatus: "deterministic_simulated";
};

export type CampaignCapModel = {
  kind: "per_participant";
  participantCount: number;
  individualCapPoints: number;
  totalAllocationPoints: number;
};

export type CampaignSummary = {
  campaignId: string;
  displayName: string;
  participantCount: number;
  capModel: CampaignCapModel;
  pointsIssued: number;
  remainingAllocationPoints: number;
  utilizationPercent: number;
  qualifyingTrips: number;
  repeatParticipantRatePercent: number;
  dataStatus: "deterministic_simulated";
};

export type DashboardReportLocation = {
  id: string;
  label: string;
  accessPointId: string;
  latitude: number;
  longitude: number;
  displayOrder: number;
};

export type DashboardReportSource =
  "simulated_mobile_prototype_submission" | "deterministic_dashboard_seed";

export type DashboardAccessBarrierReport = {
  id: string;
  category: AccessBarrierCategory;
  categoryLabel: string;
  severity: ReportSeverity;
  locationId: string;
  locationLabel: string;
  accessPointId: string;
  description: string;
  submittedAt: string;
  status: ReportStatus;
  source: DashboardReportSource;
  sourceLabel: string;
  simulatedData: true;
};

export type PilotHotspotSummary = {
  locationId: string;
  locationLabel: string;
  accessPointId: string;
  reportCount: number;
  reportsBySeverity: Record<ReportSeverity, number>;
  reportsByStatus: Record<ReportStatus, number>;
  simulatedData: true;
};

export type DashboardMetricId =
  | "verified_sustainable_trips"
  | "access_barrier_reports"
  | "reports_under_review"
  | "estimated_co2e_avoided"
  | "campaign_points_issued"
  | "repeat_sustainable_trip_users";

export type DashboardMetricValue = {
  id: DashboardMetricId;
  label: string;
  value: number | null;
  displayValue: string;
  unit: "trips" | "reports" | "kg CO2e" | "Points" | "participants" | null;
  dataStatus: DashboardDataStatus;
  description: string;
};

export type DashboardOverview = {
  seedVersion: string;
  metrics: DashboardMetricValue[];
};

export type DashboardSeedData = {
  metadata: DashboardSeedMetadata;
  participants: PilotParticipantSummary;
  trips: PilotTripSummary;
  campaign: CampaignSummary;
  reportLocations: DashboardReportLocation[];
  reports: DashboardAccessBarrierReport[];
  tripChainInsight: TripChainInsight;
  narratedReportId: string;
};

export type DashboardSeedValidationResult = {
  valid: boolean;
  errors: string[];
};

export type ReportStatusTransition = {
  from: ReportStatus;
  to: ReportStatus;
};

export type ReportStatusTransitionResult =
  | {
      ok: true;
      outcome: "success" | "no_op";
      transition: ReportStatusTransition;
      report: DashboardAccessBarrierReport;
      reports: DashboardAccessBarrierReport[];
      message: string;
    }
  | {
      ok: false;
      outcome: "invalid_transition";
      transition: ReportStatusTransition;
      reports: DashboardAccessBarrierReport[];
      message: string;
    }
  | {
      ok: false;
      outcome: "report_not_found";
      reportId: string;
      requestedStatus: ReportStatus;
      reports: DashboardAccessBarrierReport[];
      message: string;
    };
