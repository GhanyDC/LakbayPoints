import assert from "node:assert/strict";
import test from "node:test";

import {
  countReportsByLocation,
  countReportsBySeverity,
  countReportsByStatus,
  deriveCampaignAllocation,
  deriveCampaignUtilization,
  deriveDashboardOverview,
  derivePilotHotspots,
  deriveRepeatParticipantRate,
  deriveReportsUnderReview,
  deriveTripChainInsights,
  deriveVerifiedTripRate,
  findNarratedDemoReport,
  phase0BDashboardSeed,
  validateDashboardSeed,
  type AccessBarrierCategory,
  type DashboardSeedData,
  type ReportSeverity,
  type ReportStatus,
} from "../src/index";

function cloneSeed(): DashboardSeedData {
  return structuredClone(phase0BDashboardSeed);
}

function assertInvalidWith(seed: DashboardSeedData, pattern: RegExp): void {
  const result = validateDashboardSeed(seed);
  assert.equal(result.valid, false);
  assert.equal(
    result.errors.some((error) => pattern.test(error)),
    true,
  );
}

test("dashboard overview derives the six approved metrics", () => {
  const overview = deriveDashboardOverview(phase0BDashboardSeed);
  assert.equal(overview.metrics.length, 6);
  assert.deepEqual(
    overview.metrics.map((metric) => [metric.id, metric.value]),
    [
      ["verified_sustainable_trips", 288],
      ["access_barrier_reports", 25],
      ["reports_under_review", 8],
      ["estimated_co2e_avoided", null],
      ["campaign_points_issued", 8640],
      ["repeat_sustainable_trip_users", 84],
    ],
  );
  assert.equal(
    overview.metrics.find((metric) => metric.id === "estimated_co2e_avoided")
      ?.displayValue,
    "Pending pilot calibration",
  );
});

test("verified trip rate helper returns 80 percent", () => {
  assert.equal(deriveVerifiedTripRate(288, 360), 80);
});

test("repeat participant rate helper returns 70 percent", () => {
  assert.equal(deriveRepeatParticipantRate(84, 120), 70);
});

test("campaign allocation helper derives 12,000 Points", () => {
  assert.equal(deriveCampaignAllocation(120, 100), 12_000);
});

test("campaign utilization helper derives 72 percent", () => {
  assert.equal(deriveCampaignUtilization(8640, 12_000), 72);
});

test("status counts match the canonical seed", () => {
  assert.deepEqual(countReportsByStatus(phase0BDashboardSeed.reports), {
    Submitted: 4,
    "Under Review": 8,
    Verified: 6,
    Assigned: 4,
    Resolved: 3,
  });
});

test("severity counts sum to 25", () => {
  const counts = countReportsBySeverity(phase0BDashboardSeed.reports);
  assert.equal(counts.Low + counts.Medium + counts.High, 25);
});

test("location counts sum to 25", () => {
  const counts = countReportsByLocation(phase0BDashboardSeed.reports);
  assert.equal(
    Object.values(counts).reduce((total, count) => total + count, 0),
    25,
  );
  assert.equal(Object.keys(counts).length, 5);
});

test("hotspot summaries sum to 25", () => {
  const hotspots = derivePilotHotspots(
    phase0BDashboardSeed.reports,
    phase0BDashboardSeed.reportLocations,
  );
  assert.equal(hotspots.length, 5);
  assert.equal(
    hotspots.reduce((total, hotspot) => total + hotspot.reportCount, 0),
    25,
  );
});

test("Reports Under Review means exactly eight Under Review reports", () => {
  assert.equal(deriveReportsUnderReview(phase0BDashboardSeed.reports), 8);
});

test("narrated report lookup returns the canonical mobile-prototype record", () => {
  const report = findNarratedDemoReport(phase0BDashboardSeed);
  assert.ok(report);
  assert.equal(report.id, phase0BDashboardSeed.narratedReportId);
  assert.equal(report.source, "simulated_mobile_prototype_submission");
});

test("repeated derivation returns structurally identical output", () => {
  assert.deepEqual(
    deriveDashboardOverview(phase0BDashboardSeed),
    deriveDashboardOverview(phase0BDashboardSeed),
  );
  assert.deepEqual(
    deriveTripChainInsights(phase0BDashboardSeed),
    deriveTripChainInsights(phase0BDashboardSeed),
  );
});

