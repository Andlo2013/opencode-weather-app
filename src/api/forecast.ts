import { fetchJson } from "./client";
import type { DailyForecast, ForecastResponse } from "../types";

const FORECAST_BASE = "https://api.open-meteo.com/v1/forecast";

export async function getCurrentWeather(
  latitude: number,
  longitude: number
): Promise<ForecastResponse> {
  const url = new URL(FORECAST_BASE);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "temperature_2m");
  url.searchParams.set("timezone", "auto");

  return fetchJson<ForecastResponse>(url);
}

export async function getDailyForecast(
  latitude: number,
  longitude: number,
  days = 7
): Promise<DailyForecast[]> {
  const url = new URL(FORECAST_BASE);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
  );
  url.searchParams.set("forecast_days", String(days));
  url.searchParams.set("timezone", "auto");

  const data = await fetchJson<ForecastResponse>(url);
  return toDailyForecast(data);
}

/** Aplana los arrays paralelos que devuelve Open-Meteo en días individuales. */
function toDailyForecast(data: ForecastResponse): DailyForecast[] {
  const daily = data.daily;
  if (!daily) {
    return [];
  }

  const result: DailyForecast[] = [];
  for (let i = 0; i < daily.time.length; i += 1) {
    const date = daily.time[i];
    const weatherCode = daily.weather_code[i];
    const tempMax = daily.temperature_2m_max[i];
    const tempMin = daily.temperature_2m_min[i];

    if (
      date === undefined ||
      weatherCode === undefined ||
      tempMax === undefined ||
      tempMin === undefined
    ) {
      continue;
    }

    result.push({
      date,
      weatherCode,
      tempMax,
      tempMin,
      precipitationProbability: daily.precipitation_probability_max?.[i] ?? null,
    });
  }
  return result;
}
