import assert from "node:assert/strict";
import test from "node:test";

import {
  DASHBOARD_REPORT_CATEGORY_LABELS,
  PHASE_0B_DASHBOARD_DISCLOSURE,
  countReportsByStatus,
  phase0BDashboardSeed,
  validateDashboardSeed,
  type AccessBarrierCategory,
  type ReportSeverity,
  type ReportStatus,
} from "../src/index";

const approvedLocationLabels = new Set([
  "MRT-3 Araneta-Cubao access area",
  "MRT-3 Guadalupe access area",
  "Guadalupe Ferry access area",
  "Hulo Ferry access area",
  "Hulo office last-mile access area",
]);
const approvedCategories = new Set<AccessBarrierCategory>([
  "sidewalk_obstruction",
  "unsafe_crossing",
  "flooding",
  "illegal_parking_or_loading_obstruction",
  "damaged_walkway_or_access_path",
]);
const approvedSeverities = new Set<ReportSeverity>(["Low", "Medium", "High"]);
const approvedStatuses = new Set<ReportStatus>([
  "Submitted",
  "Under Review",
  "Verified",
  "Assigned",
  "Resolved",
]);

test("participant count is 120", () => {
  assert.equal(phase0BDashboardSeed.participants.totalParticipants, 120);
});

test("repeat participants are 84", () => {
  assert.equal(phase0BDashboardSeed.participants.repeatParticipants, 84);
});

test("repeat participant rate is 70 percent", () => {
  assert.equal(
    phase0BDashboardSeed.participants.repeatParticipantRatePercent,
    70,
  );
});

test("total trip attempts are 360", () => {
  assert.equal(phase0BDashboardSeed.trips.totalAttempts, 360);
});

test("fully verified trips are 288", () => {
  assert.equal(phase0BDashboardSeed.trips.verification.fullyVerified, 288);
});

test("partially verified trips are 36", () => {
  assert.equal(phase0BDashboardSeed.trips.verification.partiallyVerified, 36);
});

test("suspicious or rejected trips are 36", () => {
  assert.equal(
    phase0BDashboardSeed.trips.verification.suspiciousOrRejected,
    36,
  );
});

test("trip verification outcomes sum to 360", () => {
  const breakdown = phase0BDashboardSeed.trips.verification;
  assert.equal(
    breakdown.fullyVerified +
      breakdown.partiallyVerified +
      breakdown.suspiciousOrRejected,
    360,
  );
});

test("verified trip rate is 80 percent", () => {
  assert.equal(phase0BDashboardSeed.trips.verifiedTripRatePercent, 80);
});

test("individual campaign cap is 100 Points", () => {
  assert.equal(phase0BDashboardSeed.campaign.capModel.individualCapPoints, 100);
});

test("campaign allocation is 12,000 Points", () => {
  assert.equal(
    phase0BDashboardSeed.campaign.capModel.totalAllocationPoints,
    12_000,
  );
});

test("campaign Points issued are 8,640", () => {
  assert.equal(phase0BDashboardSeed.campaign.pointsIssued, 8_640);
});

test("campaign utilization is 72 percent", () => {
  assert.equal(phase0BDashboardSeed.campaign.utilizationPercent, 72);
});

test("CO2e numeric value is null", () => {
  assert.equal(phase0BDashboardSeed.metadata.co2e.valueKg, null);
});

test("CO2e display remains Pending pilot calibration", () => {
  assert.equal(
    phase0BDashboardSeed.metadata.co2e.display,
    "Pending pilot calibration",
  );
});

test("exactly 25 reports exist", () => {
  assert.equal(phase0BDashboardSeed.reports.length, 25);
});

test("report IDs are unique", () => {
  const ids = phase0BDashboardSeed.reports.map((report) => report.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("report status counts are 4, 8, 6, 4, and 3", () => {
  assert.deepEqual(countReportsByStatus(phase0BDashboardSeed.reports), {
    Submitted: 4,
    "Under Review": 8,
    Verified: 6,
    Assigned: 4,
    Resolved: 3,
  });
});

test("all reports use the five approved access-area locations", () => {
  for (const report of phase0BDashboardSeed.reports) {
    assert.equal(approvedLocationLabels.has(report.locationLabel), true);
  }
  assert.equal(
    new Set(phase0BDashboardSeed.reports.map((report) => report.locationLabel))
      .size,
    5,
  );
});

test("all reports use approved categories, labels, severities, and statuses", () => {
  for (const report of phase0BDashboardSeed.reports) {
    assert.equal(approvedCategories.has(report.category), true);
    assert.equal(
      report.categoryLabel,
      DASHBOARD_REPORT_CATEGORY_LABELS[report.category],
    );
    assert.equal(approvedSeverities.has(report.severity), true);
    assert.equal(approvedStatuses.has(report.status), true);
  }
});

test("narrated report exists exactly once", () => {
  assert.equal(
    phase0BDashboardSeed.reports.filter(
      (report) => report.id === phase0BDashboardSeed.narratedReportId,
    ).length,
    1,
  );
});

test("narrated report is the High unsafe crossing at Araneta-Cubao", () => {
  const narrated = phase0BDashboardSeed.reports.find(
    (report) => report.id === phase0BDashboardSeed.narratedReportId,
  );
  assert.ok(narrated);
  assert.equal(narrated.category, "unsafe_crossing");
  assert.equal(narrated.categoryLabel, "Unsafe crossing");
  assert.equal(narrated.severity, "High");
  assert.equal(narrated.locationLabel, "MRT-3 Araneta-Cubao access area");
  assert.equal(narrated.status, "Submitted");
  assert.equal(narrated.source, "simulated_mobile_prototype_submission");
  assert.equal(narrated.simulatedData, true);
});

test("disclosure clearly identifies deterministic simulated prototype data", () => {
  assert.equal(
    phase0BDashboardSeed.metadata.disclosure.statement,
    PHASE_0B_DASHBOARD_DISCLOSURE,
  );
  assert.match(PHASE_0B_DASHBOARD_DISCLOSURE, /deterministic simulated/i);
  assert.match(PHASE_0B_DASHBOARD_DISCLOSURE, /prototype data/i);
});

test("disclosure explicitly denies live MMDA and commuter connections", () => {
  const disclosure = phase0BDashboardSeed.metadata.disclosure;
  assert.equal(disclosure.liveMmdaConnected, false);
  assert.equal(disclosure.liveCommuterDataConnected, false);
  assert.match(disclosure.statement, /No live MMDA system or commuter data/i);
});

test("canonical dashboard seed passes validation", () => {
  assert.deepEqual(validateDashboardSeed(phase0BDashboardSeed), {
    valid: true,
    errors: [],
  });
});
