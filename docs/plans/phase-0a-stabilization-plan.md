# LakbayPoints Phase 0A Stabilization Plan

## 1. Planning Context

This is the executable stabilization plan for the refreshed Phase 0A audit. It is a planning artifact only: no application code, fixtures, dependencies, formatting, or runtime behavior were changed while producing it.

The refreshed audit reports a readiness score of **51/100** and a **NO-GO** decision, with 0 Blockers, 2 Critical defects, 11 Major defects, 8 Minor defects, and 2 Observations. The stabilization objective is not to broaden the MVP. It is to make the final five-segment pilot journey internally consistent, fail closed at the verification and reward boundary, complete the demonstrable mobile flow, and supply evidence strong enough for a Phase 0A re-audit.

Planning principles:

- Treat the audit defect register in `docs/audits/phase-0a-audit-report.md` as the current defect baseline.
- Treat the product direction in Section 3 of this plan as the intended Phase 0A story; older Guadalupe-to-Cubao wording is superseded.
- Do not begin Phase 0B dashboard feature work until the go/no-go gate in Section 16 passes.
- Prefer a sequence of narrow, independently testable, independently revertible commits.
- Do not invent route time, distance, fare, dwell, or CO2e values. Unconfirmed values block the affected data/UI merge.
- Keep all data and claims explicitly static, simulated, estimated, prototype, or future-facing until an approved source supports a stronger label.

## 2. Current Repository State

State recorded before creating this plan:

| Check | Recorded result |
|---|---|
| `git status --short --branch` | `main...origin/main [ahead 5]`; no modified or untracked files |
| `git branch --show-current` | `main` |
| `git rev-parse HEAD` | `59ad43e192d31ad827f079175cd42a1a2d368448` |
| `git log --oneline -20` | Latest commits are `59ad43e docs: refresh phase 0a audit after frontend merge`, `5e791b5 chore: normalize merged frontend integration`, and merge commit `e5d176f` |
| Working tree | Clean at planning start |
| Audit report | Present at `docs/audits/phase-0a-audit-report.md` |

The audit evaluates the merged implementation at `5e791b5da0b17c621a180440372676f8bc974ebe`; commit `59ad43e` records the refreshed audit document. The repository is an npm workspace monorepo with the Expo app in `apps/mobile`, the deferred Next.js dashboard starter in `apps/dashboard`, shared domain code in `packages/shared`, static fixtures in `data`, and smoke scripts in `scripts`.

Current implementation facts that drive this plan:

- `App.tsx` opens on `planTrip`, while the approved comparison/detail/playback/reward/report flow remains behind miswired tabs.
- `NewScreens.tsx` holds hardcoded route, heatmap/crowd/safety, XP, streak, reward-total, and redemption content that bypasses shared data and Phase 0A scope.
- `routes.ts`, `traces.ts`, `demo-data.ts`, and `data/**` contain duplicated active fixture data.
- The classifier is hardcoded to the old northbound Guadalupe-Cubao corridor, accepts invalid chronology, falls back from unknown route IDs, accepts private route objects, crashes on null trace points, and counts still points as walking.
- Reward calculation does not defend against negative/non-finite inputs or an already-invalid over-cap state, and Reduced accounting is not product-defined.
- Playback begins on the second of three old segments and jumps to completion without trace progression.
- Root `npm test` and `npm run build` are missing; root lint currently succeeds without invoking a linter.
- The dashboard application is Phase 0B scope and should remain functionally unchanged during stabilization.

## 3. Final Product and Pilot-Journey Alignment

The stabilized presentation must use:

- **Product name:** LakbayPoints
- **Formal positioning:** A Verified Multimodal Mode-Shift Platform for Metro Manila
- **Tagline:** Guide the Trip. Verify the Shift. Improve Access.

The authoritative Phase 0A journey is ordered as follows:

1. Jeepney or approved public-road-transport access from the confirmed home/access area to MRT-3 Araneta Center-Cubao.
2. MRT-3 from Araneta Center-Cubao to Guadalupe.
3. Walk from MRT-3 Guadalupe to the Guadalupe Pasig River Ferry station.
4. Pasig River Ferry from Guadalupe to Hulo.
5. Walk from Hulo Ferry Station to the confirmed office/demo destination.

This is five segments across four mode families: public road transport, MRT, walking, and ferry. The first mode must remain worded generically as public road transport unless the product team confirms that the pilot fixture is specifically a jeepney journey.

Every active UI, fixture, script, test, and document must agree on the route direction and segment order. The old Guadalupe-to-Cubao `Walk -> MRT3 -> Walk` story must not remain reachable or silently selectable in the current Phase 0A application.

Presentation constraints:

- Do not use possessive MMDA wording or imply MMDA ownership, endorsement, live queueing, or completed integration.
- Use only Lakbay Score, described as non-cash progress, and capped campaign Lakbay Points.
- Remove current-looking redemption, QR ticket, transit credit, merchant discount, raffle, XP, level, streak, bonus-point, and unrelated badge content from Phase 0A.
- Do not call CO2e estimates carbon credits.
- Describe verification as a rule-based confidence engine with known limits, not perfect AI mode detection.
- Remove unsupported heatmap, density, crowd, and safety claims, or retain only an unmistakably labeled non-operational placeholder if the product team explicitly requires it.
- Label route values and trace fixtures as static prototype estimates/generated prototype data until their source status changes.

## 4. Consolidation Decisions

### Workstream 1 — Product Alignment, Navigation, and Shared Frontend Data

| Required question | Decision |
|---|---|
| 1. Implement together? | Keep these items in one product-alignment workstream, but do **not** implement them in one patch. Freeze product decisions first, migrate the route contract/source second, align content third, and repair navigation fourth. Route data is a prerequisite for rendering, while navigation has a distinct regression surface. |
| 2. Likely files | `README.md`; `docs/mvp-scope.md`; `docs/app-user-flow.md`; `docs/data-model.md`; `docs/ui-style-guide.md`; `apps/mobile/App.tsx`; `apps/mobile/NewScreens.tsx` or extracted screen/navigation modules; `apps/mobile/README.md`; `packages/shared/src/types.ts`; `packages/shared/src/routes.ts`; new shared pilot-data/profile files; active/archive route and trace fixture paths. |
| 3. Dependencies first | Product-team decisions for exact endpoints, first public-road mode, comparison cards, route estimates, transfer dwell, CO2e method, and retained tabs. The quality-gate foundation should land before behavior changes. |
| 4. Combining risks | A broad frontend/data patch could hide total mismatches, break imports, make navigation regressions hard to isolate, or mix content removal with a route-schema migration. It would also make rollback restore misleading UI accidentally. |
| 5. One Codex run? | Use **several smaller runs**: product decision record; route contract/data migration; frontend scope/data rendering; navigation/accessibility. Do not ask one run to rewrite both 2,900+ lines of mobile UI and the shared model. |
| 6. Separate commits | `docs: record phase 0a pilot decisions`; `feat: migrate phase 0a pilot route data`; `fix: align phase 0a frontend scope and route data`; `fix: repair phase 0a navigation state`. Extract-only refactoring, if necessary, should be a separate no-behavior-change commit after tests exist. |
| 7. Acceptance criteria | One active route source; five ordered segments; aggregates derived and tested; no old current route; no unsupported/live operational claims; no out-of-scope reward catalog; initial CTA works; each retained tab reaches its label; reward results remain verification-gated; approved positioning appears consistently; route/navigation test matrix passes. |
| 8. Rollback | Revert each commit independently. Preserve the old fixture only in an explicitly excluded archive so the data migration can be reverted without reconstructing data. If navigation fails, revert navigation without restoring removed reward/redemption content. |

