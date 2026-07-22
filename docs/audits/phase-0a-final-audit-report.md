# LakbayPoints Phase 0A Final Technical Audit Report

## Executive Decision

- **Audit date:** 2026-07-22 (Asia/Shanghai)
- **Branch:** `codex/phase-0a-final-audit-fixes`
- **Audited implementation commit:** `833f351` (`test: cover phase 0a integrity boundaries`)
- **Baseline:** fetched `origin/main` at `fdc0b8f`
- **Decision:** **GO**
- **Phase 0A score:** **92/100**

All user-defined GO conditions pass: no Critical finding remains; no Major
finding blocks the demo; the valid final-route fixture verifies; malformed,
unknown, private, future, mismatched, and suspicious inputs receive no reward;
the campaign cap always holds; playback progresses through five segments; all
automated checks pass; and the approved visual design remains unchanged.

Physical-device QA has not been completed in this environment. It remains a
required pre-demo evidence task, but it does not reverse this source/build GO
decision under the final audit criteria.

## Score

| Category | Score | Evidence |
|---|---:|---|
| Scope completeness | 19/20 | Phase 0A route, verification, rewards, playback, and reporting work; dashboard remains intentionally Phase 0B. |
| Functional correctness | 20/20 | Required valid, suspicious, malformed, route-eligibility, reward-boundary, playback, and report cases pass. |
| Technical quality | 13/15 | Strict types, lint, tests, pure rewards, and builds pass; transitive advisories and a SafeAreaView deprecation warning remain. |
| Classifier credibility | 13/15 | Exact route profile, ordered access/dwell, two walking legs, strict validation, and impossible-movement checks pass; field calibration/full GIS remain future work. |
| UX/presentation readiness | 13/15 | Deterministic five-step behavior and report wording are tested without visual changes; physical-device evidence is outstanding. |
| Documentation/maintainability | 9/10 | Rules, model, flow, tracker, trace provenance, mobile behavior, and limitations are reconciled. |
| Git discipline | 5/5 | Work used the required branch and scoped Conventional Commits. |
| **Total** | **92/100** | **GO** |

## Route Fixture Results

Both active fixtures are generated prototype data, not collected trips.

| Fixture | Points | Coverage | Result |
|---|---:|---|---|
| `valid_phase_0a_multimodal_trace.json` | 28 | Jeepney/public-road movement, Cubao MRT dwell, MRT movement, Guadalupe dwell, Guadalupe-to-ferry walk, ferry dwell/movement, Hulo last-mile walk | 95%, Verified sustainable trip chain, Full |
| `suspicious_phase_0a_multimodal_trace.json` | 28 | Same intended access chain with an impossible off-route teleport during MRT movement | 45%, Suspicious pattern, None |

JSON and TypeScript fixture parity is automated. Approved route values remain
unchanged at 91 minutes, 14.1 km, PHP 35 plus ferry fare TBC, and CO2e pending
pilot calibration.

## Classifier Results

The classifier resolves the exact selected catalog route and its verification
profile. It no longer falls back to another sustainable option.

Validation and fail-closed tests pass for:

- empty/non-array and too-short traces;
- null points;
- malformed, duplicate, and reversed timestamps;
- invalid/non-finite latitude and longitude;
- negative/non-finite speeds;
- unsupported activities;
- unknown route ID;
- private baseline and future preview;
- stopped vehicle not treated as walking;
- missing Guadalupe MRT-to-ferry walk;
- missing Hulo last-mile walk;
- route mismatch; and
- deterministic repeated classification.

Invalid trace data returns `Unverified trip`, confidence 0, reward eligibility
`None`, and an explanation identifying invalid trace data. Suspicious patterns
receive `None`.

## Reward Results

The approved formulas remain +120 Lakbay Score and up to +40 campaign Points
for Full verification. Boundary behavior is now:

| Case | Result |
|---|---|
| Full | +120 Score, +40 Points from demo state, fully verified trip count +1 |
| Reduced | +60 Score, +0 Points, fully verified trip count unchanged |
| Unverified/Suspicious | +0 Score, +0 Points, no count or CO2e increment |
| Near cap (95/100) | +5 Points, updated total exactly 100 |
| At/over cap | +0 Points, state normalized to 100 maximum |
| Negative/non-finite state | Finite non-negative normalized totals |
| Negative/non-finite route rewards | Reward values normalize to zero |
| Pending CO2e | Earned CO2e remains zero |
| Repeated calculation | Identical pure output; input state is not mutated |

Whole Score/Point/count values and two-decimal CO2e values use consistent
rounding. Every tested result satisfies `0 <= campaignPoints <= cap`.

## Playback and Reporting Results

Playback begins on visual segment 1/internal index 0. The existing primary
control advances deterministically through all five shared segments. The
current segment, status, and progress indicator update at each step.
Verification is not available before the final segment; the suspicious option
is disabled until completion. At completion the same control verifies the valid
fixture, while the existing suspicious control verifies the suspicious fixture.
After a result, the same primary control becomes Restart Playback and returns to
segment 1 while clearing stale verification state.

