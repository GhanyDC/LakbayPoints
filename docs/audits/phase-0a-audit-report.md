# LakbayPoints Phase 0A Audit Report

## 1. Executive Summary

- **Audit date:** 2026-07-18 (Asia/Shanghai)
- **Audited branch:** `main`
- **Audited commit:** `ee6971bd2e03015f83067576a915e374addb418a`
- **Initial working tree:** Clean; `main` matched `origin/main`
- **Overall status:** Not ready for Phase 0B
- **Recommended decision:** **NO-GO**

LakbayPoints has a coherent, buildable commuter demo with real shared TypeScript classifier and reward functions behind the UI. The documented valid fixture produces a 95% verified result and the documented suspicious fixture produces a 45% suspicious result with no reward. The Android bundle exports, Metro starts, the dashboard builds, and all configured typechecks pass.

The proof-of-mechanism is not yet credible enough to advance. Its happy path is stronger than its input boundaries: invalid timestamps can receive full verification and rewards, route identity is not enforced, reward invariants can be violated by malformed state, and the screen called trip playback does not actually play or progress through a trace. Test and lint coverage do not protect these cases.

The five most important findings are:

1. **Invalid timestamps still earn a full reward.** Replacing every valid trace timestamp with `not-a-date` still returns 95%, `Full`, +120 Lakbay Score, and +40 Lakbay Points. This is the audit's one Critical defect.
2. **Verification is not bound to the selected sustainable route.** An unknown route ID silently falls back to the sustainable fixture, and a private-baseline route object returns the same 95%/Full result.
3. **Trip playback is a static state change, not a playback/simulation.** It opens on segment index 1, offers completion immediately, and has no timed/manual segment progression or restart control.
4. **Reward input invariants are not defended.** An already-over-cap state remains at 150/100, and negative route rewards produce negative earnings and totals.
5. **Quality gates are incomplete.** `npm test` is absent and the configured lint command succeeds without running a linter because no workspace defines `lint`.

## 2. Phase 0A Readiness Score

| Category | Score | Justification |
|---|---:|---|
| Scope completeness | 17/20 | All required artifacts/screens are represented, but playback is not a meaningful simulation and several screens could not be exercised on a native device in the audit environment. |
| Functional correctness | 11/20 | Happy-path fixtures and normal rewards pass; timestamp, route-selection, malformed-data, and reward-boundary probes fail. |
| Technical quality | 9/15 | Strict TypeScript, workspaces, shared logic, and builds are sound; the mobile app is monolithic, data is duplicated, lint is a no-op, and automated coverage is narrow. |
| Classifier credibility | 6/15 | Documented weights/signals and suspicious override exist, but route identity, timestamp integrity, and walking detection are not credible at the reward boundary. |
| UX and presentation readiness | 10/15 | Civic styling, clear route priority, units, and future labels are strengths; playback, judge-safe caveats, accessibility state, and endorsement wording need work. |
| Documentation and maintainability | 7/10 | Documentation is extensive and mostly matches types/weights, but scope, terminology, tracker status, and dashboard/mobile README details are stale or conflicting. |
| Git discipline | 3/5 | The tree is clean, ignores are sound, and most feature commits are scoped; the latest commit is non-conventional and mixes several concerns. |
| **Total** | **63/100** | **Below the readiness threshold.** |

The minimum recommended threshold for moving to Phase 0B is **80/100 with no open Blocker or Critical defects**. The suggested interpretation therefore places 63/100 in **Not ready**.

## 3. Repository State

- **Branch:** `main`
- **Audited commit:** `ee6971bd2e03015f83067576a915e374addb418a`
- **Initial status:** `## main...origin/main`; no modified or untracked files
- **Package manager:** npm 11.13.0 with `package-lock.json`
- **Runtime used:** Node.js 24.17.0; repository declares Node `>=20.19.0` and npm `>=10.0.0`
- **Installed core versions:** Expo 54.0.36, React Native 0.81.5, React 19.1.0, Next.js 16.2.10, TypeScript 6.0.3, Prettier 3.9.4

Actual structure:

```text
apps/
  mobile/       Expo React Native app; all mobile screens in App.tsx
  dashboard/    Next.js Phase 0B starter/placeholder
packages/
  shared/       Shared types, routes, traces, classifier, rewards, demo state
data/
  routes/       JSON route fixture
  traces/       JSON valid and suspicious fixtures
  seed/         JSON reward/report fixtures
scripts/        Classifier and reward smoke checks
docs/           Scope, flow, model, classifier, UI, Git, tracker, audits
```

Architecture is a valid npm workspace monorepo. Mobile imports `@lakbaypoints/shared` successfully, the shared dependency is deduplicated, and no production backend is required. The inspected import graph is one-directional (`mobile/dashboard -> shared`; classifier -> routes/types; rewards -> types), with no obvious circular dependency.

The main structural mismatch is duplicate ownership of routes, traces, and reward seed state. The app consumes TypeScript constants in `packages/shared/src/`, not the JSON files under `data/`. The audit probe confirmed that the copies are equal today, but there is no automated synchronization or schema check.

## 4. Requirements Traceability Matrix