### Workstream 2 — Classifier and Reward Integrity

| Required question | Decision |
|---|---|
| 1. Implement together? | Keep classifier and reward work in one integrity workstream because the classifier is the reward boundary, but split it into three changes: input/route eligibility validation; route-bound signal logic; reward invariants/policy. Reward code must consume a stable classifier contract, not compensate for classifier failures. |
| 2. Likely files | `packages/shared/src/types.ts`; `classifier.ts`; `rewards.ts`; `routes.ts`; route verification profile module; shared exports; active trace fixtures; shared tests; existing smoke scripts. |
| 3. Dependencies first | Workstream 1 route schema, route ID, access points, transfer points, and verification profile; product decision for Reduced accounting; quality test runner. Final trace calibration also requires approved static route values/points. |
| 4. Combining risks | Changing validation, score signals, thresholds, route direction, and rewards simultaneously makes it impossible to identify why eligibility changed. Overfitting a new valid fixture can also disguise private-mode false positives. Reward clamps alone can mask invalid upstream state. |
| 5. One Codex run? | Use **three smaller runs**: fail-closed input and route validation; route-bound/walking signals with adversarial tests; reward invariants and accounting. Re-audit probes should be run after each. |
| 6. Separate commits | `fix: reject malformed and ineligible trip traces`; `fix: bind classifier signals to the pilot route`; `fix: enforce phase 0a reward invariants`. Tests should be committed with each behavior fix, not in a later omnibus test commit. |
| 7. Acceptance criteria | Invalid, duplicate, reversed, null, empty, unknown, private, mismatched, suspicious, and missing-access-walk cases produce no reward; valid final-route fixture remains deterministic and eligible as approved; still is never walking; every reward output is finite/non-negative and `0 <= campaignPoints <= cap`; Reduced policy matches docs; all adversarial tests and audit probes pass. |
| 8. Rollback | Revert the smallest behavior commit and its tests together. Preserve the prior score weights in history, not parallel runtime flags. Never roll back only the tests or keep a reward clamp while re-enabling an unknown-route fallback. |

### Workstream 3 — Playback and End-to-End Mobile Flow

| Required question | Decision |
|---|---|
| 1. Implement together? | Deterministic playback and the flow state that consumes its result belong together conceptually, but implementation should be two passes: playback engine/component first, then navigation/report/back/accessibility integration. |
| 2. Likely files | `apps/mobile/App.tsx`; `apps/mobile/NewScreens.tsx` or extracted `screens`, `components`, and a typed flow-state module; active valid/suspicious traces from shared pilot data; mobile tests; possibly `apps/mobile/package.json` only for the selected test tooling. |
| 3. Dependencies first | Final five-segment route, active trace fixtures, stable classifier result contract, reward policy, and repaired navigation destinations. |
| 4. Combining risks | A timer-driven UI can create flaky tests and race conditions; changing playback, tabs, state reset, report receipt, and Android-back handling in one patch makes lost state difficult to diagnose. |
| 5. One Codex run? | Use **two runs**: deterministic/restartable playback with fake-time tests; then E2E state/report/back/accessibility behavior. Physical-device QA is a separate human-assisted run. |
| 6. Separate commits | `feat: add deterministic five-segment playback`; `fix: complete phase 0a mobile flow semantics`; `test: cover phase 0a mobile flow and reporting` if test volume cannot remain reviewable in the behavior commit. |
| 7. Acceptance criteria | Playback begins at segment 1, advances in route order, cannot complete early, supports restart, and labels simulation; valid and suspicious fixtures can be selected; mid-flow tab and back behavior is deliberate; reward cannot be opened without verification; report is reachable; state reset has tests; accessibility roles/states and target sizes pass review; mobile test matrix passes. |
| 8. Rollback | Revert playback independently to the last verified non-playback screen; do not restore immediate completion. Keep the classifier callable through a clearly labeled test control if playback is temporarily rolled back. Revert flow-state changes separately from visual styling. |

### Workstream 4 — Quality Gates, Documentation, Device QA, and Re-audit

| Required question | Decision |
|---|---|
| 1. Implement together? | Split this workstream across the program: quality infrastructure lands first; docs, device evidence, and re-audit land last. A test runner and real lint cannot wait until after behavior fixes, while status docs must describe the final result. |
| 2. Likely files | Root and workspace `package.json` files; lockfile; ESLint/test configuration; test setup files; `README.md`; mobile/shared READMEs; scope/flow/model/classifier/UI/Git docs; `docs/progress-tracker.md`; new QA evidence/checklist files; refreshed audit/evidence. |
| 3. Dependencies first | Test/lint setup depends only on current workspace compatibility. Final docs and re-audit depend on all implementation work and physical Android QA. Dependency additions must be chosen for Expo SDK 54/React 19 compatibility. |
| 4. Combining risks | Adding tools, formatting application files, fixing behavior, and rewriting status docs in one commit produces noisy diffs and false completion claims. Re-auditing before device evidence could repeat the current evidence gap. |
| 5. One Codex run? | Use **at least three runs**: quality-gate setup; final documentation/QA runbook; evidence collection and independent re-audit. Device QA requires a person/attached device and should not be simulated by source inspection. |
| 6. Separate commits | `chore: add phase 0a quality gates`; `docs: reconcile phase 0a status and qa procedure`; `docs: record phase 0a device qa evidence`; `docs: refresh phase 0a readiness audit`. Lockfile changes stay only with the tooling commit. |
| 7. Acceptance criteria | Lint invokes a real linter; root test/build scripts exist; all Section 11 commands pass from a clean install; docs do not mark Partial/Fail work Done; Android checklist is completed with evidence; re-audit reaches Section 16 gate. |
| 8. Rollback | Revert tooling as one commit including lockfile. Revert documentation separately if it gets ahead of behavior. Never delete prior audit evidence; add a dated replacement. A failed re-audit remains recorded as evidence and triggers another stabilization iteration. |

## 5. Workstream Dependencies

The workstreams are not four parallel merges. The safe dependency order is:

```text
Product decisions
  -> W4A quality-gate/test foundation
  -> W1 route contract and single source
  -> W1 frontend scope/data alignment and navigation
  -> W2 input/route validation
  -> W2 route-bound signals
  -> W2 reward invariants
  -> W3 playback
  -> W3 end-to-end flow/report/accessibility
  -> W4B docs + device QA + re-audit
```

