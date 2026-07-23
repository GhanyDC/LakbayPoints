import { REPORT_STATUS_WORKFLOW } from "./dashboard-analytics";
import type {
  DashboardAccessBarrierReport,
  ReportStatusTransitionResult,
} from "./dashboard-types";
import type { ReportStatus } from "./types";

export function getNextReportStatus(
  currentStatus: ReportStatus,
): ReportStatus | null {
  const currentIndex = REPORT_STATUS_WORKFLOW.indexOf(currentStatus);
  if (currentIndex < 0 || currentIndex === REPORT_STATUS_WORKFLOW.length - 1) {
    return null;
  }

  return REPORT_STATUS_WORKFLOW[currentIndex + 1];
}

export function canTransitionReportStatus(
  currentStatus: ReportStatus,
  requestedStatus: ReportStatus,
): boolean {
  return (
    currentStatus === requestedStatus ||
    getNextReportStatus(currentStatus) === requestedStatus
  );
}

export function applyReportStatusTransition(
  reports: readonly DashboardAccessBarrierReport[],
  reportId: string,
  requestedStatus: ReportStatus,
): ReportStatusTransitionResult {
  const report = reports.find((candidate) => candidate.id === reportId);
  if (!report) {
    return {
      ok: false,
      outcome: "report_not_found",
      reportId,
      requestedStatus,
      reports: [...reports],
      message: `Simulated report ${reportId} was not found. No local status changed.`,
    };
  }

  const transition = { from: report.status, to: requestedStatus };
  if (report.status === requestedStatus) {
    return {
      ok: true,
      outcome: "no_op",
      transition,
      report,
      reports: [...reports],
      message: `Simulated report ${reportId} already has status ${requestedStatus}.`,
    };
  }

  if (!canTransitionReportStatus(report.status, requestedStatus)) {
    return {
      ok: false,
      outcome: "invalid_transition",
      transition,
      reports: [...reports],
      message: `Simulated report status can only move from ${report.status} to its immediate next status. No local status changed.`,
    };
  }

  const updatedReport: DashboardAccessBarrierReport = {
    ...report,
    status: requestedStatus,
  };
  const updatedReports = reports.map((candidate) =>
    candidate.id === reportId ? updatedReport : candidate,
  );

  return {
    ok: true,
    outcome: "success",
    transition,
    report: updatedReport,
    reports: updatedReports,
    message: `Simulated report ${reportId} moved locally to ${requestedStatus}. This change is not persisted or sent to an agency.`,
  };
}
