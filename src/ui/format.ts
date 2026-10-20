import { colors } from "./colors";
import type { Units } from "../types";

export interface LabeledCity {
  name: string;
  admin1?: string;
  country?: string;
}

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const WEATHER_CODES: Record<number, string> = {
  0: "☀️  Despejado",
  1: "🌤️  Mayormente despejado",
  2: "⛅ Parcialmente nublado",
  3: "☁️  Nublado",
  45: "🌫️  Niebla",
  48: "🌫️  Niebla con escarcha",
  51: "🌦️  Llovizna ligera",
  53: "🌦️  Llovizna moderada",
  55: "🌦️  Llovizna intensa",
  56: "🌧️  Llovizna helada ligera",
  57: "🌧️  Llovizna helada intensa",
  61: "🌧️  Lluvia ligera",
  63: "🌧️  Lluvia moderada",
  65: "🌧️  Lluvia intensa",
  66: "🌧️  Lluvia helada ligera",
  67: "🌧️  Lluvia helada intensa",
  71: "🌨️  Nieve ligera",
  73: "🌨️  Nieve moderada",
  75: "🌨️  Nieve intensa",
  77: "🌨️  Granos de nieve",
  80: "🌦️  Chubascos ligeros",
  81: "🌦️  Chubascos moderados",
  82: "🌦️  Chubascos violentos",
  85: "🌨️  Chubascos de nieve ligeros",
  86: "🌨️  Chubascos de nieve intensos",
  95: "⛈️  Tormenta",
  96: "⛈️  Tormenta con granizo ligero",
  99: "⛈️  Tormenta con granizo intenso",
};

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