Limited parallelism is safe only after the route contract is frozen:

- Frontend presentation cleanup can proceed beside classifier input validation if neither changes shared route types.
- Reward invariant tests can be drafted while route-bound classifier work proceeds, but reward behavior must merge after the Reduced-accounting decision and stable classifier contract.
- Device-QA preparation can be written early, but execution and evidence collection must use the release candidate.

No Phase 0B dashboard feature should be on this graph. The existing dashboard build remains a regression gate only.

## 6. Route Migration Plan

### 6.1 Migration decision

Replace the active Guadalupe-to-Cubao route with the final Cubao-to-Guadalupe-to-PRFS-to-Hulo journey. Retain the old route and its two traces only as audit-history fixtures under an explicit archive such as `data/archive/guadalupe-cubao/`. Archived data must not be exported by `@lakbaypoints/shared`, imported by mobile code, selected by a fallback, or included in current happy-path tests.

If repository history is considered sufficient provenance, the product team may approve deleting the old active copies instead. Archiving is preferred for one stabilization cycle because it preserves the exact fixtures behind the 51/100 audit while keeping them mechanically unavailable to production code.

### 6.2 Authoritative source

Use one versioned static pilot-data package under `packages/shared/src/pilot-data/`:

- one canonical route catalog JSON or typed fixture for the final active route;
- one canonical route-verification profile;
- canonical generated-prototype valid and suspicious traces for the final route;
- a loader/validator in `packages/shared/src/routes.ts` (or a narrowly named adapter module);
- exported selectors such as `getPhase0APilotRoute()` and `getPhase0ARouteOptions()`.

The preferred implementation is a JSON fixture colocated inside `packages/shared/src/pilot-data/`, imported and runtime-validated by shared code. This avoids the current root-level JSON/TypeScript duplication and stays within the shared package build boundary. Root `data/routes` and `data/traces` should contain archive/evidence only, with READMEs pointing to the active canonical source. If implementation proves that JSON import/build constraints are unsafe, use one typed `satisfies` fixture in the same shared folder instead; do not keep a second manually maintained JSON copy.

Mobile screens, classifier, playback, smoke scripts, and tests must import the same shared exports. They must not copy route metrics into JSX.

### 6.3 Route and segment contract

Extend the shared types only as far as the final journey needs:

- `RouteOption` (or a new `PilotRoute`) has a stable `id`, schema/version, origin access-point ID, destination access-point ID, ordered `segments`, ordered `transfers`, reward configuration, CO2e estimate metadata, and data-status/label metadata.
- `RouteSegment` has stable ID, mode, origin access-point ID, destination access-point ID, display label, estimated movement time, distance, estimated fare, and optional geometry/corridor reference.
- The public-road segment uses an approved `jeepney` mode only after confirmation; otherwise add/use a truthful generic `public_road_transport` mode rather than claiming a specific service.
- `TransferPoint` references the segment before and after it, the access point, an estimated dwell time, and a transfer label. Transfer time is not hidden inside both adjacent segments.
- `AccessPoint` includes stable ID, display name, kind, latitude/longitude when approved, and a prototype verification radius. Kinds should cover home/access area, road loading/access point, MRT station, intermodal walking endpoint, ferry terminal, and destination.
- `PrototypeDataMetadata` includes status (`static_prototype`, `official`, or `future_preview`), visible label, source/owner when approved, optional as-of date, and methodology note.

The five active segment records must expose these fields, with values supplied by the product team or an approved data source:

| Field | Required handling |
|---|---|
| Segment mode | Exact enum; first segment remains generic until jeepney is confirmed |
| Origin/destination | Access-point IDs plus display names; no ambiguous station-only shorthand |
| Time | Static estimated movement minutes; no number until confirmed |
| Distance | Static estimated kilometers; no number until confirmed |
| Fare | Per-segment estimated PHP fare; walking may be zero, but the policy must be explicit |
| Transfer/dwell | Separate transfer record with access-point ID and estimated minutes |
| Estimated CO2e | Route-level avoided-CO2e estimate plus method/baseline metadata; segment values only if supported |
| Prototype-data label | Visible static/simulated/estimated label carried by data and rendered by UI |

### 6.4 Preventing aggregate drift

- Derive route movement time, transfer/dwell time, total time, total distance, and total fare through shared selectors from segments/transfers.
- Do not hand-maintain the same total in JSX or in a second fixture.
- If a route-level expected total is retained for source reconciliation, validation must fail when it disagrees with the derived value, rather than choosing one silently.
- Use one rounding policy for distance, fare, CO2e, and displayed totals. Tests compare normalized numbers, while UI formats at the final boundary.
- Render every route card, Plan Trip row, detail row, playback step, and result summary from the same route object.

### 6.5 Verification profile without full map matching

Add a `RouteVerificationProfile` keyed by the exact active sustainable route ID and schema version. It should contain:

- eligibility (`sustainable` only) and expected direction;
- the ordered five segment IDs and expected mode family for each;
- required start/end access points and transfer access points;
- approved proximity radii for those access points;
- plausible activity/speed bands by mode family;
- minimum evidence for each walking segment;
- transfer-dwell ranges where confirmed;
- optional coarse corridor/polygon/polyline buffers for segment-level containment;
- trace-quality rules: finite coordinates/speed, valid strictly increasing timestamps, minimum points/duration, and no impossible jumps.

The classifier should validate the trace, resolve an exact known route, reject non-sustainable routes, and then look for ordered access/transfer-zone visits plus plausible segment evidence. This provides route binding without pretending to identify every point on a full production map. It should not infer ferry versus private car from speed alone; the result copy must preserve the rule-based limitation.

### 6.6 Future official data replacement

Keep UI and classifier consumers behind shared route selectors/types. A future approved MMDA/partner/static dataset or API adapter can produce the same validated contract and change `PrototypeDataMetadata.status` without redesigning screens. Source attribution and effective date belong in data metadata, not scattered UI strings. Live API loading, caching, telemetry, and full map matching remain outside Phase 0A.

### 6.7 Unresolved data values

No final travel time, distance, fare, transfer-dwell, verification radius, or CO2e number is approved by the repository documents inspected for this plan. Those fields must be supplied/approved before Step 3 merges. Until then, use explicit `TBD` in a decision record, not guessed numeric placeholders in active application data.

## 7. Defect-to-Task Mapping

