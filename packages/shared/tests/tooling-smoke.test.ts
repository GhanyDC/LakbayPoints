import assert from "node:assert/strict";
import test from "node:test";

import {
  classifySustainableTripChain,
  guadalupeCubaoRoutes,
  suspiciousTraceRejected,
  validSustainableGuadalupeCubaoTrace,
} from "../src/index";

test("shared test harness runs the current classifier fixtures", () => {
  const route = guadalupeCubaoRoutes.find(
    (candidate) => candidate.type === "sustainable",
  );

  assert.ok(route, "Expected the current sustainable route fixture");

  const validResult = classifySustainableTripChain({
    selectedRoute: route,
    gpsTrace: validSustainableGuadalupeCubaoTrace,
  });
  const suspiciousResult = classifySustainableTripChain({
    selectedRoute: route,
    gpsTrace: suspiciousTraceRejected,
  });

  assert.equal(validResult.rewardEligibility, "Full");
  assert.equal(suspiciousResult.rewardEligibility, "None");
});
