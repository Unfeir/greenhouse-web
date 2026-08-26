// The suite an agent must keep green.
//
// Deliberately the API layer only, with no DOM and no component rendering. The
// failure worth seeing in this scenario is a client written against the wrong
// contract; a rendering harness would add a second way to be red for reasons
// nobody is asking about.

import { afterEach, expect, test, vi } from "vitest";
import { fetchReadings, fetchSensors, fetchStats } from "./api";

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

test("stats are requested at the sensor's stats path", async () => {
  const fetchMock = vi.fn(async () => ({
    ok: true,
    json: async () => ({
      sensor_id: "s-1",
      mean_celsius: "18.5",
      low_celsius: "17.0",
      high_celsius: "20.1",
      n_readings: 12,
    }),
  }));
  vi.stubGlobal("fetch", fetchMock);

  await fetchStats("s-1");

  expect(fetchMock).toHaveBeenCalledWith("/api/v1/sensors/s-1/stats");
});

test("a well-formed stats response is parsed through unchanged", async () => {
  respondWith({
    sensor_id: "s-1",
    mean_celsius: "18.5",
    low_celsius: "17.0",
    high_celsius: "20.1",
    n_readings: 12,
  });

  const stats = await fetchStats("s-1");

  expect(stats).toEqual({
    sensor_id: "s-1",
    mean_celsius: "18.5",
    low_celsius: "17.0",
    high_celsius: "20.1",
    n_readings: 12,
  });
  expect(typeof stats.mean_celsius).toBe("string");
  expect(typeof stats.low_celsius).toBe("string");
  expect(typeof stats.high_celsius).toBe("string");
});

test("a failed stats request is an error rather than an empty result", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: false, status: 500, json: async () => ({}) })),
  );

  await expect(fetchStats("s-1")).rejects.toThrow("500");
});