| Defect ID | Planned workstream | Planned task | Files/modules | Test/acceptance evidence |
|---|---|---|---|---|
| P0A-001 | W2 | Validate parseable, strictly increasing timestamps and reject zero-time movement before scoring | `classifier.ts`, trace validator/types, classifier tests | Invalid, duplicate, and reversed timestamp cases return None and zero reward |
| P0A-002 | W1 + W2 | Remove route fallback; require exact known sustainable route and bind checks to its verification profile | route catalog/profile, `classifier.ts`, types/tests | Unknown ID, private baseline object, and mismatched corridor all fail closed |
| P0A-003 | W2 | Normalize/validate finite non-negative reward inputs and enforce output cap invariant | `rewards.ts`, reward types/tests | Negative/non-finite/over-cap matrix passes; every output is within bounds |
| P0A-004 | W2 | Add runtime trace schema validation and safe no-reward result | trace validator, `classifier.ts`, tests | Null point and malformed field cases never throw and receive None |
| P0A-005 | W3 | Implement deterministic five-segment trace playback, completion gating, and restart | playback screen/component/state, active traces, mobile tests | First-to-last progression, early-complete rejection, restart, valid/suspicious selection |
| P0A-006 | W2 | Separate still from walking and require sustained endpoint walking evidence | verification profile, `classifier.ts`, adversarial traces/tests | Still-only endpoints fail; credible first/last walking cases pass as designed |
| P0A-007 | W1 + W3 + W4 | Apply approved positioning and judge-safe prototype/rule-engine wording; remove endorsement/live-queue implications | README/docs, mobile headers/result/report copy | Claim inventory test/review finds no possessive endorsement or completed-live language |
| P0A-008 | W4 | Add compatible test runner, real ESLint, and root scripts; convert audit probes into regression cases | root/workspace manifests, lockfile, configs, tests/scripts | `npm run lint`, `npm test`, root build, and verify do real work and pass |
| P0A-009 | W4 | Reconcile scope, flow, model, classifier docs, READMEs, and tracker with tested state | `docs/**`, READMEs | No failed/partial item marked Done; final route and commands documented |
| P0A-018 | W1 | Remove the current-looking rewards dashboard/catalog and unrelated gamification from Phase 0A | `NewScreens.tsx`, `App.tsx`, navigation/components | No redeem/QR/credit/discount/raffle/XP/level/streak content in active Phase 0A UI |
| P0A-019 | W1 + W3 | Establish a typed destination map, working entry CTA, correct retained tabs, synchronized active state, and deliberate reset/back behavior | `App.tsx`, bottom tabs/flow-state module, mobile tests | All navigation matrix cases pass; no stale tab; report/reward destinations truthful |
| P0A-020 | W1 | Render plan/comparison/detail exclusively from shared final route selectors and derived totals | route data/selectors, mobile screens/tests | Five segments and all displayed totals match the authoritative source |
| P0A-021 | W1 | Remove unsupported heatmap/density/crowd/safety content or make an approved explicit placeholder | Plan Trip/map presentation, copy tests/review | No live-sounding unsupported operational claim appears in active UI |

## 8. Detailed Implementation Sequence

### Step 1 — Record and approve the Phase 0A product/data decisions

- **Objective:** Remove ambiguity before code changes.
- **Exact scope:** Create a short decision record covering exact endpoints, first public-road mode, active comparison options, approved per-segment estimates, transfer/dwell values, CO2e methodology, reward/Reduced policy, tabs, and claims/attribution.
- **Files likely changed:** New decision record under `docs/decisions/`; possibly `docs/mvp-scope.md` only to link it.
- **Files that must not change:** `apps/**`, `packages/**`, `data/**`, package manifests, lockfile.
- **Required tests:** Documentation review against Section 15; no code gate beyond format check.
- **Proposed commit:** `docs: record phase 0a pilot decisions`
- **Effort:** Small for recording, potentially schedule-blocking for product approval.
- **Dependencies:** None; product team owns the answers.
- **Merge readiness:** Every blocking decision is answered by a named approver/source; no invented value remains.

### Step 2 — Establish meaningful quality gates

- **Objective:** Ensure every subsequent behavior change has executable regression evidence.
- **Exact scope:** Add an Expo/React-19-compatible mobile test setup, a Node/shared logic test setup, real ESLint configuration, workspace test/lint/build scripts, root orchestration, and convert current smoke checks into retained checks rather than deleting them. Prefer an Expo-compatible Jest/React Native Testing Library setup for mobile and a fast TypeScript-capable Node test runner for shared logic; validate exact versions against SDK 54 before editing the lockfile.
- **Files likely changed:** Root and workspace `package.json`; `package-lock.json`; ESLint/test config and setup files; minimal initial tests proving the harness runs.
- **Files that must not change:** Application behavior, route values, classifier/reward logic, docs status claims, dashboard page content.
- **Required tests:** Clean `npm ci`; real lint identifies a deliberately tested fixture/config violation; a trivial shared test and mobile render/state test run; typecheck; dashboard build; format check.
- **Proposed commit:** `chore: add phase 0a quality gates`
- **Effort:** Medium.
- **Dependencies:** Step 1 is not required for tooling, so this can begin while decisions are collected.
- **Merge readiness:** `npm run lint`, `npm test`, `npm run build`, and `npm run verify` exist, execute meaningful work, and pass without formatting unrelated source.

### Step 3 — Migrate the final route contract and fixtures

- **Objective:** Establish the final journey as the only active, validated route source.
- **Exact scope:** Add access/transfer/data-metadata/verification-profile types; create the approved five-segment fixture and final valid/suspicious trace fixtures; add derived aggregate selectors and validation; update exports/scripts; archive the old corridor fixtures and make fallback impossible.
- **Files likely changed:** `packages/shared/src/types.ts`, `routes.ts`, `traces.ts`, `index.ts`, new `pilot-data/**` and validation/profile modules, `scripts/**`, `data/routes/**`, `data/traces/**`, archive README, shared tests.
- **Files that must not change:** Mobile JSX/layout, reward algorithm, classifier scoring beyond compile-safe consumption of the new interface, dashboard application source.
- **Required tests:** Route schema; five ordered segments/four mode families; origin/destination continuity; access/transfer reference integrity; time/distance/fare derivation; expected-total reconciliation; prototype labels; archive not exported; trace/profile IDs match.
- **Proposed commit:** `feat: migrate phase 0a pilot route data`
- **Effort:** Large.
- **Dependencies:** Steps 1 and 2.
- **Merge readiness:** Product-approved values are present; no old active import or duplicate source remains; shared build/typecheck/tests pass.

### Step 4 — Align frontend scope, route rendering, and presentation claims

- **Objective:** Make every visible Phase 0A value and claim truthful and shared-data-driven.
- **Exact scope:** Render Plan Trip/comparison/detail from final route selectors; add a clear entry CTA; remove active redemption/gamification UI; remove or explicitly label unsupported operational placeholders; update positioning, tagline, route direction, prototype labels, and verification limitation copy. Extract a small data-driven segment list if needed, without broad visual redesign.
- **Files likely changed:** `apps/mobile/App.tsx`, `NewScreens.tsx` or extracted Plan Trip/route components, mobile tests, `README.md` for product header copy.
- **Files that must not change:** Classifier scoring/rewards, route values/source, report persistence model, dashboard source, unrelated global styling.
- **Required tests:** Initial CTA; route rendering from fixture; aggregate display; five segment labels/order; no forbidden reward/claim strings in active screens; snapshot/role queries for visible prototype labels.
- **Proposed commit:** `fix: align phase 0a frontend scope and route data`
- **Effort:** Medium.
- **Dependencies:** Steps 2 and 3.
- **Merge readiness:** P0A-018, P0A-020, and P0A-021 evidence passes; approved presentation portion of P0A-007 passes.

