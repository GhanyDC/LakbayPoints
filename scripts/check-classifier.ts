import { strict as assert } from "assert";
import { classifySustainableTripChain } from "../packages/shared/src/classifier";
import { phase0ARouteOptions } from "../packages/shared/src/routes";
import type { GpsTracePoint } from "../packages/shared/src/types";
import suspiciousTrace from "../data/traces/suspicious_phase_0a_multimodal_trace.json";
import validTrace from "../data/traces/valid_phase_0a_multimodal_trace.json";

const sustainableRoute = phase0ARouteOptions.find(
  (route) => route.type === "sustainable",
);

if (!sustainableRoute) {
  throw new Error("Expected sustainable route fixture");
}

const validResult = classifySustainableTripChain({
  selectedRoute: sustainableRoute,
  gpsTrace: validTrace as GpsTracePoint[],
});
const suspiciousResult = classifySustainableTripChain({
  selectedRoute: sustainableRoute,
  gpsTrace: suspiciousTrace as GpsTracePoint[],
});

assert.equal(
  validResult.result,
  "Verified sustainable trip chain",
  "Valid trace should verify",
);
assert.equal(
  validResult.rewardEligibility,
  "Full",
  "Valid trace should have full reward eligibility",
);
assert.ok(
  validResult.confidenceScore >= 80 && validResult.confidenceScore <= 95,
  "Valid confidence score should be within 80-95",
);
assert.ok(
  ["Suspicious pattern", "Unverified trip"].includes(suspiciousResult.result),
  "Suspicious trace should be rejected or marked suspicious",
);
assert.equal(
  suspiciousResult.rewardEligibility,
  "None",
  "Suspicious trace should have no reward eligibility",
);
assert.ok(
  validResult.confidenceScore >= 0 &&
    validResult.confidenceScore <= 100 &&
    suspiciousResult.confidenceScore >= 0 &&
    suspiciousResult.confidenceScore <= 100,
  "Confidence scores should stay within 0-100",
);

console.log("Classifier check passed");
console.log(
  `Valid trace: ${validResult.confidenceScore}% - ${validResult.result} - ${validResult.rewardEligibility}`,
);
console.log(
  `Suspicious trace: ${suspiciousResult.confidenceScore}% - ${suspiciousResult.result} - ${suspiciousResult.rewardEligibility}`,
);
