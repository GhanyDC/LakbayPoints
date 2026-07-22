import assert from "node:assert/strict";
import test from "node:test";

import {
  deriveDashboardOverview,
  phase0APilotRoute,
  phase0BDashboardSeed,
  type DashboardSeedData,
} from "@lakbaypoints/shared";
import { renderToStaticMarkup } from "react-dom/server";

import DashboardPage from "../app/page";
import {
  createDashboardOverviewViewModel,
  dashboardOverviewViewModel,
} from "../lib/dashboard-overview";

const expectedMetricIds = [
  "verified_sustainable_trips",
  "access_barrier_reports",
  "reports_under_review",
  "estimated_co2e_avoided",
  "campaign_points_issued",
  "repeat_sustainable_trip_users",
];
const markup = renderToStaticMarkup(<DashboardPage />);

function metric(id: (typeof expectedMetricIds)[number]) {
  const result = dashboardOverviewViewModel.metrics.find(
    (candidate) => candidate.id === id,
  );
  assert.ok(result);
  return result;
}

test("view model exposes exactly six overview metrics", () => {
  assert.equal(dashboardOverviewViewModel.metrics.length, 6);
});

test("overview metrics retain the approved pitch order", () => {
  assert.deepEqual(
    dashboardOverviewViewModel.metrics.map((item) => item.id),
    expectedMetricIds,
  );
});

test("overview values match the public shared derivation", () => {
  const derived = deriveDashboardOverview(phase0BDashboardSeed);
  assert.deepEqual(
    dashboardOverviewViewModel.metrics.map((item) => item.displayValue),
    derived.metrics.map((item) => item.displayValue),
  );
});

test("overview values respond to shared seed inputs", () => {
  const changedSeed = structuredClone(
    phase0BDashboardSeed,
  ) as DashboardSeedData;
  changedSeed.trips.verification.fullyVerified = 125;
  changedSeed.trips.totalAttempts = 250;
  changedSeed.trips.verifiedTripRatePercent = 50;

  const changed = createDashboardOverviewViewModel(
    changedSeed,
    phase0APilotRoute,
  );
  assert.equal(changed.metrics[0].displayValue, "125");
  assert.equal(
    changed.metrics[0].supportingText,
    "50% of 250 simulated trip attempts",
  );
});

test("title and subtitle come from shared dashboard metadata", () => {
  assert.equal(
    dashboardOverviewViewModel.title,
    phase0BDashboardSeed.metadata.title,
  );
  assert.equal(
    dashboardOverviewViewModel.subtitle,
    phase0BDashboardSeed.metadata.subtitle,
  );
});

test("product message is exact", () => {
  assert.equal(
    dashboardOverviewViewModel.productMessage,
    "Guide the Trip. Verify the Shift. Improve Access.",
  );
});

test("disclosure is the exact shared disclosure", () => {
  assert.equal(
    dashboardOverviewViewModel.disclosure,
    phase0BDashboardSeed.metadata.disclosure.statement,
  );
});

test("route context follows every shared access point in order", () => {
  let priorIndex = -1;
  for (const accessPoint of phase0APilotRoute.accessPoints) {
    const currentIndex = dashboardOverviewViewModel.routeContext.indexOf(
      accessPoint.label,
    );
    assert.ok(currentIndex > priorIndex);
    priorIndex = currentIndex;
  }
});

test("seed version and review date come from shared metadata", () => {
  assert.equal(
    dashboardOverviewViewModel.seedVersion,
    phase0BDashboardSeed.metadata.seedVersion,
  );
  assert.equal(
    dashboardOverviewViewModel.reviewedDate,
    phase0BDashboardSeed.metadata.reviewedDate,
  );
});

test("verified-trip card explains the shared rate and denominator", () => {
  assert.equal(
    metric("verified_sustainable_trips").supportingText,
    "80% of 360 simulated trip attempts",
  );
  assert.equal(metric("verified_sustainable_trips").tone, "primary");
});

test("report card states the five final-route access areas", () => {
  assert.equal(
    metric("access_barrier_reports").supportingText,
    "Across five final-route access areas",
  );
});

test("under-review card uses the exact status interpretation", () => {
  const underReview = metric("reports_under_review");
  assert.equal(
    underReview.supportingText,
    "Exact current status: Under Review",
  );
  assert.match(
    underReview.definition,
    /Submitted, Verified, Assigned, and Resolved/,
  );
});

