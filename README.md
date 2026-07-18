# LakbayPoints MVP

LakbayPoints is **A Verified Multimodal Mode-Shift Platform for Metro Manila**.

**Tagline:** Guide the Trip. Verify the Shift. Improve Access.

This repository contains a competition prototype for the MMITS Bagong Gawi,
Bagong Galaw Challenge. Its controlled Phase 0A pilot journey is:

1. Jeepney from Cubao Home/Access Zone to MRT-3 Araneta-Cubao Station
2. MRT-3 to MRT-3 Guadalupe Station
3. Walk to Guadalupe Ferry Station
4. Pasig River Ferry to Hulo Ferry Station
5. Walk to Hulo Office Demo Destination

The current values are static prototype data. They are not live routing,
schedule, traffic, or environmental-impact data. The ferry fare is pending
confirmation and CO2e avoided is pending pilot calibration.

## Core MVP Loop

Guide the Trip → Verify the Shift → Reward Verified Behavior → Report Access
Barriers → Agency Dashboard Preview

LakbayPoints is not presented as owned, operated, or officially endorsed by
MMDA.

## Repository Structure

```txt
apps/
  mobile/          Expo React Native commuter prototype
  dashboard/       Next.js agency-dashboard prototype
packages/
  shared/          Shared TypeScript routes, types, classifier, and rewards
data/
  routes/          Validated JSON mirror of the shared route source
  traces/          Sample GPS traces
  seed/            Demo reports and reward state
docs/              Product scope, data model, UI guide, workflow, progress
scripts/           Local smoke-check scripts
```

The authoritative application route source is
`packages/shared/src/routes.ts`. Plan Trip, Route Comparison, and Route Detail
import this source and its derived-total helpers. The JSON route file is
validated against it by tests.

## Local Development

Install the locked dependency tree from the repository root:

```bash
npm ci
```

Run the Expo mobile app:

```bash
npm run mobile
```

The mobile workspace is pinned to Expo SDK 54 and supports Expo Go 54.0.8 on
Android. Use LAN when the computer and phone share a reachable network:

```bash
npm run mobile:lan
```

Use a tunnel when the phone cannot reach the computer's local IP address:

```bash
npm run mobile:tunnel
```

If Expo Go opens an old bundle, clear the Metro cache:

```bash
npm run mobile:clear
```

Physical iPhones cannot sideload an older Expo Go release. Use an Android
device, an iOS simulator with the SDK 54 client, or a dedicated development
build when Expo Go 54 is unavailable from the iOS App Store.

Run the dashboard prototype:

```bash
npm run dashboard
```

Run the complete repository verification suite:

```bash
npm run verify
```

Useful individual checks:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run format:check
npm run check:classifier
npm run check:rewards
```

## Collaboration Notes

- Read `docs/mvp-scope.md` before adding product behavior.
- Use Conventional Commits as documented in `docs/git-workflow.md`.
- Keep changes scoped to the approved MVP loop.
- Do not add auth, live APIs, maps, GPS capture, camera upload, payment,
  reward redemption, carbon credits, or driver features unless scope changes.
- Update `docs/progress-tracker.md` after meaningful changes.

## Build Principle

This is a competition prototype, not a production system. Keep the code
demo-stable, explicit about pending calibration, and easy for collaborators to
understand.