test("analytics helpers do not mutate seed inputs", () => {
  const seed = cloneSeed();
  const before = structuredClone(seed);
  deriveDashboardOverview(seed);
  derivePilotHotspots(seed.reports, seed.reportLocations);
  deriveTripChainInsights(seed);
  findNarratedDemoReport(seed);
  assert.deepEqual(seed, before);
});

test("rate helpers handle zero and invalid denominators safely", () => {
  for (const result of [
    deriveVerifiedTripRate(0, 0),
    deriveRepeatParticipantRate(0, 0),
    deriveCampaignUtilization(0, 0),
    deriveVerifiedTripRate(10, Number.NaN),
  ]) {
    assert.equal(result, 0);
    assert.equal(Number.isFinite(result), true);
  }
});

test("invalid trip totals are reported", () => {
  const seed = cloneSeed();
  seed.trips.totalAttempts = 359;
  assertInvalidWith(seed, /outcomes must equal total attempts/i);
});

test("negative count values are reported", () => {
  const seed = cloneSeed();
  seed.participants.repeatParticipants = -1;
  assertInvalidWith(seed, /non-negative finite integer/i);
});

test("non-finite count values are reported", () => {
  const seed = cloneSeed();
  seed.participants.totalParticipants = Number.POSITIVE_INFINITY;
  assertInvalidWith(seed, /non-negative finite integer/i);
});

test("incorrect campaign utilization is reported", () => {
  const seed = cloneSeed();
  seed.campaign.utilizationPercent = 71;
  assertInvalidWith(seed, /utilization does not match/i);
});

test("duplicate report IDs are reported", () => {
  const seed = cloneSeed();
  seed.reports[1].id = seed.reports[0].id;
  assertInvalidWith(seed, /report IDs must be unique/i);
});

test("numeric CO2e while calibration is pending is reported", () => {
  const seed = cloneSeed();
  seed.metadata.co2e.valueKg = 1.25;
  assertInvalidWith(seed, /CO2e must remain null/i);
});

test("runtime validation rejects unknown report enums", () => {
  const categorySeed = cloneSeed();
  categorySeed.reports[0].category =
    "unknown_category" as AccessBarrierCategory;
  assertInvalidWith(categorySeed, /unknown category/i);

  const severitySeed = cloneSeed();
  severitySeed.reports[0].severity = "Critical" as ReportSeverity;
  assertInvalidWith(severitySeed, /unknown severity/i);

  const statusSeed = cloneSeed();
  statusSeed.reports[0].status = "Closed" as ReportStatus;
  assertInvalidWith(statusSeed, /unknown status/i);
});

test("runtime validation rejects reports outside approved locations", () => {
  const seed = cloneSeed();
  seed.reports[0].locationId = "unknown-location";
  assertInvalidWith(seed, /outside the approved access areas/i);
});

test("runtime validation rejects missing or altered narrated reports", () => {
  const missingSeed = cloneSeed();
  missingSeed.narratedReportId = "missing-report";
  assertInvalidWith(missingSeed, /must exist exactly once/i);

  const alteredSeed = cloneSeed();
  alteredSeed.reports[0].severity = "Low";
  assertInvalidWith(alteredSeed, /narrated dashboard report has incorrect/i);
});

test("runtime validation rejects invalid campaign allocation boundaries", () => {
  const allocationSeed = cloneSeed();
  allocationSeed.campaign.capModel.totalAllocationPoints = 11_999;
  assertInvalidWith(allocationSeed, /allocation must equal/i);

  const issuedSeed = cloneSeed();
  issuedSeed.campaign.pointsIssued = 12_001;
  assertInvalidWith(issuedSeed, /cannot exceed total allocation/i);
});

test("runtime validation rejects incorrect report count and distribution", () => {
  const countSeed = cloneSeed();
  countSeed.reports.pop();
  assertInvalidWith(countSeed, /exactly 25 reports/i);

  const distributionSeed = cloneSeed();
  distributionSeed.reports[0].status = "Under Review";
  assertInvalidWith(distributionSeed, /distribution is incorrect/i);
});
