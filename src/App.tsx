import { useEffect, useState } from "react";
import { fetchSensors } from "./api";
import { SensorPanel } from "./components/SensorPanel";
import type { Sensor } from "./types";

export function App() {
  const [sensors, setSensors] = useState<Sensor[]>([]);

  useEffect(() => {
    fetchSensors().then(setSensors).catch(() => setSensors([]));
  }, []);

  return (
    <main>
      <h1>Greenhouse</h1>
      {sensors.map((sensor) => (
        <SensorPanel key={sensor.id} sensorId={sensor.id} />
      ))}
    </main>
  );
}