| Phase 0A requirement | Status | Evidence | Gap or note |
|---|---|---|---|
| 1. Static multimodal pilot-route data | Pass | `packages/shared/src/routes.ts`; `data/routes/guadalupe-cubao-routes.json`; equality probe passed | Duplicated sources can drift. |
| 2. Route comparison screen | Partial | `RouteComparisonScreen` and `RouteCard`, `apps/mobile/App.tsx:191-381`; Android bundle passed | No native device was available for interactive/runtime visual verification. |
| 3. Route detail screen | Partial | `RouteDetailScreen`, `apps/mobile/App.tsx:383-455`; shared segment data used | Documented route map is absent; no device interaction test. |
| 4. Trip playback or trip simulation | Fail | `TripPlaybackScreen`, `apps/mobile/App.tsx:497-660` | Fixed segment index, no progression/restart, completion immediately available. |
| 5. Sustainable Trip Chain Classifier | Partial | `classifySustainableTripChain`, `packages/shared/src/classifier.ts:218-407` | Happy fixtures pass, but invalid timestamps and route identity fail critical boundary probes. |
| 6. Valid sustainable trip trace | Pass | Both TS and JSON fixtures; 11 points, 33 min, 6.880 km, max 27 kph | Approximate/generated prototype data, not a collected real-world trace. |
| 7. Suspicious or rejected trip trace | Pass | Both TS and JSON fixtures; 4 points, 3 min, 6.404 km, max 180 kph | Correctly returns Suspicious/None, though walking signal is a false positive. |
| 8. Verification result UI | Partial | `apps/mobile/App.tsx:583-624`; displays classifier object fields | Judge-safe no-perfect-detection caveat is not shown; no device runtime check. |
| 9. Lakbay Score and campaign-points reward logic | Fail | `calculateTripRewards`; normal and near-cap fixtures pass | Invalid state can exceed cap; negative reward data creates negative earnings/totals. |
| 10. Reward result screen | Partial | `RewardResultScreen`, `apps/mobile/App.tsx:671-769`; uses calculated result | No native interaction test; partial-verification accounting is ambiguous. |
| 11. Report Access Barriers form | Partial | `ReportAccessBarrierScreen`, `apps/mobile/App.tsx:793-940` | Static validation is present; empty/partial/multiple submissions were not device-tested. |
| 12. Report submission confirmation | Partial | `ReportConfirmationScreen`, `apps/mobile/App.tsx:951-1002` | Omits report ID, description, and timestamp; in-memory only. |
| 13. Complete commuter navigation flow | Partial | `App` state transitions, `apps/mobile/App.tsx:1061-1131` | Source transitions are complete; native taps/system-back behavior not executed. |
| 14. Shared TypeScript models and reusable logic | Partial | `packages/shared/src/types.ts`, classifier, rewards, exports | Strong shared core, but route-specific hardcoding and duplicate fixtures reduce reuse. |
| 15. Updated documentation and progress tracking | Partial | All required docs exist | Tracker marks playback/reward logic Done despite audit failures; scope/terminology conflicts remain. |
| 16. Stable local development commands | Pass | `npm install`, `npm run verify`, `npm run mobile`, dashboard build/start, Expo Android export | `npm test` and root `npm run build` are absent; lint is a no-op. |
| 17. Proper Git commit history | Partial | 12 recent commits inspected; most use Conventional Commits | `ee6971b fixed issue` is non-conventional and mixes dependency/config/docs changes. |

## 5. End-to-End Flow Audit

The implemented state flow is:

```text
comparison -> detail -> playback -> rewards -> report
           -> reportConfirmation -> dashboardPreview
```

Working transitions confirmed by source inspection:

- The only route-card CTA is on the sustainable route and opens detail.
- Detail passes the shared sustainable route into playback.
- Valid and suspicious trace buttons call the real shared classifier.
- Rewards cannot render until `verifiedTrip` has a classifier result.
- The reward screen calculates from that result and the shared demo state.
- Report submission creates a report object before confirmation renders.
- Confirmation leads to a clearly labeled dashboard placeholder.
- Every post-comparison screen has an in-app back/return CTA.
- Returning to routes clears verified-trip and submitted-report state.

No source-level dead end was found. A user cannot reach the reward screen through the rendered UI without first producing a classifier result. Both valid and suspicious paths can proceed; suspicious receives zero before the reporting flow.

Important limitations:

- Native tap behavior was not executed because `adb devices` showed no attached device and no emulator command was available. Android export and Metro startup verify bundling/startup, not rendered behavior.
- Navigation is a local React state switch, not a navigation stack. The in-app back buttons are wired, but Android hardware-back behavior was not implemented or tested.
- The playback screen permits immediate completion and therefore does not enforce completion of simulated segments.
- The state is session memory only. Returning to routes intentionally discards the submitted report and verified trip.

## 6. Route Data and Guidance Audit

Three intended route options exist in both `packages/shared/src/routes.ts` and `data/routes/guadalupe-cubao-routes.json`:

| Route | Type | Time | Cost/fare | Distance from segments | CO2e | Reward |
|---|---|---:|---:|---:|---:|---|
| Private Vehicle Baseline | `private_baseline` | 46 min | PHP 210 | 8.4 km | 3.4 kg baseline | None |
| Recommended Sustainable Trip | `sustainable` | 32 min | PHP 28 | 8.0 km | 2.8 kg estimated avoided | +120 Score, +40 Points |
| Phase 2 Multimodal Preview | `phase2_preview` | 38 min | PHP 45 | 8.3 km | 2.4 kg estimated avoided | None |

The screen uses the shared TypeScript route data rather than unrelated card constants. Time, PHP, kilometer, kilogram, Lakbay Score, and Lakbay Points units are clearly labeled. Segment times sum to each route total. The audit equality probe confirmed that the TypeScript and JSON copies are currently identical.

