import assert from "node:assert/strict";
import test from "node:test";

import {
  classifySustainableTripChain,
  phase0ARouteOptions,
  suspiciousPhase0AMultimodalTrace,
  validPhase0AMultimodalTrace,
} from "../src/index";

test("shared test harness runs the current classifier fixtures", () => {
  const route = phase0ARouteOptions.find(
    (candidate) => candidate.type === "sustainable",
  );

  assert.ok(route, "Expected the current sustainable route fixture");

  const validResult = classifySustainableTripChain({
    selectedRoute: route,
    gpsTrace: validPhase0AMultimodalTrace,
  });
  const suspiciousResult = classifySustainableTripChain({
    selectedRoute: route,
    gpsTrace: suspiciousPhase0AMultimodalTrace,
  });

  assert.equal(validResult.rewardEligibility, "Full");
  assert.equal(suspiciousResult.rewardEligibility, "None");
});
