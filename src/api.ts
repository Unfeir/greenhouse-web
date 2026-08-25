// Every call this client makes to greenhouse-api.
//
// One place, so a change to the API surface has one place to land, and so the
// tests can exercise the client without a DOM.

import type { ReadingPage, Sensor, SensorSummary } from "./types";

const BASE = "/api/v1";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE}${path}`);
  if (!response.ok) {
    throw new Error(`${path} failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export function fetchSensors(): Promise<Sensor[]> {
  return getJson<Sensor[]>("/sensors");
}

export function fetchReadings(sensorId: string, limit = 24): Promise<ReadingPage> {
  return getJson<ReadingPage>(`/sensors/${sensorId}/readings?limit=${limit}`);
}

export function fetchSensorSummary(sensorId: string): Promise<SensorSummary> {
  return getJson<SensorSummary>(`/sensors/${sensorId}/summary`);
}