### Step 5 — Repair typed navigation and tab state

- **Objective:** Make destinations, active state, back/reset behavior, and labels agree.
- **Exact scope:** Define typed screen/tab destination mapping; keep only approved tabs; map Report to report; ensure Rewards cannot bypass verification; synchronize tab selection with screen changes; define mid-flow tab interruption and reset policy; add tab accessibility roles/selected state and Android-back policy hook/handler.
- **Files likely changed:** `apps/mobile/App.tsx`, bottom-tab/navigation component or extracted flow-state module, mobile navigation tests.
- **Files that must not change:** Route fixture, classifier, rewards, playback timing, report schema, dashboard source.
- **Required tests:** All seven navigation cases in Section 10 plus tab role/selected-state assertions and back/reset transition tests.
- **Proposed commit:** `fix: repair phase 0a navigation state`
- **Effort:** Medium.
- **Dependencies:** Steps 2 and 4.
- **Merge readiness:** Every retained label reaches its named destination; no cast-based fallback; no stale active tab; verification gate is preserved.

### Step 6 — Fail closed on malformed chronology and ineligible routes

- **Objective:** Close the most direct classifier/reward-boundary failures before signal calibration.
- **Exact scope:** Runtime-validate input object, trace array/points, finite coordinates/speeds, timestamps, and strictly increasing chronology; reject zero-time movement; resolve exact route IDs only; reject private/future/non-sustainable objects; return a safe no-reward result without throwing.
- **Files likely changed:** `packages/shared/src/classifier.ts`, types/trace validator, classifier tests, smoke/audit-probe tests.
- **Files that must not change:** Score weights, route geometry/profile thresholds, reward calculation, mobile presentation, fixtures except test-local adversarial builders.
- **Required tests:** Invalid/duplicate/reversed timestamps; null point; empty trace; unknown route; private baseline; future route if retained; non-finite fields; deterministic safe result.
- **Proposed commit:** `fix: reject malformed and ineligible trip traces`
- **Effort:** Medium.
- **Dependencies:** Steps 2 and 3.
- **Merge readiness:** P0A-001, P0A-002 route-eligibility portion, and P0A-004 pass; every rejected result produces zero rewards in an integration assertion.

### Step 7 — Bind verification signals to the final route

- **Objective:** Replace old-corridor assumptions and still-as-walking logic with a conservative route profile.
- **Exact scope:** Consume the final verification profile; require ordered start/transfer/end evidence; use direction and coarse corridor/proximity checks; distinguish still/dwell from sustained walking; require both walking segments; preserve suspicious override and explicit limitations; calibrate only against approved generated fixtures and adversarial counterexamples.
- **Files likely changed:** `classifier.ts`, profile/types, active trace fixtures only if approved evidence requires correction, shared tests, classifier rules docs only after behavior stabilizes.
- **Files that must not change:** Reward values/policy, frontend navigation, route numeric values, dashboard source, full map/API architecture.
- **Required tests:** Valid final multimodal; suspicious; route mismatch; still-not-walking; missing first walk; missing last walk; wrong transfer order; deterministic score bounds; private-car-like adversarial case does not become Full solely from speed.
- **Proposed commit:** `fix: bind classifier signals to the pilot route`
- **Effort:** Large.
- **Dependencies:** Steps 3 and 6.
- **Merge readiness:** P0A-002 route-binding portion and P0A-006 pass; all classifier cases in Section 10 pass; rule limitations remain visible/documented.

### Step 8 — Enforce reward invariants and approved partial accounting

- **Objective:** Guarantee reward safety even when upstream/input state is hostile or already invalid.
- **Exact scope:** Validate/normalize finite non-negative route rewards and user state; clamp the current and updated campaign total to `[0, cap]`; define handling when cap is invalid; implement approved Reduced Lakbay Score, Points, CO2e, and trip-count policy; round stored/displayed CO2e consistently; document pure calculation and render/idempotency boundary.
- **Files likely changed:** `packages/shared/src/rewards.ts`, reward/user-state types if necessary, `demo-data.ts` only if the approved policy changes its schema, reward tests, smoke script, reward docs.
- **Files that must not change:** Classifier thresholds/signals, route estimates, UI navigation, redemption features, dashboard source.
- **Required tests:** All ten reward cases in Section 10 and classifier-to-reward integration for every fail-closed input.
- **Proposed commit:** `fix: enforce phase 0a reward invariants`
- **Effort:** Medium.
- **Dependencies:** Steps 1, 2, and 6; use Step 7's final result semantics where applicable.
- **Merge readiness:** P0A-003 passes; `0 <= points <= cap` and finite/non-negative outputs hold for all inputs; partial policy matches code/docs/UI.

### Step 9 — Implement deterministic five-segment playback

- **Objective:** Turn playback into an observable, restartable simulation that gates verification.
- **Exact scope:** Drive progress from the canonical trace and route segment/access-point boundaries; begin at first point/segment; advance by explicit Next/Play controls or a fake-timer-safe deterministic clock; disable completion until the final point; support pause/restart if a clock is used; preserve valid/suspicious fixture selection; clearly label generated/static simulation.
- **Files likely changed:** Playback screen or extracted component/hook/state machine, mobile tests, shared trace selectors if needed.
- **Files that must not change:** Classifier scoring, reward math, route values, report flow, bottom-tab destinations, dashboard source.
- **Required tests:** Initial state; ordered five-segment progress; no early completion; final completion; restart; fixture switch reset; repeated completion does not duplicate reward state; simulated label.
- **Proposed commit:** `feat: add deterministic five-segment playback`
- **Effort:** Large.
- **Dependencies:** Steps 3, 5, 7, and 8.
- **Merge readiness:** P0A-005 passes in component tests and the full valid/suspicious flow; tests use fake timers or explicit actions with no sleep/flakiness.

### Step 10 — Complete and test the end-to-end mobile/report experience

- **Objective:** Close flow, reporting, state, and accessibility gaps around the stabilized core.
- **Exact scope:** Verify valid/suspicious journeys through rewards and report; show report ID, description, created time, status, and session-only disclosure in confirmation; use collision-resistant prototype IDs within the session; add selected accessibility states, contrast/touch-target fixes, font-scale resilience, and explicit Android-back/mid-flow behavior.
- **Files likely changed:** Mobile flow/report/confirmation components and styles, navigation state, mobile test fixtures/suites.
- **Files that must not change:** Shared route values, classifier thresholds, reward policy, dashboard feature content, backend/network/auth code.
- **Required tests:** Navigation and Reporting matrices in Section 10; valid/suspicious E2E component flows; accessibility queries; state reset; repeated submission uniqueness; no network call.
- **Proposed commits:** `fix: complete phase 0a mobile flow semantics`; `test: cover phase 0a mobile flow and reporting` if separation improves reviewability.
- **Effort:** Medium.
- **Dependencies:** Steps 4 through 9.
- **Merge readiness:** Zero open Major defect affects the source-tested E2E flow; all automated gates pass; release candidate is ready for a physical device.

