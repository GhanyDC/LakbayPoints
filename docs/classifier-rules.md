# Sustainable Trip Chain Classifier Rules

## Purpose

The Sustainable Trip Chain Classifier verifies whether a completed trip reasonably matches the selected sustainable route.

This is a **rule-based confidence engine** for MVP. It is not a fully trained AI model.

## Judge-Safe Explanation

> For the MVP, LakbayPoints uses a rule-based confidence engine. It does not rely on one signal and does not claim perfect mode detection. It checks whether the completed trip reasonably matches a sustainable trip chain using multiple signals. The formal pilot will collect labeled local traces to refine the classifier and later support a trained model.

## Inputs

- selected route
- GPS trace points
- station / terminal access points
- expected speed bands
- expected route geometry
- optional phone activity labels

## Signals

### 1. Route Match

Checks whether GPS trace stays close to the selected route.

Suggested MVP rule:
- pass if majority of points are within a reasonable corridor buffer;
- fail if route deviates significantly without explanation.

### 2. Speed Pattern Validity

Checks whether speeds are plausible for walking and transit segments.

Suggested bands:
- walking: 0–7 kph
- road public transport / MRT corridor movement: realistic corridor speeds
- suspicious: sudden large jumps or impossible speeds

### 3. Walking Segments

Checks whether first-mile and last-mile movement resembles walking.

Signals:
- activity label = walking, if available;
- low speed;
- short-distance route segment near origin/destination.

### 4. Dwell Time

Checks whether the trace shows still/slow activity near expected station, terminal, or transfer points.

Purpose:
- supports public transport transfer plausibility.

### 5. Station / Terminal Proximity

Checks whether trip starts, transfers, or ends near known access points.

### 6. Phone Activity Recognition

Optional support signal:
- walking
- still
- in_vehicle
- unknown

This strengthens the classifier but should not be the only basis for rewards.

### 7. Impossible Movement Check

Flags:
- teleport-like GPS jumps;
- impossible speed;
- trace too short;
- missing route segments;
- start/end mismatch.

### 8. Suspicious Pattern

Examples:
- private-vehicle-like direct route while claiming transit route;
- no walking access segments;
- GPS jump from origin to destination;
- route completed unrealistically fast.

## Scoring

Suggested MVP score:

```txt
Route match:                25 points
Speed pattern validity:     15 points
Walking segments:           15 points
Station/terminal proximity: 15 points
Dwell/transfer behavior:    10 points
Activity recognition:       10 points
No suspicious movement:     10 points
Total:                     100 points
```

## Result Thresholds

| Score | Result | Reward |
|---:|---|---|
| 80–100 | Verified sustainable trip chain | Full Lakbay Score + eligible campaign points |
| 60–79 | Partially verified trip | Lakbay Score only or reduced points |
| Below 60 | Unverified trip | No redeemable points |
| Suspicious | Possible spoofing / invalid trip | No reward, flagged |

## Required Demo Traces

Create two traces:

1. `valid_sustainable_guadalupe_cubao.json`
   - should return Verified sustainable trip chain
   - target confidence: 80–95

2. `suspicious_trace_rejected.json`
   - should return Suspicious pattern or Unverified trip
   - target confidence: below 60

## Implemented MVP Simplifications

The current classifier implementation is intentionally lightweight for the competition MVP:

- uses approximate demo coordinates for the EDSA-MRT3 Guadalupe to Cubao corridor;
- checks whether most trace points stay inside a simple pilot-corridor bounding area;
- checks station/access proximity against seeded MRT3 access points;
- checks speed patterns using reported speed plus computed point-to-point speed;
- treats very short traces, teleport-like jumps, impossible speeds, and missing walking segments as suspicious;
- uses phone activity labels only as a supporting signal, not as the sole basis for rewards.

This is not real map matching, real GPS tracking, a full NCR routing engine, or a trained ML model.
