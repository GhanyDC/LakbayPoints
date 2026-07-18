import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  formatRouteFare,
  getRouteTotals,
  phase0APilotRoute,
  phase0ARouteOptions,
  type RouteOption,
} from "../src/index";

const approvedModes = [
  "public_road_transport",
  "mrt",
  "walk",
  "ferry",
  "walk",
] as const;

test("final Phase 0A journey has five unique segments in the approved order", () => {
  assert.equal(phase0APilotRoute.segments.length, 5);
  assert.deepEqual(
    phase0APilotRoute.segments.map((segment) => segment.mode),
    approvedModes,
  );

  const segmentIds = phase0APilotRoute.segments.map((segment) => segment.id);
  assert.equal(new Set(segmentIds).size, segmentIds.length);
});

test("route totals are derived from travel, dwell, distance, and known fares", () => {
  const totals = getRouteTotals(phase0APilotRoute);
  const travelTime = phase0APilotRoute.segments.reduce(
    (sum, segment) => sum + (segment.travelTimeMin ?? 0),
    0,
  );
  const waitDwellTime = phase0APilotRoute.segments.reduce(
    (sum, segment) => sum + (segment.waitDwellTimeMin ?? 0),
    0,
  );
  const distance = phase0APilotRoute.segments.reduce(
    (sum, segment) => sum + (segment.distanceKm ?? 0),
    0,
  );
  const knownFare = phase0APilotRoute.segments.reduce(
    (sum, segment) => sum + (segment.farePhp ?? 0),
    0,
  );

  assert.equal(totals.travelTimeMin, travelTime);
  assert.equal(totals.waitDwellTimeMin, waitDwellTime);
  assert.equal(totals.totalTimeMin, travelTime + waitDwellTime);
  assert.equal(totals.totalTimeMin, 91);
  assert.ok(totals.distanceKm !== null);
  assert.ok(Math.abs(totals.distanceKm - distance) < 1e-9);
  assert.ok(Math.abs(totals.distanceKm - 14.1) < 1e-9);
  assert.equal(totals.knownFarePhp, knownFare);
  assert.equal(totals.knownFarePhp, 35);
});

test("pending ferry fare and CO2e calibration stay visible", () => {
  const ferry = phase0APilotRoute.segments.find(
    (segment) => segment.mode === "ferry",
  );
  const totals = getRouteTotals(phase0APilotRoute);

  assert.ok(ferry);
  assert.equal(ferry.farePhp, null);
  assert.equal(ferry.fareStatus, "pending_confirmation");
  assert.equal(ferry.fareDisplay, "To be confirmed");
  assert.equal(totals.hasPendingFare, true);
  assert.equal(formatRouteFare(phase0APilotRoute), "PHP 35 + ferry fare TBC");
  assert.equal(phase0APilotRoute.estimatedCo2eAvoidedKg, null);
  assert.equal(phase0APilotRoute.co2eMethodologyStatus, "pending_confirmation");
  assert.equal(phase0APilotRoute.co2eDisplay, "Pending pilot calibration");
});

test("only the recommended route can become reward eligible", () => {
  const baseline = phase0ARouteOptions.find(
    (route) => route.type === "private_baseline",
  );
  const futureRoutes = phase0ARouteOptions.filter(
    (route) => route.type === "phase2_preview",
  );

  assert.equal(phase0APilotRoute.rewardEligibility, "verification_required");
  assert.ok(baseline);
  assert.equal(baseline.rewardEligibility, "ineligible");
  assert.equal(getRouteTotals(baseline).totalTimeMin, null);
  assert.equal(getRouteTotals(baseline).distanceKm, null);
  assert.equal(baseline.estimatedCo2eAvoidedKg, null);
  assert.ok(futureRoutes.length > 0);
  for (const route of futureRoutes) {
    assert.equal(route.recommendationStatus, "future_preview");
    assert.match(route.dataStatusLabel, /future preview/i);
    assert.match(route.dataStatusLabel, /not live/i);
    assert.equal(route.rewardEligibility, "ineligible");
  }
});

test("the JSON route fixture is a validated mirror of shared TypeScript", () => {
  const fixtureUrl = new URL(
    "../../../data/routes/phase-0a-multimodal-pilot-routes.json",
    import.meta.url,
  );
  const fixture = JSON.parse(readFileSync(fixtureUrl, "utf8")) as RouteOption[];

  assert.deepEqual(fixture, phase0ARouteOptions);
});
