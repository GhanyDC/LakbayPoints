import {
  deriveDashboardOverview,
  phase0APilotRoute,
  phase0BDashboardSeed,
  type DashboardMetricId,
  type DashboardMetricValue,
  type DashboardSeedData,
  type RouteOption,
} from "@lakbaypoints/shared";

const integerFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const smallNumberWords = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
] as const;

export type DashboardMetricViewModel = {
  id: DashboardMetricId;
  label: string;
  displayValue: string;
  unit: string | null;
  supportingText: string;
  definition: string;
  statusLabel: string;
  tone: "primary" | "standard" | "pending";
};

export type DashboardOverviewViewModel = {
  title: string;
  subtitle: string;
  productMessage: string;
  disclosure: string;
  routeContext: string;
  seedVersion: string;
  reviewedDate: string;
  metrics: DashboardMetricViewModel[];
};

function formatInteger(value: number): string {
  return integerFormatter.format(value);
}

function formatPercent(value: number): string {
  return `${integerFormatter.format(value)}%`;
}

function formatCountWord(value: number): string {
  if (
    Number.isInteger(value) &&
    value >= 0 &&
    value < smallNumberWords.length
  ) {
    return smallNumberWords[value];
  }

  return formatInteger(value);
}

function createMetricViewModel(
  metric: DashboardMetricValue,
  seed: DashboardSeedData,
): DashboardMetricViewModel {
  switch (metric.id) {
    case "verified_sustainable_trips":
      return {
        ...metric,
        unit: metric.unit,
        supportingText: `${formatPercent(seed.trips.verifiedTripRatePercent)} of ${formatInteger(seed.trips.totalAttempts)} simulated trip attempts`,
        definition: metric.description,
        statusLabel: "Primary verified metric",
        tone: "primary",
      };
    case "access_barrier_reports":
      return {
        ...metric,
        unit: metric.unit,
        supportingText: `Across ${formatCountWord(seed.reportLocations.length)} final-route access areas`,
        definition:
          "Deterministic prototype reports; no live report-intake feed is connected.",
        statusLabel: "Simulated metric",
        tone: "standard",
      };
    case "reports_under_review":
      return {
        ...metric,
        unit: metric.unit,
        supportingText: "Exact current status: Under Review",
        definition:
          "Submitted, Verified, Assigned, and Resolved reports are excluded from this count.",
        statusLabel: "Simulated metric",
        tone: "standard",
      };
    case "estimated_co2e_avoided":
      return {
        ...metric,
        unit: null,
        supportingText: "No environmental total is claimed.",
        definition: metric.description,
        statusLabel: "Calibration pending",
        tone: "pending",
      };
    case "campaign_points_issued":
      return {
        ...metric,
        unit: metric.unit,
        supportingText: `${formatPercent(seed.campaign.utilizationPercent)} of the ${formatInteger(seed.campaign.capModel.totalAllocationPoints)}-Point simulated campaign allocation`,
        definition:
          "Simulated capped campaign incentives only; no redemption or financial value.",
        statusLabel: "Simulated metric",
        tone: "standard",
      };
    case "repeat_sustainable_trip_users":
      return {
        ...metric,
        unit: metric.unit,
        supportingText: `${formatPercent(seed.participants.repeatParticipantRatePercent)} of ${formatInteger(seed.participants.totalParticipants)} simulated participants`,
        definition:
          "At least two fully verified qualifying trips in the simulated campaign window.",
        statusLabel: "Simulated metric",
        tone: "standard",
      };
  }
}

export function createDashboardOverviewViewModel(
  seed: DashboardSeedData,
  route: RouteOption,
): DashboardOverviewViewModel {
  const overview = deriveDashboardOverview(seed);

  return {
    title: seed.metadata.title,
    subtitle: seed.metadata.subtitle,
    productMessage: "Guide the Trip. Verify the Shift. Improve Access.",
    disclosure: seed.metadata.disclosure.statement,
    routeContext: route.accessPoints
      .map((accessPoint) => accessPoint.label)
      .join(" → "),
    seedVersion: overview.seedVersion,
    reviewedDate: seed.metadata.reviewedDate,
    metrics: overview.metrics.map((metric) =>
      createMetricViewModel(metric, seed),
    ),
  };
}

export const dashboardOverviewViewModel = createDashboardOverviewViewModel(
  phase0BDashboardSeed,
  phase0APilotRoute,
);
