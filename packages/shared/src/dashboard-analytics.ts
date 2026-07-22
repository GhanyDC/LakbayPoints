import { phase0APilotRoute } from "./routes";
import type {
  DashboardAccessBarrierReport,
  DashboardOverview,
  DashboardReportLocation,
  DashboardSeedData,
  DashboardSeedValidationResult,
  PilotHotspotSummary,
  TripChainInsight,
} from "./dashboard-types";
import type {
  AccessBarrierCategory,
  ReportSeverity,
  ReportStatus,
} from "./types";

export const PHASE_0B_DASHBOARD_TITLE = "LakbayPoints Agency Mobility Insights";
export const PHASE_0B_DASHBOARD_SUBTITLE = "Simulated Phase 0B Pilot Dashboard";
export const PHASE_0B_DASHBOARD_DISCLOSURE =
  "All metrics, reports, trip results, and campaign values shown in this dashboard are deterministic simulated prototype data for the MMITS demonstration. No live MMDA system or commuter data is connected.";

export const DASHBOARD_REPORT_CATEGORY_LABELS: Record<
  AccessBarrierCategory,
  string
> = {
  sidewalk_obstruction: "Sidewalk obstruction",
  unsafe_crossing: "Unsafe crossing",
  flooding: "Flooding",
  illegal_parking_or_loading_obstruction:
    "Illegal parking or loading obstruction",
  damaged_walkway_or_access_path: "Damaged walkway or access path",
};

export const REPORT_STATUS_WORKFLOW = [
  "Submitted",
  "Under Review",
  "Verified",
  "Assigned",
  "Resolved",
] as const satisfies readonly ReportStatus[];

export const PHASE_0B_REPORT_STATUS_DISTRIBUTION: Record<ReportStatus, number> =
  {
    Submitted: 4,
    "Under Review": 8,
    Verified: 6,
    Assigned: 4,
    Resolved: 3,
  };

const reportCategories = Object.keys(
  DASHBOARD_REPORT_CATEGORY_LABELS,
) as AccessBarrierCategory[];
const reportSeverities: ReportSeverity[] = ["Low", "Medium", "High"];
const approvedAccessPointIds = new Set(
  phase0APilotRoute.accessPoints
    .filter((point) => point.id !== phase0APilotRoute.originAccessPointId)
    .map((point) => point.id),
);

function roundPercent(value: number): number {
  return Math.round(value * 100) / 100;
}

function isFiniteNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

function safePercentage(numerator: number, denominator: number): number {
  if (
    !isFiniteNonNegative(numerator) ||
    !Number.isFinite(denominator) ||
    denominator <= 0
  ) {
    return 0;
  }

  return roundPercent((numerator / denominator) * 100);
}

