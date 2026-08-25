// One sensor's current state, and the place a new control goes.
//
// Kept plain on purpose — no state library, no styling, no router. A ticket that
// says "add a button here" should be about the button and what it calls, not
// about finding the button's home.

import { useEffect, useState } from "react";
import { fetchReadings } from "../api";
import type { Reading } from "../types";

export function SensorPanel({ sensorId }: { sensorId: string }) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReadings(sensorId, 12)
      .then((page) => setReadings(page.readings))
      .catch((problem: Error) => setError(problem.message));
  }, [sensorId]);

  if (error !== null) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section>
      <h2>{sensorId}</h2>
      <ul>
        {readings.map((reading) => (
          <li key={reading.taken_at}>
            {reading.taken_at}: {reading.celsius}°C / {reading.humidity}%
          </li>
        ))}
      </ul>
    </section>
  );
}
