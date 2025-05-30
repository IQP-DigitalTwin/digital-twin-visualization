import { WeatherRef } from "@/types/Weather";
import moment from "moment";

export function getRandomWorkersUrls(): string {
  if (!process.env.JUMO_WORKERS_URLS) {
    throw new Error("Missing JUMO_WORKERS_URLS environnement variable");
  }

  const JUMO_WORKERS_URLS_ARRAY = process.env.JUMO_WORKERS_URLS?.split(",");
  return JUMO_WORKERS_URLS_ARRAY.map((JUMO_WORKER_URL) =>
    JUMO_WORKER_URL.trim(),
  )[Math.floor(Math.random() * JUMO_WORKERS_URLS_ARRAY.length)];
}

export function getHostUrl(): string {
  if (!process.env.HOST_URL) {
    throw new Error("Missing HOST environnement variable");
  }

  return process.env.HOST_URL;
}

// tmin : 4.3, tmax : 19.3, tmoy : 12.82
export function getRefWeather(): WeatherRef {
  return {
    department: "63",
    week: moment("2023-02-15").isoWeek(),
    day: "2023-02-15",
    temperatures: {
      tmin: 4.3,
      tmax: 19.3,
      tmoy: 12.82,
    },
  };
}