The recommended route receives a green border, shadow, `Recommended` badge, metrics, and the only CTA. The private option is labeled baseline/comparison only and receives no reward CTA. The future route has a `Phase 2 Preview` badge plus `Requires future partner/data integration` and `Not the MVP live route` notes. No live-routing claim was found; the comparison and detail screens state that data is static prototype data.

Gaps:

- The approved audit brief positions the product as a verified multimodal platform and uses `Improve Access`; the repository says `MMDA's Verified Mode-Shift Data Layer` and `Improve the Road` (`README.md:3-5`). The possessive MMDA wording can imply official ownership/endorsement.
- `docs/app-user-flow.md:60` requires a route map, but the detail screen contains only cards and a segment list.
- The JSON data directory is not the app's load source, despite repository structure suggesting it is authoritative.

## 7. Trip Playback Audit

`TripPlaybackScreen` is connected to the sustainable route and both shared trace fixtures. Active indices remain in bounds for the current three-segment fixture. Going back unmounts the screen, so re-entry resets its local result and trace mode.

It is not a substantive playback implementation:

- Before verification, `activeIndex` is hardcoded to `1` (`apps/mobile/App.tsx:512-514`), so the screen starts on the second of three segments and shows approximately 67% progress.
- After verification, `activeIndex` jumps to the final segment.
- No timer, trace cursor, next-step control, or location-point progression exists.
- `Complete Trip & Verify` is available immediately.
- No restart control exists; restart requires going back and reopening playback.
- Segment status text is index-coupled to a three-item local `playbackSteps` array rather than derived from the trace.
- The detail CTA says `Begin Trip Playback`, and the result calls the data a demo trace, but the pre-result screen does not clearly state that movement is an MVP simulation rather than live GPS.

Repeated classifier button presses replace local classifier state and do not mutate rewards. Switching from valid to suspicious before opening rewards uses the latest result. No duplicate reward mutation occurs because reward calculation is pure and the screen always starts from the immutable demo state. This also means the prototype does not persist earned rewards across trips.

## 8. Classifier Audit

The implemented weights match `docs/classifier-rules.md` exactly:

- route match: 25
- speed pattern: 15
- walking segments: 15
- proximity: 15
- station dwell: 10
- activity recognition: 10
- no suspicious movement: 10

The result thresholds also match: 80+ Full, 60-79 Reduced, below 60 None, with suspicious override to None. Output is capped to 95 for non-suspicious and 45 for suspicious traces, so scores stay within 0-100. Repeated identical input produced byte-for-byte identical output.

Implemented signals:

- a pilot bounding-box/northbound-progress route shape;
- reported and computed point-to-point speed;
- low-speed/activity-based first/last windows;
- station/access proximity;
- low-speed/still station dwell;
- optional/trace activity labels;
- short trace, impossible speed, jump, missing walking, and missing transit suspicious checks.

Fixture results:

| Trace | Points | Start | End | Duration | Approx. path distance | Max recorded speed | Activities | Score/result | Reward eligible |
|---|---:|---|---|---:|---:|---:|---|---|---|
| Valid sustainable | 11 | 14.5658, 121.0438 | 14.6223, 121.0531 | 33 min | 6.880 km | 27 kph | walking, still, in_vehicle | 95%, Verified | Full |
| Suspicious/rejected | 4 | 14.5658, 121.0438 | 14.6224, 121.0532 | 3 min | 6.404 km | 180 kph reported; 216 kph computed | still, in_vehicle | 45%, Suspicious | None |

Critical/major boundary results from `docs/audits/phase-0a-evidence/runtime-probes.cjs`:

- All-invalid timestamps still return 95%, Verified, Full and earn +120/+40. `minutesBetween` converts invalid/non-increasing time to zero, and zero-duration sub-3 km steps are not rejected.
- `selectedRoute: "does-not-exist"` silently falls back to the first sustainable option and returns 95%/Full.
- Passing the private-baseline route object with the valid trace also returns 95%/Full. The classifier never verifies `route.type` or uses route segments/geometry in its checks.
- Eight null points throw `TypeError: Cannot read properties of null (reading 'timestamp')`.
- The suspicious fixture contains no `walking` activity but still sets `walkingSegmentsDetected: true` because `isWalkingLike` treats a still/0 kph point as walking.
- An empty trace is handled safely as 0%, Suspicious, None.

Credibility assessment: the classifier is a useful scoring demonstration for two curated fixtures, but it is not yet a defensible verification boundary. It cannot distinguish MRT/public transport from a private car following the same corridor with low-speed endpoints, and it does not validate chronology or selected-route identity. Documentation correctly says it is rule-based, approximate, and does not claim perfect mode detection (`docs/classifier-rules.md:7-11`); the full judge-safe caveat should also appear in the result UI.

## 9. Reward Logic Audit

Normal fixture behavior:

| Case | Score earned | Points earned | Resulting Score | Resulting Points | Cap remaining | CO2e credited | Message |
|---|---:|---:|---:|---:|---:|---:|---|
| Valid trace | 120 | 40 | 360 | 60/100 | 40 | 2.8 kg (8.4 kg conceptual total) | Full reward earned for a verified sustainable trip chain. |
| Suspicious trace | 0 | 0 | 240 | 20/100 | 80 | 0 kg | No reward - suspicious movement detected. |
| Synthetic Reduced result | 60 | 0 | 300 | 20/100 | 80 | 2.8 kg | Reduced Lakbay Score earned. Campaign points require full verification. |

