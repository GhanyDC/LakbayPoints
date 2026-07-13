import type { GpsTracePoint } from "./types";

export const validSustainableGuadalupeCubaoTrace: GpsTracePoint[] = [
  {
    timestamp: "2026-07-08T00:00:00.000Z",
    latitude: 14.5658,
    longitude: 121.0438,
    speedKph: 4,
    activity: "walking",
  },
  {
    timestamp: "2026-07-08T00:04:00.000Z",
    latitude: 14.5662,
    longitude: 121.0449,
    speedKph: 4,
    activity: "walking",
  },
  {
    timestamp: "2026-07-08T00:06:00.000Z",
    latitude: 14.5664,
    longitude: 121.0455,
    speedKph: 0,
    activity: "still",
  },
  {
    timestamp: "2026-07-08T00:09:00.000Z",
    latitude: 14.5735,
    longitude: 121.048,
    speedKph: 24,
    activity: "in_vehicle",
  },
  {
    timestamp: "2026-07-08T00:13:00.000Z",
    latitude: 14.5818,
    longitude: 121.0531,
    speedKph: 27,
    activity: "in_vehicle",
  },
  {
    timestamp: "2026-07-08T00:16:00.000Z",
    latitude: 14.5868,
    longitude: 121.056,
    speedKph: 22,
    activity: "in_vehicle",
  },
  {
    timestamp: "2026-07-08T00:22:00.000Z",
    latitude: 14.608,
    longitude: 121.0562,
    speedKph: 24,
    activity: "in_vehicle",
  },
  {
    timestamp: "2026-07-08T00:26:00.000Z",
    latitude: 14.6196,
    longitude: 121.051,
    speedKph: 20,
    activity: "in_vehicle",
  },
  {
    timestamp: "2026-07-08T00:27:00.000Z",
    latitude: 14.6197,
    longitude: 121.0511,
    speedKph: 0,
    activity: "still",
  },
  {
    timestamp: "2026-07-08T00:30:00.000Z",
    latitude: 14.621,
    longitude: 121.052,
    speedKph: 4,
    activity: "walking",
  },
  {
    timestamp: "2026-07-08T00:33:00.000Z",
    latitude: 14.6223,
    longitude: 121.0531,
    speedKph: 4,
    activity: "walking",
  },
];

export const suspiciousTraceRejected: GpsTracePoint[] = [
  {
    timestamp: "2026-07-08T00:00:00.000Z",
    latitude: 14.5658,
    longitude: 121.0438,
    speedKph: 0,
    activity: "still",
  },
  {
    timestamp: "2026-07-08T00:01:00.000Z",
    latitude: 14.59,
    longitude: 121.0505,
    speedKph: 150,
    activity: "in_vehicle",
  },
  {
    timestamp: "2026-07-08T00:02:00.000Z",
    latitude: 14.6223,
    longitude: 121.0531,
    speedKph: 180,
    activity: "in_vehicle",
  },
  {
    timestamp: "2026-07-08T00:03:00.000Z",
    latitude: 14.6224,
    longitude: 121.0532,
    speedKph: 0,
    activity: "still",
  },
];
