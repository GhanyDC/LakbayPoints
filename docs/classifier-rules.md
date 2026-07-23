# Sustainable Trip Chain Classifier Rules

## Purpose and Limitation

The Phase 0A Sustainable Trip Chain Classifier is a deterministic, rule-based
confidence engine. It verifies whether a generated prototype trace reasonably
matches the selected sustainable route. It is not full GIS map matching, live
GPS capture, or a trained mode-detection model.

> The prototype does not rely on one signal and does not claim perfect mode
> detection. A formal pilot must collect labeled, consented local traces to
> calibrate thresholds and measure false-positive and false-negative rates.

## Eligible Route and Verification Profile

Classification fails closed unless the selected route:

- exists in the shared route catalog;
- has type `sustainable`;
- has reward eligibility `verification_required`; and
- has an exact `RouteVerificationProfile` keyed by its route ID.

The active profile is `phase-0a-multimodal-pilot-route`. It expects this order:

1. public-road transport from Cubao Home/Access Zone to MRT-3 Araneta-Cubao;
2. MRT-3 from Araneta-Cubao to Guadalupe;
3. walk from Guadalupe MRT to Guadalupe Ferry;
4. ferry from Guadalupe Ferry to Hulo Ferry; and
5. walk from Hulo Ferry to Hulo Office Demo Destination.

The profile stores the expected start, end, and four transfer/access locations;
prototype proximity thresholds; plausible movement-speed ranges; minimum point
count; strict chronology requirements; required dwell; both walking
requirements; and impossible-movement thresholds. This is coarse route-bound
verification, not street-level or river-geometry map matching.

Unknown route IDs, private baselines, future previews, and routes without an
eligible profile return 0 confidence and `None` reward eligibility. There is no
sustainable-route fallback.

## Input Validation

Validation runs before scoring. A trace is rejected safely when:

- the trace is not an array or has fewer than the profile's 20 points;
- a point is null or malformed;
- a timestamp is missing, unparseable, duplicated, reversed, or otherwise not
  strictly increasing;
- latitude or longitude is non-finite or outside valid coordinate ranges;
- an optional speed is non-finite or negative; or
- an activity is outside `walking`, `still`, `in_vehicle`, and `unknown`.

Invalid trace data does not throw. It returns `Unverified trip`, confidence 0,
reward eligibility `None`, and an explanation beginning with
`Invalid trace data`.

## Route-Bound Signals

### Route match and proximity

The trace must visit the start, four transfer/access points, and destination in
the profile's order. The first and last points and every required transfer must
also be within their profile thresholds.

### Speed pattern

Each segment needs movement within the profile range for its mode family.
Reported speeds and point-to-point computed speeds are checked. Excessive speed
or a multi-kilometer jump in a short interval marks impossible movement.

### Walking evidence

Both walking legs are required independently:

- MRT-3 Guadalupe to Guadalupe Ferry; and
- Hulo Ferry to Hulo Office Demo Destination.

A point with activity `still` or speed 0 is never walking. Evidence requires a
sequence of at least three supporting points, non-zero movement in the walking
range or explicit walking activity, and meaningful position change. A stopped
private vehicle therefore cannot satisfy either walking requirement.

### Dwell and transfers

The profile requires low-speed/still dwell near MRT-3 Araneta-Cubao, MRT-3
Guadalupe, and Guadalupe Ferry. Missing required dwell makes the pattern
suspicious.

### Activity recognition

Walking, still, and in-vehicle labels provide a supporting signal only. They do
not independently establish a verified trip.

## Scoring

```text
Route match:                25 points
Speed pattern validity:     15 points
Walking segments:           15 points
Station/terminal proximity: 15 points
Dwell/transfer behavior:    10 points
Activity recognition:       10 points
No suspicious movement:     10 points
Total:                     100 points
```

| Score | Result | Reward eligibility |
|---:|---|---|
| 80-100 | Verified sustainable trip chain | Full |
| 60-79 | Partially verified trip | Reduced |
| Below 60 | Unverified trip | None |
| Suspicious override | Suspicious pattern | None |

Prototype confidence is capped at 95 for non-suspicious results and 45 for a
suspicious pattern.

## Generated Prototype Fixtures

- `valid_phase_0a_multimodal_trace.json` covers all five route segments and
  returns 95%, Verified, Full.
- `suspicious_phase_0a_multimodal_trace.json` follows the access sequence but
  contains an impossible off-route teleport and returns 45%, Suspicious, None.

The same fixtures are exported as `validPhase0AMultimodalTrace` and
`suspiciousPhase0AMultimodalTrace`. They are generated demonstration data, not
collected trips or evidence of field accuracy.