Strengths:

- Lakbay Score is explicitly represented and described as non-cash.
- Lakbay Points are described as campaign-based and capped.
- A normal near-cap case works: 95/100 plus a 40-point reward awards only 5 and ends at 100/100.
- Suspicious and unverified results award zero.
- Full and reduced behavior is deterministic and does not mutate its input state.
- The UI uses `calculateTripRewards` output, not hardcoded earned totals.
- CO2e is labeled as an estimate, not a carbon credit.

Failures/gaps:

- Input invariants are not validated. A current state of 150 points with cap 100 returns `updatedCampaignPoints: 150`; it reports zero remaining but still exceeds the cap.
- Negative route rewards produce -120 Score, -40 Points, and -20 updated Points.
- A Reduced result credits the full 2.8 kg CO2e and increments `verifiedTrips` because any positive Lakbay Score increments that counter. This policy is not described in the classifier/reward documentation and can overstate verified-trip metrics.
- Floating-point addition produces `8.399999999999999` in the updated CO2e state. The current screen shows only the per-trip 2.8 kg, so the artifact is not visible there, but future totals require formatting/rounding.
- The screen recomputes from the fixed demo state and does not persist rewards. That prevents render-time duplicate awards but does not demonstrate durable duplicate-award protection.

## 10. Access-Barrier Reporting Audit

All approved categories exist with correct internal values:

- Sidewalk obstruction -> `sidewalk_obstruction`
- Unsafe crossing -> `unsafe_crossing`
- Flooding -> `flooding`
- Illegal parking / loading obstruction -> `illegal_parking_or_loading_obstruction`
- Damaged walkway or access path -> `damaged_walkway_or_access_path`

Severity is restricted by TypeScript and UI options to Low, Medium, or High. Submission requires category, severity, one of four selectable demo corridor locations, and a trimmed non-empty description. The empty/partial path sets a clear validation message. GPS is not claimed: the UI says it uses selectable demo locations. The photo section explicitly says camera upload is disabled and stores a placeholder string.

Normal submission creates:

- an ID based on `prototype-report-${Date.now()}`;
- mapped category/severity/location/description;
- status `Submitted`;
- an ISO timestamp from `new Date().toISOString()`;
- a placeholder photo URL.

The normal UI makes same-millisecond duplicate IDs unlikely because it navigates away after one submit, but `Date.now()` is not a robust uniqueness guarantee for future concurrent use. The form component's local state is new on each entry, so it does not intentionally reuse old category/description state.

Confirmation correctly displays category, severity, location, and Submitted status. It does not display the description, ID, creation timestamp, or photo placeholder; the following dashboard preview displays the ID. Data is held only in `App` memory and is cleared by Back to Routes.

The confirmation says the report was added to the MMDA dashboard queue "in this prototype." The next screen clearly labels itself `Dashboard Preview`, `Report queue placeholder`, and states that full integration is absent. It does not promise automatic enforcement; the report introduction explicitly says the MVP does not automate enforcement or dispatch.

Because no native device was available, empty, partial, valid, and multiple submission gestures were verified by source logic rather than interactive execution and are not reported as runtime passes.

## 11. UI/UX and Presentation Audit

**UX score: 6.5/10.** This is a static/code-and-bundle assessment; no native screenshots were produced.

Strengths:

- The visual system uses calm navy/teal/green/amber and neutral backgrounds consistent with the style guide.
- The sustainable route has obvious visual priority, while the baseline and future option are clearly framed.
- Headings (up to 40 px), card titles, metric labels, units, and CTAs are projector-friendly.
- Reward language is professional and avoids cash/redemption or carbon-credit framing.
- Prototype/static, demo-location, camera-placeholder, no-dispatch, and dashboard-placeholder copy is generally explicit.
- Measured contrast ratios for primary text and controls pass WCAG AA for normal text: teal/white 5.47, slate/white 7.58, muted slate/light background 4.55, amber/light amber 6.37, blue/light blue 8.49.

Weaknesses:

- Playback behavior contradicts its visual progress and completion story.
- The route comparison contains three information-dense cards; whether the recommended option is understood within 10 seconds could not be user-tested.
- No map/route geometry is shown despite the flow document.
- The verification screen shows only a short rule-based note, not the full no-perfect-mode-detection/formal-pilot disclaimer.
- `MMDA's` product positioning and queue wording risk implying endorsement/integration beyond the prototype.
- Option buttons expose `accessibilityRole="button"` but not selected/checked accessibility state. Placeholder text contrast is 2.56:1, and the 43 px option-button height is approximately one pixel below the common 44 px touch-target recommendation.
- No device-level responsive, screen-reader, font-scaling, orientation, system-back, or tap-target testing was possible.
- No loading/error states exist. Static local data makes loading unnecessary today, but classifier/report exceptions have no error boundary or user-safe fallback.

## 12. Build, Test, and Runtime Results