### Step 11 — Reconcile documentation, execute device QA, and re-audit

- **Objective:** Produce release evidence and a defensible Phase 0A decision.
- **Exact scope:** Update scope/flow/data/classifier/UI/READMEs/tracker to tested truth; document static source and limitations; run all clean quality gates; execute Section 12 on physical Android Expo Go; capture evidence; rerun the audit against the release-candidate commit and score it.
- **Files likely changed:** Repository docs and READMEs, `docs/progress-tracker.md`, QA evidence under `docs/qa/` or audit evidence, refreshed audit report.
- **Files that must not change:** Application behavior, dependencies, fixtures, route/reward values, dashboard features. Any discovered code defect returns to the owning earlier step rather than being fixed inside the audit commit.
- **Required tests:** All Section 11 commands; completed Section 12 checklist; re-audit defect probes; documentation link/status review.
- **Proposed commits:** `docs: reconcile phase 0a status and qa procedure`; `docs: record phase 0a device qa evidence`; `docs: refresh phase 0a readiness audit`.
- **Effort:** Medium, excluding time to obtain a device/product approvals.
- **Dependencies:** Steps 1 through 10.
- **Merge readiness:** Every gate in Section 16 passes. Otherwise retain NO-GO and open narrowly scoped follow-up defects.

## 9. File-Level Change Map

| Area | Likely change | Ownership/guardrail |
|---|---|---|
| `apps/mobile/App.tsx` | Replace ad hoc screen/tab switches, consume final route, integrate playback/report flow | Split by behavior; avoid a simultaneous visual rewrite |
| `apps/mobile/NewScreens.tsx` | Remove out-of-scope rewards/claims; make Plan Trip data-driven; likely split tested components | Do not retain hidden active redemption content |
| `apps/mobile/package.json` | Real lint/test/build scripts and compatible test dependencies | Tooling commit only; lockfile with it |
| `apps/mobile/README.md` | Final flow, static-data, Expo QA, and file structure | Update only after behavior passes |
| `packages/shared/src/types.ts` | Access points, transfers, metadata, verification profile, safer inputs | Avoid speculative production-backend types |
| `packages/shared/src/routes.ts` | Validate/export one final route source and derived totals | No old-route fallback or JSX constants |
| `packages/shared/src/traces.ts` | Export only final active valid/suspicious traces | Generated-prototype provenance visible |
| `packages/shared/src/classifier.ts` | Runtime validation, exact route binding, profile-based evidence, walking correction | Conservative rule engine; no perfect-mode claim |
| `packages/shared/src/rewards.ts` | Finite/non-negative/cap invariants and partial policy | Pure calculation; no redemption ledger |
| `packages/shared/src/demo-data.ts` | Keep cap-consistent seed aligned to shared schema | No XP/level/streak fields |
| `packages/shared/src/pilot-data/**` | Canonical route/profile/trace fixture set | Single manually maintained active source |
| `packages/shared/package.json` | Shared lint/test scripts | Tooling-only commit first |
| `data/routes/**`, `data/traces/**` | Archive old corridor and remove active duplicates | Archive excluded from exports/tests |
| `data/seed/**` | Reconcile only if shared seed becomes canonical | Do not maintain a second active state copy |
| `scripts/**` | Keep smoke checks; import shared canonical data; add audit regression probes as tests | Smoke scripts are not a substitute for test runner |
| Root `package.json`/lock/config | Meaningful lint/test/build/verify orchestration | No blind dependency upgrades or audit fixes |
| `apps/dashboard/**` | Build regression only | No Phase 0B feature changes during stabilization |
| `README.md`, `docs/**` | Approved product wording, final flow/model/rules/status/QA/re-audit | Never mark a failed/partial module Done |

## 10. Automated Test Plan

Tests should live with the owning workspace. Shared logic tests run in a Node environment; React Native screen/flow tests use an Expo-compatible renderer and fake timers/explicit actions. Existing smoke scripts remain a fast demo check, while the cases below become assertions with failure exits.

### 10.1 Classifier matrix

| Case | Expected evidence |
|---|---|
| Valid multimodal trace | Final five-segment generated fixture verifies at the product-approved tier; deterministic score; eligible reward only if all required evidence passes |
| Suspicious trace | Suspicious result, None eligibility, zero reward |
| Invalid timestamp | Safe rejected result; no throw; zero reward |
| Duplicate timestamp | Strict chronology rejection; zero reward |
| Reversed timestamp | Strict chronology rejection; zero reward |
| Null trace point | Runtime validation returns safe rejected result; no throw; zero reward |
| Empty trace | Safe rejected result; zero reward |
| Unknown route | No fallback; Unverified/Suspicious and zero reward |
| Private baseline route | Ineligible before scoring; zero reward |
| Still but not walking | Walking signal false; cannot receive Full |
| Route mismatch | Wrong corridor/direction/transfer order fails route match and receives zero reward under fail-closed policy |
| Missing first-mile walking | Missing first public-access/walking evidence prevents Full and Points |
| Missing last-mile walking | Missing Hulo-to-destination walking evidence prevents Full and Points |

Add malformed arrays/objects, non-finite coordinates/speeds, and repeated-call determinism as supporting cases even though they are not substitutes for the required matrix.

### 10.2 Reward matrix

| Case | Expected evidence |
|---|---|
| Full verification | Approved Lakbay Score/Points, CO2e, and counters applied once; totals finite |
| Partial verification | Approved Reduced policy exactly; no accidental full CO2e/trip count |
| Unverified | Zero earnings and no counter/CO2e mutation |
| Suspicious | Zero earnings regardless of route reward fields |
| Points near cap | Earn only remaining capacity and end exactly at cap |
| Already-over-cap invalid state | Normalize safely to cap; never return a value over cap |
| Negative reward input | Reject or normalize to zero per documented policy; never reduce user totals |
| Non-finite reward input | Reject or normalize safely; every output remains finite |
| Duplicate calculation/render protection | Pure repeated calculation is identical and render/re-entry does not mutate or double-award state |
| CO2e rounding and partial accounting | Stable decimal policy and product-approved partial credit/counter behavior |

Property-style invariant assertions should run across boundary values: cap is finite/non-negative, Lakbay Score and Points never decrease from malformed reward input, and `0 <= updatedCampaignPoints <= campaignPointsCap`.

### 10.3 Route-data matrix

| Case | Expected evidence |
|---|---|
| Segment time sum equals route total | Shared selector includes explicit transfer/dwell time exactly once; any retained expected total matches |
| Segment distance sum equals route total | Shared selector matches any displayed/retained route total under one rounding rule |
| No future route presented as live | Future option is absent or visibly `future_preview` and non-selectable for verification/reward |
| Prototype values carry correct labels | Active route/source metadata renders static/simulated/estimated wording on plan/detail/playback |

