// The shapes the API speaks in, restated for this client.
//
// Hand-written rather than generated, deliberately: the whole question this
// repository exists to answer is whether an agent working *here* — with no
// access to the backend's source — is told the shape of a new response and
// writes it correctly.

export interface Sensor {
  id: string;
  label: string;
  zone: string;
}

export interface Reading {
  sensor_id: string;
  taken_at: string;
  celsius: number;
  humidity: number;
}

export interface ReadingPage {
  sensor_id: string;
  readings: Reading[];
  next_cursor: string | null;
}