function formatInteger(value: number): string {
  return String(Math.trunc(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function deriveVerifiedTripRate(
  fullyVerifiedTrips: number,
  totalAttempts: number,
): number {
  return safePercentage(fullyVerifiedTrips, totalAttempts);
}

export function deriveRepeatParticipantRate(
  repeatParticipants: number,
  totalParticipants: number,
): number {
  return safePercentage(repeatParticipants, totalParticipants);
}

export function deriveCampaignAllocation(
  participantCount: number,
  individualCapPoints: number,
): number {
  if (
    !isFiniteNonNegative(participantCount) ||
    !isFiniteNonNegative(individualCapPoints)
  ) {
    return 0;
  }

  return participantCount * individualCapPoints;
}

export function deriveCampaignUtilization(
  pointsIssued: number,
  totalAllocationPoints: number,
): number {
  return safePercentage(pointsIssued, totalAllocationPoints);
}

export function countReportsByStatus(
  reports: readonly DashboardAccessBarrierReport[],
): Record<ReportStatus, number> {
  const counts: Record<ReportStatus, number> = {
    Submitted: 0,
    "Under Review": 0,
    Verified: 0,
    Assigned: 0,
    Resolved: 0,
  };

  for (const report of reports) {
    if (REPORT_STATUS_WORKFLOW.includes(report.status)) {
      counts[report.status] += 1;
    }
  }

  return counts;
}

export function countReportsBySeverity(
  reports: readonly DashboardAccessBarrierReport[],
): Record<ReportSeverity, number> {
  const counts: Record<ReportSeverity, number> = {
    Low: 0,
    Medium: 0,
    High: 0,
  };

  for (const report of reports) {
    if (reportSeverities.includes(report.severity)) {
      counts[report.severity] += 1;
    }
  }

  return counts;
}

export function countReportsByLocation(
  reports: readonly DashboardAccessBarrierReport[],
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const report of reports) {
    counts[report.locationId] = (counts[report.locationId] ?? 0) + 1;
  }

  return counts;
}

export function derivePilotHotspots(
  reports: readonly DashboardAccessBarrierReport[],
  locations: readonly DashboardReportLocation[],
): PilotHotspotSummary[] {
  return [...locations]
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map((location) => {
      const locationReports = reports.filter(
        (report) => report.locationId === location.id,
      );

      return {
        locationId: location.id,
        locationLabel: location.label,
        accessPointId: location.accessPointId,
        reportCount: locationReports.length,
        reportsBySeverity: countReportsBySeverity(locationReports),
        reportsByStatus: countReportsByStatus(locationReports),
        simulatedData: true,
      };
    });
}

export function deriveReportsUnderReview(
  reports: readonly DashboardAccessBarrierReport[],
): number {
  return reports.filter((report) => report.status === "Under Review").length;
}

export function findNarratedDemoReport(
  seed: DashboardSeedData,
): DashboardAccessBarrierReport | undefined {
  return seed.reports.find((report) => report.id === seed.narratedReportId);
}

export function deriveTripChainInsights(
  seed: DashboardSeedData,
): TripChainInsight {
  return {
    ...seed.tripChainInsight,
    fullyCompletedTrips: seed.trips.verification.fullyVerified,
    completionRatePercent: deriveVerifiedTripRate(
      seed.trips.verification.fullyVerified,
      seed.trips.totalAttempts,
    ),
    commonAccessOrTransferPoints:
      seed.tripChainInsight.commonAccessOrTransferPoints.map((point) => ({
        ...point,
      })),
    confidenceSummaries: seed.tripChainInsight.confidenceSummaries.map(
      (summary) => ({ ...summary }),
    ),
  };
}

export function deriveDashboardOverview(
  seed: DashboardSeedData,
): DashboardOverview {
  const verifiedTrips = seed.trips.verification.fullyVerified;
  const reportCount = seed.reports.length;
  const underReview = deriveReportsUnderReview(seed.reports);
  const pointsIssued = seed.campaign.pointsIssued;
  const repeatParticipants = seed.participants.repeatParticipants;
  const co2e = seed.metadata.co2e;

  return {
    seedVersion: seed.metadata.seedVersion,
    metrics: [
      {
        id: "verified_sustainable_trips",
        label: "Verified Sustainable Trips",
        value: verifiedTrips,
        displayValue: formatInteger(verifiedTrips),
        unit: "trips",
        dataStatus: "deterministic_simulated",
        description: "Fully verified qualifying pilot-route trip attempts.",
      },
      {
        id: "access_barrier_reports",
        label: "Access-Barrier Reports",
        value: reportCount,
        displayValue: formatInteger(reportCount),
        unit: "reports",
        dataStatus: "deterministic_simulated",
        description: "Deterministic reports across five pilot access areas.",
      },
      {
        id: "reports_under_review",
        label: "Reports Under Review",
        value: underReview,
        displayValue: formatInteger(underReview),
        unit: "reports",
        dataStatus: "deterministic_simulated",
        description: "Reports whose exact current status is Under Review.",
      },
      {
        id: "estimated_co2e_avoided",
        label: "Estimated CO2e Avoided",
        value: co2e.valueKg,
        displayValue:
          co2e.valueKg === null
            ? co2e.display
            : `${co2e.valueKg.toFixed(2)} kg`,
        unit: "kg CO2e",
        dataStatus:
          co2e.status === "pending_pilot_calibration"
            ? "pending_calibration"
            : "deterministic_simulated",
        description:
          "No environmental total is claimed before pilot calibration.",
      },
      {
        id: "campaign_points_issued",
        label: "Campaign Points Issued",
        value: pointsIssued,
        displayValue: formatInteger(pointsIssued),
        unit: "Points",
        dataStatus: "deterministic_simulated",
        description: "Simulated capped campaign incentives; not cash value.",
      },
      {
        id: "repeat_sustainable_trip_users",
        label: "Repeat Sustainable-Trip Users",
        value: repeatParticipants,
        displayValue: formatInteger(repeatParticipants),
        unit: "participants",
        dataStatus: "deterministic_simulated",
        description:
          "Participants with at least two fully verified qualifying trips.",
      },
    ],
  };
}

function requireNonNegativeInteger(
  errors: string[],
  path: string,
  value: number,
): void {
  if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) {
    errors.push(`${path} must be a non-negative finite integer.`);
  }
}

function requireFinitePercent(
  errors: string[],
  path: string,
  value: number,
): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    errors.push(`${path} must be a finite percentage from 0 to 100.`);
  }
}