Also assert five ordered segments, four mode families, access-point continuity, valid transfer references, fare total consistency, and no archived fixture export.

### 10.4 Navigation matrix

| Case | Expected evidence |
|---|---|
| Initial screen has working entry CTA | CTA reaches the approved route comparison/detail start |
| Each retained tab reaches named destination | Typed destination assertion for every retained tab |
| Reward screen cannot bypass verification | Direct tab/deep state without `verifiedTrip` cannot show earned reward result |
| Report reachable through approved flow | Approved CTA/tab reaches report without mislabeled routing |
| Valid and suspicious flows work | Both traverse playback -> result -> reward with correct outcomes |
| State reset is intentional | Back/tab/reset policy clears or preserves named fields exactly as documented |
| No stale active-tab state | Selected semantics and visible screen remain synchronized through transitions |

### 10.5 Reporting matrix

| Case | Expected evidence |
|---|---|
| Empty form | Validation error; no submission |
| Partial form | Validation error names missing requirements; no submission |
| Valid submission | Exact category, severity, location, trimmed description, placeholder photo, timestamp captured |
| Unique report ID | Repeated same-session submissions produce distinct IDs even within the same clock tick |
| Correct Submitted status | New receipt and state use `Submitted` |
| Confirmation fields | ID, category, severity, location, description, created time, and status visible |
| Session-only prototype disclosure | Confirmation clearly says local/session-only and does not claim live MMDA queueing |

### 10.6 Presentation and accessibility regression checks

- Active-screen text inventory contains the approved product name, positioning/tagline, static-data label, and rule-engine limitation.
- Active-screen text inventory excludes possessive MMDA ownership, completed-live integration, current redemption products, XP/levels/streaks, and unlabeled heatmap/crowd/safety claims.
- Retained tabs expose tab/button roles, accessible names, and selected state.
- Option controls expose selected state; touch targets are at least 44 logical pixels; tested text/background pairs meet the agreed contrast target.
- Playback tests do not depend on real-time sleeps.

## 11. Quality-Gate Commands

Implementation must create the missing root/workspace scripts so this clean-install sequence passes on the release-candidate commit:

```powershell
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run verify
npm run build --workspace=apps/dashboard
```

Then, from `apps/mobile`:

```powershell
npx expo-doctor
npx expo export --platform android --output-dir dist
```

Script expectations:

- Root `lint` must run a real ESLint command across applicable workspaces and fail on lint violations; it must not pass only because workspace scripts are absent.
- Root `test` must run shared and mobile automated suites, including the full matrices in Section 10.
- Root `build` must build shared and dashboard and produce a non-interactive Android export either directly or through a mobile workspace build script. If the mobile export is intentionally kept separate for speed, the root build contract must be documented and the exact Expo export remains a mandatory release gate.
- Root `verify` should include typecheck, real lint, format check, automated tests, and retained classifier/reward smoke checks. Avoid making `verify` call itself through a workspace script.
- Dashboard build remains a regression gate only; it does not authorize Phase 0B feature work.
- Run from a clean clone/install state in CI or a clean worktree. Generated `dist`, `.check-output`, coverage, and Expo artifacts remain ignored and unstaged.
- Review the existing 12 moderate transitive advisories separately. Do not run a breaking `npm audit fix --force` as part of stabilization.

## 12. Device-QA Plan

Use a physical Android phone supported by Expo Go 54. Record device model, Android version, Expo Go version, commit hash, date/time, network condition, orientation, and tester. Capture screenshots at the named checkpoints and a continuous backup video of both core outcomes.

### Setup

- Run `npm ci`, all automated gates, and Android export first.
- Start the documented Expo command from a clean Metro cache if needed.
- Confirm the app displays the release-candidate commit/build label if one is added for QA, without exposing it as production content.
- Prepare one smaller-screen phone or emulator-like physical device where practical; physical primary walkthrough remains mandatory.

### Checklist

- [ ] **Initial entry and CTA:** cold launch opens the approved Plan Trip/comparison surface, shows the final direction and prototype label, and the primary CTA enters the core flow.
- [ ] **Complete valid trip:** traverse five ordered segments; completion stays disabled until the end; verification and reward values match the automated valid case; capture Plan Trip, playback middle, verification, and reward screenshots.
- [ ] **Suspicious trip:** restart/select suspicious fixture; verify Suspicious/None and zero Score/Points/CO2e credit; capture result screenshot.
- [ ] **Playback restart:** restart before and after completion; progress returns to segment 1 and stale classifier/reward output clears.
- [ ] **Android back button:** exercise back from detail, playback, reward, report, and confirmation; no blank screen, accidental exit, bypass, or stale selected tab.
- [ ] **Changing tabs mid-flow:** switch at detail/playback/report; confirm the documented reset/preserve policy, truthful destination, and synchronized selected state.
- [ ] **Repeated report submission:** submit twice with valid fields; IDs differ, receipt fields are complete, and session-only wording is visible.
- [ ] **Smaller screen:** verify five-segment content, CTA, tabs, form fields, and receipt scroll without clipping or overlap.
- [ ] **Font scaling:** test default and at least one enlarged Android font setting; essential text and controls remain readable/reachable.
- [ ] **Portrait and landscape:** rotate on plan, playback, reward, and report; no data loss, clipped CTA, or unusable tab bar. If portrait-only is the approved product decision, enforce and document it instead of claiming landscape support.
- [ ] **Offline/static-data behavior:** after initial bundle load, disable network; core route, playback, classifier, rewards, and report remain usable; UI does not imply fresh/live operational data.
- [ ] **Screenshot and backup video:** store named evidence by commit hash, with one uninterrupted valid flow and one suspicious flow; redact notification/user data.

Failure handling: log the exact screen, action, device, expected/actual behavior, screenshot/video timestamp, and owning implementation step. Any Critical or E2E Major failure returns the release candidate to NO-GO; do not waive it through documentation.

## 13. Commit and Merge Strategy

- Start each implementation step from an up-to-date stabilization branch using the repository-required `codex/` prefix unless the team names a release branch.
- Do not rewrite the existing merge history. Use normal commits and merge/rebase only under the repository Git workflow.
- Keep generated files, Expo exports, coverage, and audit scratch output unstaged.
- Stage with explicit paths and inspect `git diff --cached` before every commit.
- Put tests in the same commit as the defect fix whenever practical. Tooling, fixture/schema migration, frontend content, navigation, classifier validation, classifier signals, rewards, playback, flow/report, documentation, device evidence, and re-audit remain separate commits.
- Keep `package-lock.json` changes only with the dependency/tooling commit that requires them.
- Require review after Steps 2, 3, 7, 9, and 11 because they establish gates/contracts or have the widest behavioral impact.
- Merge readiness means the step's local tests plus all already-established root gates pass; a later step may not knowingly merge on a red earlier gate.
- Record the release-candidate commit used for physical QA and audit. If code changes after QA, rerun affected device scenarios and all automated gates.

Recommended branch/commit flow:

```text
codex/phase-0a-stabilization
  docs: record phase 0a pilot decisions
  chore: add phase 0a quality gates
  feat: migrate phase 0a pilot route data
  fix: align phase 0a frontend scope and route data
  fix: repair phase 0a navigation state
  fix: reject malformed and ineligible trip traces
  fix: bind classifier signals to the pilot route
  fix: enforce phase 0a reward invariants
  feat: add deterministic five-segment playback
  fix: complete phase 0a mobile flow semantics
  test: cover phase 0a mobile flow and reporting
  docs: reconcile phase 0a status and qa procedure
  docs: record phase 0a device qa evidence
  docs: refresh phase 0a readiness audit
```

## 14. Risks and Rollback Strategy

| Risk | Mitigation | Rollback |
|---|---|---|
| Product values remain unapproved | Block active fixture merge; keep `TBD` in decision record only | No code rollback needed; do not guess |
| Route schema migration breaks mobile/shared builds | Land one source plus validation and compile consumers before UI changes | Revert Step 3 atomically; archive preserves prior evidence |
| Old fixture remains reachable | Export/import tests and repository search for old IDs/direction | Revert offending consumer; do not unarchive as active fallback |
| Classifier is overfit to the happy fixture | Adversarial private/mismatch/still/chronology cases; conservative reward gate | Revert Step 7 and retain Step 6 fail-closed validation |
| New validation rejects legitimate generated trace | Log failed signal, correct approved fixture/profile with evidence, not by weakening all validation | Revert/calibrate Step 7 only; keep invalid-input rejection |
| Reward clamp hides invalid state | Validate and surface normalization in tests/messages; keep upstream integration tests | Revert reward commit as a unit; never remove cap tests alone |
| Playback tests become flaky | Explicit state actions or fake timers; no wall-clock sleeps | Revert playback commit without restoring immediate verification |
| UI cleanup changes visual layout unexpectedly | Behavior/content assertions first; device screenshots at fixed checkpoints | Revert frontend component commit without reverting route source |
| Tab interruption loses state unexpectedly | Document reset matrix and test every transition | Revert navigation/flow commit independently |
| Tooling conflicts with Expo SDK 54 | Use Expo-compatible versions; isolate dependency/lock changes | Revert tooling commit and lockfile together |
| Bundle grows further | Import only used icons, inspect export module/bundle output | Revert offending UI/dependency commit; retain functional fixes |
| Docs claim completion before evidence | Tracker statuses follow tests/device/audit, not implementation intent | Revert docs commit; keep accurate prior audit |
| No physical Android device available | Schedule owner/device before release date; source/bundle checks are not substitutes | Maintain NO-GO until device QA completes |

Rollback uses `git revert` of scoped commits, not destructive reset/history rewriting. Audit and QA evidence is append-only: a failed run remains available and is superseded by a new dated run.

## 15. Decisions Required From the Product Team

The following decisions block or materially shape implementation:

1. Exact name/location/coordinates of the home/access origin.
2. Exact name/location/coordinates of the office/demo destination after Hulo.
3. Whether segment 1 is specifically jeepney or generic public road transport, including loading/access point.
4. Approved five segment movement times, distances, and fares, with source/as-of date.
5. Approved transfer/dwell locations and times at Cubao, Guadalupe MRT-to-ferry, and Hulo.
6. Approved access-point verification radii/coarse geometry or permission to mark them generated prototype estimates.
7. Private baseline and/or future comparison card policy. If retained, approved values and labels are required; otherwise remove them from Phase 0A.
8. CO2e baseline, method, rounding, and approved estimate; confirmation that it is never called a carbon credit.
9. Full and Reduced Lakbay Score policy, campaign Points amount/cap, Reduced CO2e credit, and whether Reduced increments a verified-trip counter.
10. Whether the campaign cap applies globally to existing state normalization and what user-facing message explains an invalid imported over-cap state.
11. Retained bottom tabs and the intended mid-flow tab/reset behavior; whether a Rewards tab exists only after verification.
12. Approved report entry points and receipt fields; session-only wording; removal of live MMDA queue implications.
13. Approved product attribution/partner wording, including whether and how MMDA/JICA/source names may appear.
14. Whether any heatmap/map placeholder remains. If yes, its visible simulated/static label and data source; otherwise remove it.
15. Target Android device range, minimum screen size, font-scale expectation, and portrait-only versus landscape support.
16. Provenance/consent label for generated valid and suspicious traces and ownership of later collected pilot traces.
17. Whether the old route fixtures should remain archived for audit history or be removed after migration verification.

All approved answers should be recorded in Step 1 with named owner/date/source. Technical implementation should not silently choose product policy.

## 16. Re-audit and Go/No-Go Criteria

Phase 0A remains **NO-GO** until a re-audit of the release-candidate commit confirms all of the following:

- Readiness score is at least **80/100**.
- There are **zero Critical defects**.
- There are **zero open Major defects affecting the end-to-end demo**.
- Every command in Section 11 passes from a clean install.
- A physical Android Expo Go walkthrough in Section 12 is completed with evidence.
- All active route values and displays are generated from one authoritative source.
- Invalid, duplicate/reversed timestamp, malformed, empty, unknown-route, private-route, route-mismatch, and suspicious traces cannot receive rewards.
- Campaign Points cap invariants always hold, including invalid starting state; reward outputs remain finite/non-negative.
- The valid five-segment route completes through playback, verification, reward, report, and receipt; suspicious flow awards zero.
- Prototype/static/estimated/future versus live claims are clear at the point of use.
- No current-looking redemption, QR/transit-credit/merchant/raffle, XP, level, streak, or unrelated gamification surface is active.
- Documentation/tracker matches tested behavior and does not mark failed or partial modules Done.

The re-audit should rerun the original runtime probes after converting them to maintained tests, inspect current source/claims, record bundle/build results, and attach device evidence. A score below 80 or any failed mandatory item keeps the decision at NO-GO regardless of visual polish.

## 17. Recommended First Implementation Prompt

Do not execute this prompt until the product-team decisions required by Step 1 are recorded. The first code task should establish test gates before migrating behavior:

> You are implementing Step 2 of `docs/plans/phase-0a-stabilization-plan.md` only. Add meaningful Phase 0A quality gates without changing application behavior, route/reward values, UI copy/layout, classifier logic, or dashboard features. Configure an Expo SDK 54/React 19-compatible mobile test setup, a TypeScript-capable Node/shared logic test setup, and real ESLint. Add root/workspace scripts so `npm run lint`, `npm test`, `npm run build`, and `npm run verify` perform real work. Preserve existing classifier/reward smoke checks. Add only minimal harness tests proving shared and mobile suites execute. Keep dependency and `package-lock.json` changes in this task, do not format unrelated files, run the clean quality-gate commands that are available, and commit as `chore: add phase 0a quality gates`. Report changed files, commands, results, and any Expo compatibility concern; do not begin route migration or defect fixes.

After that commit merges and the Step 1 decisions are approved, the next prompt should implement only the single-source route contract/migration in Step 3.