test("CO2e remains pending without a numeric value or unit", () => {
  const co2e = metric("estimated_co2e_avoided");
  assert.equal(co2e.displayValue, "Pending pilot calibration");
  assert.equal(co2e.unit, null);
  assert.equal(co2e.tone, "pending");
});

test("campaign card explains utilization and allocation", () => {
  assert.equal(
    metric("campaign_points_issued").supportingText,
    "72% of the 12,000-Point simulated campaign allocation",
  );
});

test("campaign card denies redemption and financial value", () => {
  assert.match(
    metric("campaign_points_issued").definition,
    /no redemption or financial value/i,
  );
});

test("repeat-user card explains the shared rate and denominator", () => {
  assert.equal(
    metric("repeat_sustainable_trip_users").supportingText,
    "70% of 120 simulated participants",
  );
});

test("repeat-user definition is exact", () => {
  assert.equal(
    metric("repeat_sustainable_trip_users").definition,
    "At least two fully verified qualifying trips in the simulated campaign window.",
  );
});

test("rendered page has exactly one level-one heading", () => {
  assert.equal(markup.match(/<h1/g)?.length, 1);
  assert.equal(markup.match(/<\/h1>/g)?.length, 1);
});

test("rendered page includes the approved title and subtitle", () => {
  assert.match(markup, /LakbayPoints Agency Mobility Insights/);
  assert.match(markup, /Simulated Phase 0B Pilot Dashboard/);
});

test("rendered page includes every approved metric result", () => {
  for (const value of ["288", "25", "8", "8,640", "84"]) {
    assert.ok(markup.includes(`>${value}</p>`));
  }
  assert.match(markup, />Pending pilot calibration<\/p>/);
});

test("rendered page exposes six semantic metric list items", () => {
  assert.equal(markup.match(/class="metric-card /g)?.length, 6);
  assert.match(markup, /<ol[^>]+aria-label="Phase 0B overview metrics"/);
});

test("rendered page includes the exact disclosure near the page start", () => {
  const disclosureIndex = markup.indexOf(
    phase0BDashboardSeed.metadata.disclosure.statement,
  );
  const titleIndex = markup.indexOf(phase0BDashboardSeed.metadata.title);
  assert.ok(disclosureIndex >= 0);
  assert.ok(disclosureIndex < titleIndex);
});

test("rendered metric labels remain in pitch order", () => {
  let priorIndex = -1;
  for (const item of deriveDashboardOverview(phase0BDashboardSeed).metrics) {
    const currentIndex = markup.indexOf(item.label);
    assert.ok(currentIndex > priorIndex);
    priorIndex = currentIndex;
  }
});

test("rendered page states local reset, calibration, and integration limits", () => {
  assert.match(markup, /local to the browser and resets on reload/i);
  assert.match(markup, /CO2e methodology is pending pilot calibration/i);
  assert.match(
    markup,
    /No backend, live commuter feed, or live MMDA integration/i,
  );
});

test("rendered page contains no report workflow controls", () => {
  assert.doesNotMatch(markup, /<button|<form|<input|<select/);
  assert.doesNotMatch(markup, /Move to Under Review|Reset simulated demo/);
});

test("rendered copy makes no operational or official claim", () => {
  assert.doesNotMatch(
    markup,
    /official dashboard|real-time|agency dispatch|enforcement control|operational integration/i,
  );
});

test("rendered page has no financial or carbon-credit controls", () => {
  assert.doesNotMatch(
    markup,
    /wallet|cash control|carbon-credit|payment control/i,
  );
  assert.doesNotMatch(markup, /<button|<form|<input|<select/);
});

test("rendered page contains no future workstream sections", () => {
  assert.doesNotMatch(
    markup,
    /Report queue|hotspot schematic|Trip detail|Campaign detail/i,
  );
});

test("obsolete dashboard starter copy is absent", () => {
  assert.doesNotMatch(
    markup,
    /MMDA Dashboard|EDSA-MRT3 Guadalupe to Cubao|dashboard foundation/i,
  );
});

test("server rendering is deterministic across repeated runs", () => {
  assert.equal(renderToStaticMarkup(<DashboardPage />), markup);
});
