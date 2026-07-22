import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  classifySustainableTripChain,
  phase0AMultimodalVerificationProfile,
  phase0APilotRoute,
  phase0ARouteOptions,
  suspiciousPhase0AMultimodalTrace,
  validPhase0AMultimodalTrace,
  type GpsTracePoint,
  type RouteOption,
} from "../src/index";

function cloneValidTrace(): GpsTracePoint[] {
  return validPhase0AMultimodalTrace.map((point) => ({ ...point }));
}

function classify(
  gpsTrace: GpsTracePoint[],
  selectedRoute: RouteOption | string = phase0APilotRoute,
) {
  return classifySustainableTripChain({ selectedRoute, gpsTrace });
}

function assertRejectedForInvalidTrace(result: ReturnType<typeof classify>) {
  assert.equal(result.confidenceScore, 0);
  assert.equal(result.result, "Unverified trip");
  assert.equal(result.rewardEligibility, "None");
  assert.match(result.explanation.join(" "), /invalid trace data/i);
}

test("final route profile binds all five modes and ordered access locations", () => {
  assert.equal(
    phase0AMultimodalVerificationProfile.routeId,
    phase0APilotRoute.id,
  );
  assert.deepEqual(
    phase0AMultimodalVerificationProfile.orderedSegmentModes,
    phase0APilotRoute.segments.map((segment) => segment.mode),
  );
  assert.equal(
    phase0AMultimodalVerificationProfile.expectedStartAccessZone.accessPointId,
    phase0APilotRoute.originAccessPointId,
  );
  assert.equal(
    phase0AMultimodalVerificationProfile.expectedEndAccessZone.accessPointId,
    phase0APilotRoute.destinationAccessPointId,
  );
  assert.equal(
    phase0AMultimodalVerificationProfile.expectedTransferAccessLocations.length,
    4,
  );
});

test("valid generated final-route trace verifies with Full eligibility", () => {
  const result = classify(validPhase0AMultimodalTrace);

  assert.equal(result.result, "Verified sustainable trip chain");
  assert.equal(result.rewardEligibility, "Full");
  assert.ok(result.confidenceScore >= 80 && result.confidenceScore <= 95);
  assert.equal(result.signals.walkingSegmentsDetected, true);
  assert.equal(result.signals.stationDwellDetected, true);
});

test("suspicious generated final-route trace is rejected", () => {
  const result = classify(suspiciousPhase0AMultimodalTrace);

  assert.equal(result.result, "Suspicious pattern");
  assert.equal(result.rewardEligibility, "None");
  assert.equal(result.signals.impossibleMovementDetected, true);
});

test("empty trace fails closed", () => {
  assertRejectedForInvalidTrace(classify([]));
});

test("null point fails closed without throwing", () => {
  const trace = cloneValidTrace() as Array<GpsTracePoint | null>;
  trace[4] = null;

  assertRejectedForInvalidTrace(classify(trace as GpsTracePoint[]));
});

test("malformed timestamp fails closed", () => {
  const trace = cloneValidTrace();
  trace[4].timestamp = "not-a-date";

  assertRejectedForInvalidTrace(classify(trace));
});

test("duplicate timestamp fails closed", () => {
  const trace = cloneValidTrace();
  trace[4].timestamp = trace[3].timestamp;

  assertRejectedForInvalidTrace(classify(trace));
});

test("reversed timestamp fails closed", () => {
  const trace = cloneValidTrace();
  trace[4].timestamp = "2026-07-20T00:08:00.000Z";

  assertRejectedForInvalidTrace(classify(trace));
});

test("invalid latitude and longitude fail closed", () => {
  for (const invalidPoint of [
    { latitude: 91 },
    { latitude: Number.NaN },
    { longitude: 181 },
    { longitude: Number.POSITIVE_INFINITY },
  ]) {
    const trace = cloneValidTrace();
    trace[4] = { ...trace[4], ...invalidPoint };
    assertRejectedForInvalidTrace(classify(trace));
  }
});