The report form retains its categories and styling and now offers:

1. MRT-3 Araneta-Cubao access area
2. MRT-3 Guadalupe access area
3. Guadalupe Ferry access area
4. Hulo Ferry access area
5. Hulo office last-mile access area

Confirmation uses: **Submitted to the LakbayPoints prototype review queue for
demonstration.** It does not imply a live MMDA integration.

## Automated Tests

- **Shared:** 37 passing tests.
- **Mobile:** 14 passing tests across four suites.
- **Snapshots:** 0; no snapshot updates or visual baseline changes.

The new suites cover all classifier, reward, playback, and report cases required
by the final audit brief.

## Quality Gates

| Command | Result |
|---|---|
| `git fetch --prune origin` | Pass |
| `npm ci` | Pass; 14 transitive advisories reported (12 moderate, 2 high) |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm test` | Pass; 37 shared + 14 mobile |
| `npm run check:classifier` | Pass; valid 95/Full, suspicious 45/None |
| `npm run check:rewards` | Pass; valid +120/+40, suspicious +0/+0 |
| `npm run verify` | Pass |
| `npm run build` | Pass; mobile Android export, dashboard build, shared build |
| `npx expo-doctor` from `apps/mobile` | Pass; 18/18 checks |
| `npx expo export --platform android --output-dir dist` | Pass; 2,446 modules, 3.86 MB Hermes bundle |

Generated `dist`, `.check-output`, `.next`, and other build outputs remain
ignored and are not included in commits.

## Visual Integrity

The `StyleSheet.create` block in `apps/mobile/App.tsx` is unchanged from
`origin/main`. `NewScreens.tsx` is unchanged. No color, typography, spacing,
padding, margin, radius, icon, card, tab, animation, or layout style changed.

The only `App.tsx` line groups changed are:

- imports around lines 26 and 35: renamed final-route fixture exports;
- lines 168-193: final-route report labels and approximate prototype coordinates;
- lines 577-612: deterministic playback index, gate, verification, and restart state;
- lines 639-641: explicit generated-prototype/rule-engine wording;
- lines 729-748: reused existing playback controls for advance/verify/restart and disabled-state behavior; and
- lines 1073-1074: required LakbayPoints prototype review-queue wording.

These are functional data, state, accessibility, or truthful prototype-copy
changes. No StyleSheet line changed and no new visual component design was
introduced.

## Legacy Reference Search

No active classifier, trace, mobile, script, or active fixture retains:

- `GuadalupeCubao`
- `guadalupe_cubao`
- `startsNearGuadalupe`
- `endsNearCubao`
- `northboundProgress`
- `Guadalupe to Cubao`

Older audit evidence, planning history, the original setup prompt, and the
untouched Phase 0B dashboard starter may retain historical descriptions. They
are not exported or consumed by active Phase 0A classifier/trace code.

## Defect Register

| ID | Severity | Status | Finding / disposition |
|---|---|---|---|
| P0A-001 | Critical | Closed | Malformed chronology now fails closed at 0/None. |
| P0A-002 | Major | Closed | Unknown/private/future routes fail closed; exact profile required. |
| P0A-003 | Major | Closed | Reward values and state normalize; campaign cap invariant holds. |
| P0A-004 | Major | Closed | Null/malformed trace data returns safely without throwing. |
| P0A-005 | Major | Closed | Five-segment playback, completion gate, valid/suspicious choices, and restart pass component tests. |
| P0A-006 | Major | Closed | Still/zero speed is not walking; both route-specific walking legs are required. |
| F0A-001 | Minor | Open | Physical Android/Expo Go QA, screenshots, video, font scaling, and orientation evidence are not available in this environment. |
| F0A-002 | Minor | Open | `npm ci` reports 14 transitive advisories; no breaking forced audit fix was applied. |
| F0A-003 | Observation | Open | React Native reports the existing SafeAreaView deprecation warning in tests. |
| F0A-004 | Observation | Open | Traces and thresholds are generated prototype data without field calibration/full GIS matching. |
| F0A-005 | Observation | Open | Ferry fare and CO2e remain pending approved calibration. |

There are **0 open Critical**, **0 open Major**, **2 open Minor**, and **3 open
Observations**. No open finding blocks the source-tested Phase 0A demo.

## Open Limitations

- Physical-device QA remains required before the external demonstration.
- The classifier cannot prove transport mode and requires formal pilot
  calibration with labeled, consented traces.
- No live routing, GPS capture, map matching, ferry feed, reward ledger,
  backend, agency queue, or MMDA integration exists.
- Ferry fare and CO2e calibration remain pending.
- Dashboard implementation remains Phase 0B and was not changed.
- Dependency advisories and the existing SafeAreaView deprecation should be
  addressed through supported Expo/React Native upgrade work, not a blind
  breaking fix.

## Phase 0B Recommendation

**Phase 0B may begin.** The source/build integrity gate is GO. Physical-device
QA should run in parallel as a pre-demo release gate, and any device-level Major
or Critical issue should pause the demo release until repaired.