| Command | Result | Notes |
|---|---|---|
| `git status --short --branch` | Pass | Initially clean; `main...origin/main`. |
| `git branch --show-current` | Pass | `main`. |
| `git log --oneline -15` | Pass | 12 commits available and inspected. |
| `npm run` | Pass | Root scripts enumerated. |
| `npm run --workspaces --if-present` | Pass | Workspace scripts enumerated. |
| `npm install` | Pass with warning | Up to date; audited 661 packages; reported 12 moderate vulnerabilities. |
| `npm run verify` | Pass with limitation | Typechecks, format, classifier, and rewards pass; lint step runs no linter. |
| `npm run typecheck --workspace=apps/mobile` | Pass | `tsc --noEmit`. |
| `npm run typecheck --workspace=packages/shared` | Pass | `tsc --noEmit -p tsconfig.json`. |
| `npm run typecheck --workspace=apps/dashboard` | Pass | `tsc --noEmit`. |
| `npm run check:classifier` (inside verify) | Pass | Valid 95%/Verified/Full; suspicious 45%/Suspicious/None. |
| `npm run check:rewards` (inside verify) | Pass | Valid +120/+40; suspicious +0/+0; normal cap test passes. |
| `npm run build --workspace=packages/shared` | Pass | TypeScript build completed. |
| `npm run build --workspace=apps/dashboard` | Pass | Next production build and static generation completed. |
| `npx expo-doctor` | Pass | 18/18 checks passed. |
| `npx expo export --platform android --output-dir dist` | Pass | 578 modules bundled; 1.78 MB Hermes bundle; output ignored. |
| `npm run mobile` | Pass/startup | Metro reached `Waiting on http://localhost:8081`; then manually stopped. |
| `npm run dashboard` + HTTP request | Pass/startup | Next ready on port 3000; GET `/` returned 200 and expected placeholder text; then manually stopped. |
| `npm test` | Fail | Repository issue: no `test` script. |
| `npm run build` | Fail | No root build script; workspace build commands are available and pass. README does not claim a root build command. |
| `npm audit --omit=dev` | Fail/advisory | 12 moderate transitive vulnerabilities involving PostCSS and uuid paths; suggested automated fixes are breaking and were not applied. |
| `node docs/audits/phase-0a-evidence/runtime-probes.cjs` | Completed; exposed failures | Produced trace metrics, fixture equality, determinism, malformed input, route binding, timestamp, reward, and contrast evidence. |
| `adb devices` | Environment limitation | adb available, but no attached devices; Android emulator command unavailable. |

An auditor-only attempt using both Expo `--offline` and `--lan` flags failed because those flags are mutually exclusive. It was corrected by testing the documented `npm run mobile` command. This was not a repository defect.

## 13. Code Quality and Architecture

Strengths:

- Strict TypeScript is enabled in every workspace.
- Shared types, classifier, reward logic, fixtures, and exports are centralized under `packages/shared` for consumption.
- The app does not depend on a backend, authentication, environment variables, or network APIs.
- Package workspace resolution succeeds in typecheck and Metro/Next builds.
- Classifier and rewards are pure/deterministic for the same valid input.
- Route and trace JSON copies match their TypeScript counterparts at the audited commit.

Technical debt:

- `apps/mobile/App.tsx` is 1,751 lines and contains all screens, forms, navigation state, copy, and styles. This raises regression cost and impedes targeted testing.
- Routes, traces, and demo reward state are duplicated between `data/` JSON and `packages/shared/src/` TypeScript. There is no single source or validation pipeline.
- Classifier route logic is hardcoded to the northbound Guadalupe-Cubao bounding box and fixed start/end access points, not the selected route's segments/polyline.
- Playback status is coupled by array index to exactly three known segments; `PlaybackStep.segmentId` is never used for lookup.
- No runtime validation layer exists at JSON/shared function boundaries.
- No UI/component tests, classifier adversarial tests, or report-form tests exist.
- The `lint` script name gives false confidence because `--if-present` skips all workspaces.
- Updated CO2e totals are not rounded.

## 14. Scope Compliance

Compliant areas:

- No authentication or account system.
- No production backend or missing backend dependency.
- No payments, redemption, cash claims, or carbon-credit trading.
- No driver-facing features, social feed, chatbot, or full NCR routing.
- No live GPS, camera upload, maps, real-time transit, or production dispatch claims in implemented behavior.
- No trained-AI claim; documentation correctly calls the classifier rule-based.
- Phase 2 route is clearly labeled as a preview requiring future integration.
- The mobile dashboard screen is a clearly labeled Phase 0B placeholder.

No material feature scope creep was found. The Next dashboard starter exists because the broader repository MVP originally includes Phase 0B, but it remains a static foundation and is not required for this Phase 0A decision.

Presentation/claim scope concerns:

- The repository and UI use possessive `MMDA's Verified Mode-Shift Data Layer`, which can imply endorsement or ownership not evidenced in the repository.
- Confirmation says a report is added to an MMDA dashboard queue, softened by `in this prototype`; it is only local component state.
- Broader scope docs still define search plus a full dashboard as MVP completion, whereas the approved Phase 0A brief starts at comparison and explicitly defers dashboard work.

## 15. Documentation and Git Audit

Meaningful documentation mismatches:

1. The approved audit brief says `A Verified Multimodal Mode-Shift Platform for Metro Manila` and `Improve Access`; README, scope, UI guide, and app use `MMDA's Verified Mode-Shift Data Layer` and `Improve the Road`.
2. `docs/mvp-scope.md:44-58` includes route search and five dashboard views in Must Build; these are outside the approved Phase 0A flow. `docs/progress-tracker.md:15` correctly says search is Not started, but the broader completion definition can make Phase 0A appear incomplete for the wrong reason.
3. `docs/app-user-flow.md:60` says route detail shows a route map; code has no map.
4. `docs/progress-tracker.md:19` marks Trip playback Done even though the implementation does not progress through a trace.
5. `docs/progress-tracker.md:20,23` mark classifier/reward logic Done without noting the failed input invariants found by this audit.
6. `docs/classifier-rules.md` matches weights and high-level signals, but does not document invalid timestamp handling, unknown-route fallback, still-as-walking behavior, or the 95/45 output caps.
7. Reduced reward policy is not precise about the 50% Score, zero Points, full CO2e, and `verifiedTrips` increment.
8. `apps/mobile/README.md` omits route detail and report confirmation from its five-step summary.
9. `apps/dashboard/app/page.tsx:13-14` says the next build step is route data/comparison even though those mobile tasks are already complete.
10. README run commands are accurate for install, mobile, dashboard, and verify. There is no documented claim that `npm test` or a root build exists.

Git findings:

- Initial tree was clean and matched `origin/main`.
- Most feature commits are logically scoped and use `feat:`, `fix:`, `chore:`, or `docs:`.
- `ee6971b fixed issue` violates the repository's Conventional Commit rule and combines dependency/config changes, README, tracker, and a large lockfile rewrite.
- `b697e56 chore: clean up repository layout for collaboration` touches 100 files, but inspection shows it is primarily a logical repository-root move plus collaboration files.
- The merge commit is explicit and preserves remote metadata history.
- `node_modules`, `.next`, `.expo`, `dist`, `.check-output`, environment files, and common generated outputs are ignored and not tracked.
- No tracked `.env`, credential/key filename, generated build directory, or obvious secret token pattern was detected.

## 16. Security and Privacy Observations

This was an MVP-level inspection, not a penetration test.

- No committed API keys, tokens, private keys, or environment files were detected by tracked-file and secret-pattern scans.
- No production network calls, backend storage, or authentication surface exists.
- GPS fixtures and access-report coordinates are committed, but documentation identifies them as approximate prototype/sample corridor data. No user identity is attached to traces.
- A submitted description and selected demo location live only in React memory and are not transmitted or persisted.
- The report UI has no privacy/consent notice. Current collection is simulated, so immediate exposure is low, but consent, retention, minimization, and photo/location handling must be designed before real capture.
- React Native text rendering avoids an obvious HTML injection path for the description. There is no external persistence or dashboard rendering of user text yet.
- `npm audit` reports 12 moderate transitive vulnerabilities through PostCSS and uuid dependency paths. No direct exploit path was demonstrated in this static prototype, and the audit did not apply breaking automated fixes.

## 17. Defect Register

| ID | Severity | Area | Finding | Evidence | Recommended action |
|---|---|---|---|---|---|
| P0A-001 | Critical | Classifier/rewards | Invalid timestamps verify at 95% and receive full rewards. | `minutesBetween`, `packages/shared/src/classifier.ts:89-97`; runtime probe `invalidTimestampResult` and `invalidTimestampReward` | Reject invalid, duplicate, and non-increasing timestamps before scoring; add adversarial tests. |
| P0A-002 | Major | Classifier/route binding | Unknown route IDs fall back to sustainable, and a private-baseline route can verify 95%/Full. | `resolveRoute` and hardcoded corridor, `classifier.ts:114-145`; runtime probe | Fail closed for unknown/non-sustainable routes and score against selected route geometry/access points. |
| P0A-003 | Major | Reward invariants | Over-cap state remains 150/100; negative route rewards produce negative earnings/totals. | `rewards.ts:4-27,35-77`; runtime probe | Validate/clamp finite non-negative inputs and enforce `0 <= points <= cap` in output. |
| P0A-004 | Major | Classifier robustness | Malformed null trace points crash instead of returning a safe no-reward result. | Runtime probe error; `classifier.ts:148-162` | Add runtime schema validation and safe Unverified/Suspicious result. |
| P0A-005 | Major | Trip playback | Playback starts on segment 2, does not progress, and can complete immediately. | `apps/mobile/App.tsx:512-516,626-649` | Implement deterministic trace/segment progression, completion gating, and restart. |
| P0A-006 | Major | Classifier signal | Still/0 kph is counted as walking; suspicious fixture falsely passes walking detection. | `isWalkingLike`, `classifier.ts:110-112`; suspicious probe signals | Separate still from walking and require sustained/endpoint walking evidence. |
| P0A-007 | Major | Presentation/claims | UI omits full judge-safe limitation and uses wording that can imply MMDA ownership/queue integration. | `README.md:3-5`; `App.tsx:367,553-556,970-971`; classifier docs caveat | Align approved positioning and surface the no-perfect-mode-detection/prototype disclaimer. |
| P0A-008 | Major | Tests/lint | No test script; lint passes without running a linter; smoke checks cover curated cases only. | `package.json`; actual `npm test` failure and verify output | Add real lint and automated tests for classifier, rewards, form, and navigation boundaries. |
| P0A-009 | Major | Documentation/tracker | Tracker and scope docs overstate playback/classifier/reward completion and mix Phase 0A with search/dashboard scope. | `docs/progress-tracker.md:15-32`; `docs/mvp-scope.md:44-58` | Reconcile Phase 0A source of truth and mark audited modules Partial until fixes pass. |
| P0A-010 | Minor | Data architecture | Route, trace, and reward fixture data is duplicated between JSON and TypeScript. | `data/**` vs `packages/shared/src/routes.ts`, `traces.ts`, `demo-data.ts`; equality probe | Establish one authoritative source and validate/import it. |
| P0A-011 | Minor | Partial rewards | Reduced result credits full CO2e and increments `verifiedTrips`; policy is undocumented. | `rewards.ts:22-27,58-63`; reduced runtime probe | Define partial accounting and use separate completed/fully-verified counters if needed. |
| P0A-012 | Minor | Report confirmation | Confirmation omits ID, description, and timestamp; state is discarded on return to routes. | `App.tsx:951-1000,1069-1073` | Show complete prototype receipt and explicitly state session-only retention. |
| P0A-013 | Minor | Accessibility | Selected options lack accessibility state; placeholder contrast is 2.56:1; option target is about 43 px high. | `App.tsx:771-790,1421-1444,1478-1508`; contrast probe | Add `accessibilityState`, improve placeholder contrast, and ensure >=44 px targets. |
| P0A-014 | Minor | Dependencies | npm reports 12 moderate transitive vulnerabilities. | `npm install`; `npm audit --omit=dev` | Review supported Expo/Next patch paths; avoid blind breaking audit fixes. |
| P0A-015 | Minor | Git discipline | Latest commit is non-conventional and combines multiple concerns. | `ee6971b fixed issue`; commit stat | Resume scoped Conventional Commits and record validation per workflow. |
| P0A-016 | Observation | Trace provenance | Required traces are approximate/generated sample fixtures, not evidence of collected trips. | `data/traces/README.md`; `docs/classifier-rules.md:119-133`; regular synthetic coordinates/times | Label them generated prototype data everywhere and collect labeled local traces in formal pilot. |
| P0A-017 | Observation | Mode detection | GPS/speed/activity rules cannot reliably distinguish MRT/public transport, ride-hailing, and private car in congestion. | Route-agnostic `transitLikeMovement`; documented limitation | Preserve conservative claims; add corroborating signals and labeled validation during pilot. |