function percentagesMatch(left: number, right: number): boolean {
  return Number.isFinite(left) && Math.abs(left - right) < 0.001;
}

export function validateDashboardSeed(
  seed: DashboardSeedData,
): DashboardSeedValidationResult {
  const errors: string[] = [];
  const participants = seed.participants;
  const trips = seed.trips;
  const campaign = seed.campaign;

  requireNonNegativeInteger(
    errors,
    "participants.totalParticipants",
    participants.totalParticipants,
  );
  requireNonNegativeInteger(
    errors,
    "participants.repeatParticipants",
    participants.repeatParticipants,
  );
  requireFinitePercent(
    errors,
    "participants.repeatParticipantRatePercent",
    participants.repeatParticipantRatePercent,
  );
  if (participants.repeatParticipants > participants.totalParticipants) {
    errors.push("Repeat participants cannot exceed total participants.");
  }
  const expectedRepeatRate = deriveRepeatParticipantRate(
    participants.repeatParticipants,
    participants.totalParticipants,
  );
  if (
    !percentagesMatch(
      participants.repeatParticipantRatePercent,
      expectedRepeatRate,
    )
  ) {
    errors.push("Repeat participant rate does not match participant counts.");
  }

  requireNonNegativeInteger(errors, "trips.totalAttempts", trips.totalAttempts);
  requireNonNegativeInteger(
    errors,
    "trips.verification.fullyVerified",
    trips.verification.fullyVerified,
  );
  requireNonNegativeInteger(
    errors,
    "trips.verification.partiallyVerified",
    trips.verification.partiallyVerified,
  );
  requireNonNegativeInteger(
    errors,
    "trips.verification.suspiciousOrRejected",
    trips.verification.suspiciousOrRejected,
  );
  requireFinitePercent(
    errors,
    "trips.verifiedTripRatePercent",
    trips.verifiedTripRatePercent,
  );
  const outcomeTotal =
    trips.verification.fullyVerified +
    trips.verification.partiallyVerified +
    trips.verification.suspiciousOrRejected;
  if (outcomeTotal !== trips.totalAttempts) {
    errors.push("Trip verification outcomes must equal total attempts.");
  }
  const expectedVerifiedRate = deriveVerifiedTripRate(
    trips.verification.fullyVerified,
    trips.totalAttempts,
  );
  if (!percentagesMatch(trips.verifiedTripRatePercent, expectedVerifiedRate)) {
    errors.push("Verified trip rate does not match trip counts.");
  }
  if (
    trips.routeId !== phase0APilotRoute.id ||
    seed.metadata.routeId !== phase0APilotRoute.id
  ) {
    errors.push("Dashboard seed must reference the approved Phase 0A route.");
  }

  requireNonNegativeInteger(
    errors,
    "campaign.participantCount",
    campaign.participantCount,
  );
  requireNonNegativeInteger(
    errors,
    "campaign.capModel.individualCapPoints",
    campaign.capModel.individualCapPoints,
  );
  requireNonNegativeInteger(
    errors,
    "campaign.capModel.totalAllocationPoints",
    campaign.capModel.totalAllocationPoints,
  );
  requireNonNegativeInteger(
    errors,
    "campaign.pointsIssued",
    campaign.pointsIssued,
  );
  requireNonNegativeInteger(
    errors,
    "campaign.remainingAllocationPoints",
    campaign.remainingAllocationPoints,
  );
  requireNonNegativeInteger(
    errors,
    "campaign.qualifyingTrips",
    campaign.qualifyingTrips,
  );
  requireFinitePercent(
    errors,
    "campaign.utilizationPercent",
    campaign.utilizationPercent,
  );
  if (
    campaign.participantCount !== participants.totalParticipants ||
    campaign.capModel.participantCount !== participants.totalParticipants
  ) {
    errors.push(
      "Campaign participant count must match the pilot participants.",
    );
  }
  const expectedAllocation = deriveCampaignAllocation(
    participants.totalParticipants,
    campaign.capModel.individualCapPoints,
  );
  if (campaign.capModel.totalAllocationPoints !== expectedAllocation) {
    errors.push(
      "Campaign allocation must equal participants times the individual cap.",
    );
  }
  if (campaign.pointsIssued > campaign.capModel.totalAllocationPoints) {
    errors.push("Campaign Points issued cannot exceed total allocation.");
  }
  if (
    campaign.remainingAllocationPoints !==
    campaign.capModel.totalAllocationPoints - campaign.pointsIssued
  ) {
    errors.push("Campaign remaining allocation is inconsistent.");
  }
  const expectedUtilization = deriveCampaignUtilization(
    campaign.pointsIssued,
    campaign.capModel.totalAllocationPoints,
  );
  if (!percentagesMatch(campaign.utilizationPercent, expectedUtilization)) {
    errors.push("Campaign utilization does not match issued Points.");
  }
  if (
    !percentagesMatch(
      campaign.repeatParticipantRatePercent,
      participants.repeatParticipantRatePercent,
    )
  ) {
    errors.push("Campaign repeat-participant rate is inconsistent.");
  }
  if (campaign.qualifyingTrips !== trips.verification.fullyVerified) {
    errors.push("Campaign qualifying trips must equal fully verified trips.");
  }

  if (seed.reportLocations.length !== 5) {
    errors.push("Dashboard seed must define exactly five report locations.");
  }
  const locationIds = seed.reportLocations.map((location) => location.id);
  if (new Set(locationIds).size !== locationIds.length) {
    errors.push("Dashboard report location IDs must be unique.");
  }
  const accessPointIds = seed.reportLocations.map(
    (location) => location.accessPointId,
  );
  if (
    new Set(accessPointIds).size !== 5 ||
    accessPointIds.some((id) => !approvedAccessPointIds.has(id))
  ) {
    errors.push(
      "Report locations must be the five approved route access areas.",
    );
  }
  for (const location of seed.reportLocations) {
    if (
      !Number.isFinite(location.latitude) ||
      !Number.isFinite(location.longitude)
    ) {
      errors.push(`Report location ${location.id} has invalid coordinates.`);
    }
    requireNonNegativeInteger(
      errors,
      `reportLocations.${location.id}.displayOrder`,
      location.displayOrder,
    );
  }

  if (seed.reports.length !== 25) {
    errors.push("Dashboard seed must contain exactly 25 reports.");
  }
  const reportIds = seed.reports.map((report) => report.id);
  if (new Set(reportIds).size !== reportIds.length) {
    errors.push("Dashboard report IDs must be unique.");
  }
  const locationsById = new Map(
    seed.reportLocations.map((location) => [location.id, location]),
  );
  for (const report of seed.reports) {
    if (!reportCategories.includes(report.category)) {
      errors.push(`Report ${report.id} has an unknown category.`);
    } else if (
      report.categoryLabel !== DASHBOARD_REPORT_CATEGORY_LABELS[report.category]
    ) {
      errors.push(`Report ${report.id} has an incorrect category label.`);
    }
    if (!reportSeverities.includes(report.severity)) {
      errors.push(`Report ${report.id} has an unknown severity.`);
    }
    if (!REPORT_STATUS_WORKFLOW.includes(report.status)) {
      errors.push(`Report ${report.id} has an unknown status.`);
    }
    const location = locationsById.get(report.locationId);
    if (
      !location ||
      report.locationLabel !== location.label ||
      report.accessPointId !== location.accessPointId
    ) {
      errors.push(`Report ${report.id} is outside the approved access areas.`);
    }
    if (!Number.isFinite(Date.parse(report.submittedAt))) {
      errors.push(`Report ${report.id} has an invalid submitted timestamp.`);
    }
    if (
      report.simulatedData !== true ||
      !/simulated/i.test(report.sourceLabel) ||
      /official MMDA|MMDA dispatch|live agency queue/i.test(
        `${report.description} ${report.sourceLabel}`,
      )
    ) {
      errors.push(
        `Report ${report.id} does not preserve simulated provenance.`,
      );
    }
  }

  const statusCounts = countReportsByStatus(seed.reports);
  for (const status of REPORT_STATUS_WORKFLOW) {
    if (statusCounts[status] !== PHASE_0B_REPORT_STATUS_DISTRIBUTION[status]) {
      errors.push(`Report status distribution is incorrect for ${status}.`);
    }
  }

  const narratedMatches = seed.reports.filter(
    (report) => report.id === seed.narratedReportId,
  );
  if (narratedMatches.length !== 1) {
    errors.push("The narrated dashboard report must exist exactly once.");
  } else {
    const narrated = narratedMatches[0];
    if (
      narrated.category !== "unsafe_crossing" ||
      narrated.categoryLabel !== "Unsafe crossing" ||
      narrated.severity !== "High" ||
      narrated.accessPointId !== "mrt3-araneta-cubao" ||
      narrated.locationLabel !== "MRT-3 Araneta-Cubao access area" ||
      narrated.status !== "Submitted" ||
      narrated.source !== "simulated_mobile_prototype_submission" ||
      narrated.simulatedData !== true
    ) {
      errors.push("The narrated dashboard report has incorrect seed values.");
    }
  }

  const hotspotTotal = derivePilotHotspots(
    seed.reports,
    seed.reportLocations,
  ).reduce((total, hotspot) => total + hotspot.reportCount, 0);
  if (hotspotTotal !== seed.reports.length) {
    errors.push("Pilot hotspot totals must equal the report total.");
  }

  if (
    seed.metadata.title !== PHASE_0B_DASHBOARD_TITLE ||
    seed.metadata.subtitle !== PHASE_0B_DASHBOARD_SUBTITLE ||
    seed.metadata.dataStatus !== "deterministic_simulated" ||
    seed.metadata.disclosure.statement !== PHASE_0B_DASHBOARD_DISCLOSURE ||
    seed.metadata.disclosure.dataStatus !== "deterministic_simulated" ||
    seed.metadata.disclosure.simulatedData !== true ||
    seed.metadata.disclosure.liveMmdaConnected !== false ||
    seed.metadata.disclosure.liveCommuterDataConnected !== false ||
    seed.metadata.disclosure.prototypeDecisionSupportOnly !== true
  ) {
    errors.push(
      "Dashboard metadata must preserve the approved simulated-data disclosure.",
    );
  }
  if (
    seed.metadata.co2e.status === "pending_pilot_calibration" &&
    seed.metadata.co2e.valueKg !== null
  ) {
    errors.push("CO2e must remain null while pilot calibration is pending.");
  }
  if (
    seed.metadata.co2e.status !== "pending_pilot_calibration" ||
    seed.metadata.co2e.display !== "Pending pilot calibration"
  ) {
    errors.push("CO2e calibration status or display is incorrect.");
  }

  const derivedInsight = deriveTripChainInsights(seed);
  if (
    seed.tripChainInsight.segmentCount !== phase0APilotRoute.segments.length ||
    seed.tripChainInsight.fullyCompletedTrips !==
      derivedInsight.fullyCompletedTrips ||
    !percentagesMatch(
      seed.tripChainInsight.completionRatePercent,
      derivedInsight.completionRatePercent,
    )
  ) {
    errors.push("Trip-chain completion insight is inconsistent.");
  }
  const confidenceTripTotal = seed.tripChainInsight.confidenceSummaries.reduce(
    (total, summary) => total + summary.tripCount,
    0,
  );
  if (confidenceTripTotal !== trips.totalAttempts) {
    errors.push("Trip confidence summaries must equal total attempts.");
  }
  for (const summary of seed.tripChainInsight.confidenceSummaries) {
    requireNonNegativeInteger(
      errors,
      `tripChainInsight.${summary.result}.tripCount`,
      summary.tripCount,
    );
    requireFinitePercent(
      errors,
      `tripChainInsight.${summary.result}.representativeConfidencePercent`,
      summary.representativeConfidencePercent,
    );
  }

  return { valid: errors.length === 0, errors };
}
