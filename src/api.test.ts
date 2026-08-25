// The suite an agent must keep green.
//
// Deliberately the API layer only, with no DOM and no component rendering. The
// failure worth seeing in this scenario is a client written against the wrong
// contract; a rendering harness would add a second way to be red for reasons
// nobody is asking about.

import { afterEach, expect, test, vi } from "vitest";
import { fetchReadings, fetchSensors, fetchSensorSummary } from "./api";

function respondWith(body: unknown): void {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, json: async () => body })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

test("sensors come back as a list", async () => {
  respondWith([{ id: "s-1", label: "North bench", zone: "propagation" }]);

  const sensors = await fetchSensors();

  expect(sensors[0].id).toBe("s-1");
  expect(sensors[0].zone).toBe("propagation");
});

test("readings come back as a page", async () => {
  respondWith({ sensor_id: "s-1", readings: [], next_cursor: null });

  const page = await fetchReadings("s-1");

  expect(page.sensor_id).toBe("s-1");
  expect(page.next_cursor).toBeNull();
});

test("a failed request is an error rather than an empty page", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: false, status: 404, json: async () => ({}) })),
  );

  await expect(fetchReadings("nope")).rejects.toThrow("404");
});

test("a summary comes back with its figures", async () => {
  respondWith({ sensor_id: "s-1", average: 21.5, minimum: 18, maximum: 25, count: 3 });

  const summary = await fetchSensorSummary("s-1");

  expect(summary.sensor_id).toBe("s-1");
  expect(summary.average).toBe(21.5);
  expect(summary.count).toBe(3);
});

test("a summary with no readings has null figures and a zero count", async () => {
  respondWith({ sensor_id: "s-1", average: null, minimum: null, maximum: null, count: 0 });

  const summary = await fetchSensorSummary("s-1");

  expect(summary.average).toBeNull();
  expect(summary.minimum).toBeNull();
  expect(summary.maximum).toBeNull();
  expect(summary.count).toBe(0);
});

test("a summary request for an unknown sensor is an error", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: false, status: 404, json: async () => ({}) })),
  );

  await expect(fetchSensorSummary("nope")).rejects.toThrow("404");
});
