import { colors } from "./colors";
import { WEEKDAYS, WEATHER_CODES } from "./constants";
import type { Units } from "../types";

export interface LabeledCity {
  name: string;
  admin1?: string;
  country?: string;
}

/** Temperatura en la unidad activa, resaltada en amarillo. */
export function formatTemperature(tempC: number, units: Units): string {
  const value = units === "C" ? tempC : tempC * (9 / 5) + 32;
  return colors.yellow(`${value.toFixed(1)} °${units}`);
}

/** Etiqueta legible para un código WMO de Open-Meteo. */
export function weatherCodeLabel(code: number): string {
  return WEATHER_CODES[code] ?? "❓ Desconocido";
}

/** "Sáb 17/10" a partir de una fecha ISO `YYYY-MM-DD`. */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) {
    return iso;
  }
  const date = new Date(year, month - 1, day);
  const weekday = WEEKDAYS[date.getDay()] ?? "";
  return `${weekday} ${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`;
}

/** "Nombre, Región, País" omitiendo campos vacíos o repetidos. */
export function cityLabel(city: LabeledCity): string {
  const parts = [city.name];
  if (city.admin1 && city.admin1 !== city.name) {
    parts.push(city.admin1);
  }
  if (city.country) {
    parts.push(city.country);
  }
  return parts.join(", ");
}
