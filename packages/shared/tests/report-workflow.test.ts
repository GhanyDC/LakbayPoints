import assert from "node:assert/strict";
import test from "node:test";

import {
  applyReportStatusTransition,
  canTransitionReportStatus,
  countReportsByStatus,
  getNextReportStatus,
  phase0BDashboardSeed,
  type DashboardAccessBarrierReport,
  type ReportStatus,
} from "../src/index";

function reportWithStatus(status: ReportStatus): DashboardAccessBarrierReport {
  const report = phase0BDashboardSeed.reports.find(
    (candidate) => candidate.status === status,
  );
  assert.ok(report);
  return report;
}

function assertSuccessfulTransition(
  from: ReportStatus,
  to: ReportStatus,
): void {
  const report = reportWithStatus(from);
  const result = applyReportStatusTransition(
    phase0BDashboardSeed.reports,
    report.id,
    to,
  );
  assert.equal(result.ok, true);
  assert.equal(result.outcome, "success");
  assert.equal(result.report.status, to);
  assert.deepEqual(result.transition, { from, to });
}

test("Submitted can move to Under Review", () => {
  assertSuccessfulTransition("Submitted", "Under Review");
});

test("Under Review can move to Verified", () => {
  assertSuccessfulTransition("Under Review", "Verified");
});

test("Verified can move to Assigned", () => {
  assertSuccessfulTransition("Verified", "Assigned");
});

test("Assigned can move to Resolved", () => {
  assertSuccessfulTransition("Assigned", "Resolved");
});

test("Resolved has no next status", () => {
  assert.equal(getNextReportStatus("Resolved"), null);
});

test("backward report transition fails", () => {
  const report = reportWithStatus("Verified");
  const result = applyReportStatusTransition(
    phase0BDashboardSeed.reports,
    report.id,
    "Under Review",
  );
  assert.equal(result.ok, false);
  assert.equal(result.outcome, "invalid_transition");
});

test("skipped report transition fails", () => {
  const report = reportWithStatus("Submitted");
  const result = applyReportStatusTransition(
    phase0BDashboardSeed.reports,
    report.id,
    "Verified",
  );
  assert.equal(result.ok, false);
  assert.equal(result.outcome, "invalid_transition");
});

test("same-status transition returns a no-op", () => {
  const report = reportWithStatus("Under Review");
  const result = applyReportStatusTransition(
    phase0BDashboardSeed.reports,
    report.id,
    "Under Review",
  );
  assert.equal(result.ok, true);
  assert.equal(result.outcome, "no_op");
});

test("unknown report ID fails safely", () => {
  const result = applyReportStatusTransition(
    phase0BDashboardSeed.reports,
    "unknown-report",
    "Under Review",
  );
  assert.equal(result.ok, false);
  assert.equal(result.outcome, "report_not_found");
  assert.deepEqual(result.reports, phase0BDashboardSeed.reports);
});

test("successful transition returns a new report collection", () => {
  const report = reportWithStatus("Submitted");
  const result = applyReportStatusTransition(
    phase0BDashboardSeed.reports,
    report.id,
    "Under Review",
  );
  assert.notEqual(result.reports, phase0BDashboardSeed.reports);
});

test("successful transition does not mutate source reports", () => {
  const before = structuredClone(phase0BDashboardSeed.reports);
  const report = reportWithStatus("Submitted");
  applyReportStatusTransition(
    phase0BDashboardSeed.reports,
    report.id,
    "Under Review",
  );
  assert.deepEqual(phase0BDashboardSeed.reports, before);
});

test("unrelated reports remain unchanged", () => {
  const target = reportWithStatus("Submitted");
  const unrelated = phase0BDashboardSeed.reports.find(
    (report) => report.id !== target.id,
  );
  assert.ok(unrelated);
  const result = applyReportStatusTransition(
    phase0BDashboardSeed.reports,
    target.id,
    "Under Review",
  );
  const resultingUnrelated = result.reports.find(
    (report) => report.id === unrelated.id,
  );
  assert.equal(resultingUnrelated, unrelated);
});

test("status counts can be recalculated after a transition", () => {
  const target = reportWithStatus("Submitted");
  const result = applyReportStatusTransition(
    phase0BDashboardSeed.reports,
    target.id,
    "Under Review",
  );
  assert.deepEqual(countReportsByStatus(result.reports), {
    Submitted: 3,
    "Under Review": 9,
    Verified: 6,
    Assigned: 4,
    Resolved: 3,
  });
});

test("Submitted count decreases after narrated-report transition", () => {
  const result = applyReportStatusTransition(
    phase0BDashboardSeed.reports,
    phase0BDashboardSeed.narratedReportId,
    "Under Review",
  );
  assert.equal(countReportsByStatus(result.reports).Submitted, 3);
});

test("Under Review count increases after narrated-report transition", () => {
  const result = applyReportStatusTransition(
    phase0BDashboardSeed.reports,
    phase0BDashboardSeed.narratedReportId,
    "Under Review",
  );
  assert.equal(countReportsByStatus(result.reports)["Under Review"], 9);
});

test("transition predicate accepts only same or immediate next status", () => {
  assert.equal(canTransitionReportStatus("Submitted", "Submitted"), true);
  assert.equal(canTransitionReportStatus("Submitted", "Under Review"), true);
  assert.equal(canTransitionReportStatus("Submitted", "Verified"), false);
  assert.equal(canTransitionReportStatus("Verified", "Under Review"), false);
});