test("negative and non-finite speeds fail closed", () => {
  for (const speedKph of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
    const trace = cloneValidTrace();
    trace[4].speedKph = speedKph;
    assertRejectedForInvalidTrace(classify(trace));
  }
});

test("unsupported activity fails closed", () => {
  const trace = cloneValidTrace();
  trace[4].activity = "cycling" as GpsTracePoint["activity"];

  assertRejectedForInvalidTrace(classify(trace));
});

test("unknown route ID fails closed without fallback", () => {
  const result = classify(validPhase0AMultimodalTrace, "unknown-route");

  assert.equal(result.confidenceScore, 0);
  assert.equal(result.rewardEligibility, "None");
  assert.match(result.explanation.join(" "), /unknown/i);
});

test("private baseline and future preview routes fail closed", () => {
  const privateBaseline = phase0ARouteOptions.find(
    (route) => route.type === "private_baseline",
  );
  const futurePreview = phase0ARouteOptions.find(
    (route) => route.type === "phase2_preview",
  );
  assert.ok(privateBaseline);
  assert.ok(futurePreview);

  for (const route of [privateBaseline, futurePreview]) {
    const result = classify(validPhase0AMultimodalTrace, route);
    assert.equal(result.confidenceScore, 0);
    assert.equal(result.rewardEligibility, "None");
  }
});

test("a stopped vehicle is not treated as walking", () => {
  const trace = cloneValidTrace().map((point) =>
    point.activity === "walking"
      ? { ...point, speedKph: 0, activity: "still" as const }
      : point,
  );
  const result = classify(trace);

  assert.equal(result.signals.walkingSegmentsDetected, false);
  assert.equal(result.rewardEligibility, "None");
});

test("missing Guadalupe MRT-to-ferry walking evidence receives no reward", () => {
  const walkStart = Date.parse("2026-07-20T00:39:00.000Z");
  const walkEnd = Date.parse("2026-07-20T00:54:00.000Z");
  const trace = cloneValidTrace().map((point) => {
    const timestamp = Date.parse(point.timestamp);
    return timestamp > walkStart && timestamp <= walkEnd
      ? { ...point, speedKph: 0, activity: "still" as const }
      : point;
  });
  const result = classify(trace);

  assert.equal(result.signals.walkingSegmentsDetected, false);
  assert.equal(result.rewardEligibility, "None");
});

test("missing Hulo last-mile walking evidence receives no reward", () => {
  const walkStart = Date.parse("2026-07-20T01:16:00.000Z");
  const trace = cloneValidTrace().map((point) =>
    Date.parse(point.timestamp) > walkStart
      ? { ...point, speedKph: 0, activity: "still" as const }
      : point,
  );
  const result = classify(trace);

  assert.equal(result.signals.walkingSegmentsDetected, false);
  assert.equal(result.rewardEligibility, "None");
});

test("route mismatch receives no reward", () => {
  const trace = cloneValidTrace().map((point) => ({
    ...point,
    latitude: point.latitude + 0.2,
  }));
  const result = classify(trace);

  assert.equal(result.signals.routeMatch, false);
  assert.equal(result.rewardEligibility, "None");
});

test("classification is deterministic across repeated calls", () => {
  const first = classify(validPhase0AMultimodalTrace);
  const second = classify(validPhase0AMultimodalTrace);

  assert.deepEqual(second, first);
});

test("JSON trace fixtures mirror the generated TypeScript fixtures", () => {
  const validFixture = JSON.parse(
    readFileSync(
      new URL(
        "../../../data/traces/valid_phase_0a_multimodal_trace.json",
        import.meta.url,
      ),
      "utf8",
    ),
  ) as GpsTracePoint[];
  const suspiciousFixture = JSON.parse(
    readFileSync(
      new URL(
        "../../../data/traces/suspicious_phase_0a_multimodal_trace.json",
        import.meta.url,
      ),
      "utf8",
    ),
  ) as GpsTracePoint[];

  assert.deepEqual(validFixture, validPhase0AMultimodalTrace);
  assert.deepEqual(suspiciousFixture, suspiciousPhase0AMultimodalTrace);
});