Defect totals: **0 Blocker, 1 Critical, 8 Major, 6 Minor, 2 Observation**.

## 18. Required Fixes Before Phase 0B

### Must fix before Phase 0B

| Recommendation | Affected file/module | Expected outcome | Effort |
|---|---|---|---|
| Validate timestamp parseability, ordering, duration, and zero-time movement. | `packages/shared/src/classifier.ts` | Invalid/non-increasing chronology fails closed and cannot earn rewards. | Medium |
| Bind classification to a known sustainable selected route and its geometry/access points. | `classifier.ts`, route models/data | Unknown/private routes cannot receive sustainable Full eligibility. | Medium |
| Add trace runtime validation and distinguish still from walking. | `classifier.ts`, `types.ts` | Empty/malformed points return safe no-reward results; walking requires credible evidence. | Medium |
| Enforce finite, non-negative reward/state values and the campaign cap invariant. | `packages/shared/src/rewards.ts` | Every output satisfies non-negative totals and Points <= cap. | Small |
| Replace static playback state with deterministic trace/segment progression and completion gating. | `apps/mobile/App.tsx` or extracted playback components | Judge can see the route progress from first to last segment and restart safely. | Medium |
| Add adversarial classifier/reward tests and report/navigation tests; configure a real linter. | `scripts/` or test framework, workspace packages | `npm test` and `npm run lint` become meaningful quality gates covering audit defects. | Medium |
| Correct Phase 0A tracker/status/source-of-truth documentation. | `docs/mvp-scope.md`, `docs/progress-tracker.md`, related READMEs | Completion claims match implemented and tested Phase 0A behavior. | Small |

### Should fix before judging

| Recommendation | Affected file/module | Expected outcome | Effort |
|---|---|---|---|
| Align approved product positioning/tagline and remove unverified possessive endorsement wording. | `README.md`, docs, `apps/mobile/App.tsx` | Presentation does not imply MMDA endorsement or live integration. | Small |
| Put the full judge-safe classifier limitation near the result. | `TripPlaybackScreen` / verification result UI | Evaluators see rule-based, imperfect mode detection and pilot-validation caveats. | Small |
| Define Reduced accounting for CO2e and verified-trip counts. | `rewards.ts`, `data-model.md`, classifier rules | Partial results cannot inflate fully verified metrics. | Small |
| Make route/trace fixtures single-source and schema-checked. | `data/`, `packages/shared/src/routes.ts`, `traces.ts` | No silent JSON/TypeScript drift. | Medium |
| Complete the confirmation receipt and state-retention language. | `ReportConfirmationScreen` | ID, description, timestamp, status, and session-only prototype behavior are clear. | Small |
| Address selected-state/touch-target/placeholder accessibility issues and test on target phones. | Mobile options/styles | Core form controls are perceivable and operable. | Small |
| Review moderate dependency advisories against supported Expo/Next releases. | `package.json`, `package-lock.json` | Documented dependency decision without a breaking blind downgrade/upgrade. | Medium |

### Can defer to formal pilot

| Recommendation | Affected file/module | Expected outcome | Effort |
|---|---|---|---|
| Collect labeled, consented Metro Manila traces across MRT, bus, jeepney, ride-hailing, private car, and congestion conditions. | Data collection/classifier validation | Empirical false-positive/false-negative evidence replaces fixture-only confidence. | Large |
| Add stronger corroborating signals and calibrated thresholds. | Classifier/pilot instrumentation | Better mode distinction without claiming perfect detection. | Large |
| Define privacy, consent, retention, security, and governance for real GPS/photo/report capture. | Product/legal/backend architecture | Pilot data handling is explicit and proportionate. | Large |
| Refactor the 1,751-line mobile file into screens/components after behavior is locked. | `apps/mobile/App.tsx` | Improved maintainability and component-level testing. | Medium |

