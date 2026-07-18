# Route Data

The authoritative Phase 0A route model is the shared TypeScript source at
`packages/shared/src/routes.ts`. The JSON file in this directory is a
validated mirror for inspection and future integration work; application
screens must import the shared source and its derived-total helpers.

All current route values are static prototype data, not live routing,
schedule, traffic, or environmental-impact data. Ferry fare and CO2e avoided
remain pending pilot confirmation and calibration.