## 19. Final Go/No-Go Recommendation

**NO-GO.**

The demonstrable happy path is real: data loads, TypeScript compiles, Android bundles, valid and suspicious fixtures reach different outputs, rewards are calculated, and the commuter screen-state chain is present. There is no Blocker preventing a scripted demo.

Phase 0A is nevertheless a proof of verification and reward integrity, not only a sequence of screens. A malformed timestamp trace currently earns a full reward, route identity is not enforced, reward invariants can be violated, and the playback requirement is only a static jump. Those defects make the mechanism too easy to misrepresent and too weak to serve as the foundation for Phase 0B insight/dashboard work.

Re-run this audit after the Must Fix items pass meaningful tests and a physical Android/Expo Go walkthrough. Proceed only when there are no Critical defects and the readiness score is at least 80.

## 20. Suggested Next Codex Tasks

1. **Classifier chronology task:** “Add runtime validation for GPS trace points and strictly increasing valid timestamps. Fail closed for invalid, duplicate, or reversed chronology. Add tests proving the audit invalid-timestamp fixture receives None.”
2. **Classifier route-binding task:** “Remove unknown-route fallback from `resolveRoute`; reject non-sustainable routes; derive corridor/proximity expectations from the selected route or an explicit route verification profile. Add unknown/private route tests.”
3. **Walking-signal task:** “Separate still from walking and require sustained endpoint walking evidence using activity plus plausible speed/distance. Add a stopped-private-vehicle adversarial trace.”
4. **Reward invariant task:** “Validate finite non-negative route rewards and user state; guarantee campaign Points are clamped to `[0, cap]`; define Reduced CO2e and trip-count behavior; add boundary tests.”
5. **Playback task:** “Implement deterministic, restartable trace playback over the three route segments with completion disabled until the final point, while keeping it explicitly labeled as an MVP simulation.”
6. **Quality-gate task:** “Add a test runner and real ESLint configuration; cover classifier adversarial inputs, reward caps, report validation, and commuter navigation state.”
7. **Presentation copy task:** “Align the approved positioning/tagline, add the judge-safe classifier caveat, and remove wording that implies live MMDA endorsement or queue integration.”
8. **Documentation reconciliation task:** “Separate Phase 0A and Phase 0B completion definitions and update the tracker so audited Partial/Fail modules are not marked Done.”
9. **Device QA task:** “Run the full valid and suspicious flows on target Expo Go 54 Android phones; capture screenshots, system-back behavior, repeated submissions, font scaling, and touch-target results.”

## Appendix A — Files Inspected

Important files inspected include:

- `README.md`
- `CONTRIBUTING.md`
- `package.json`, `package-lock.json`, `.gitignore`, `.prettierignore`
- `tsconfig.base.json`, `tsconfig.check.json`
- all files in `docs/` listed by the audit brief
- `apps/mobile/App.tsx`, mobile package/config/README
- dashboard package/config/README, page, layout, and CSS files
- all `packages/shared/src/*.ts`, shared package/config/README
- `scripts/check-classifier.ts`, `scripts/check-rewards.ts`
- route JSON/README under `data/routes/`
- both trace JSON fixtures and README under `data/traces/`
- reward/report JSON fixtures and README under `data/seed/`
- recent Git commits and file statistics for the 12-commit history

## Appendix B — Commands and Outputs

Key output summary:

- Initial branch/status/hash: `main`, clean, `ee6971bd2e03015f83067576a915e374addb418a`.
- `npm install`: up to date; 661 packages; 12 moderate advisories.
- `npm run verify`: exit 0; all three typechecks pass; Prettier pass; classifier valid 95/Full and suspicious 45/None; rewards valid +120/+40 and suspicious +0/+0.
- `npm run build --workspace=apps/dashboard`: exit 0; production compile/typecheck/static generation pass.
- `npm run build --workspace=packages/shared`: exit 0.
- Expo Doctor: 18/18 pass.
- Expo Android export: exit 0; 578 modules; 1.78 MB bundle.
- Exact `npm run mobile`: Metro waiting on port 8081, then auditor stopped it.
- Exact `npm run dashboard`: ready on port 3000; GET `/` 200, then auditor stopped it.
- `npm test`: exit 1, missing script.
- Root `npm run build`: exit 1, missing script; workspace builds pass.
- `npm audit --omit=dev`: exit 1 due 12 moderate advisories.
- Runtime probe: valid 95/Full; suspicious 45/None; invalid timestamps 95/Full/+120/+40; unknown/private routes 95/Full; malformed null points throw; over-cap/negative reward invariants fail.
- Secret scan: no tracked environment/key filenames and no secret-like token patterns in audited source.
- adb: no connected device; emulator command not available.

## Appendix C — Evidence References

- `docs/audits/phase-0a-evidence/runtime-probes.cjs` — executable audit probe for trace metrics, fixture equality, classifier determinism/boundaries, reward boundaries, and UI color contrast.
- `apps/mobile/dist/` — genuine Android export generated during the audit; ignored and not committed.
- `.check-output/` — generated CommonJS output used by existing checks and the audit probe; ignored and not committed.
- No screenshots were created because no native device/emulator was available.
