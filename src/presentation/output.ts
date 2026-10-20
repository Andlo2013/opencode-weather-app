import { colors } from "../utils/colors";
import { cityLabel, formatDate, formatTemperature, weatherCodeLabel } from "../utils/format";
import type { City, DailyForecast, ForecastResponse, Units } from "../types";

/** Salida estándar de mensajes de la CLI. */

export function success(message: string): void {
  console.log(`\n${colors.green(message)}\n`);
}

export function info(message: string): void {
  console.log(`\n${colors.cyan(message)}\n`);
}

export function warn(message: string): void {
  console.log(`\n${colors.yellow(message)}\n`);
}

export function error(message: string): void {
  console.error(`\n${colors.red(message)}\n`);
}

export function printError(cause: unknown): void {
  const detail = cause instanceof Error ? cause.message : String(cause);
  error(`Error: ${detail}`);
}

/** Encabezado de sección: `--- Título ---`. */
export function printSection(title: string): void {
  console.log(`\n${colors.cyan(`--- ${title} ---`)}`);
}

/** Cierra una sección con una línea separadora. */
export function printSectionEnd(): void {
  console.log(colors.cyan("--------------------------"));
}

/** Línea numerada al estilo de los listados del menú: `  1. texto`. */
export function printNumberedLine(index: number, text: string): void {
  console.log(`  ${colors.cyan(String(index))}. ${text}`);
}

/** Lista numerada completa. */
export function printNumberedList(items: string[]): void {
  items.forEach((item, index) => printNumberedLine(index + 1, item));
}

/** Etiqueta de una ciudad guardada, marcando la default en verde. */
export function savedCityLabel(city: City, defaultCity: string | null): string {
  const isDefault =
    defaultCity !== null && defaultCity.toLowerCase() === city.name.toLowerCase();
  const marker = isDefault ? colors.green(" (default)") : "";
  return `${cityLabel(city)}${marker}`;
}

/** Detalle del clima actual de una ciudad. */
export function printCurrentWeather(
  city: City,
  forecast: ForecastResponse,
  units: Units
): void {
  console.log(`\n${colors.cyan("--- Clima ---")}`);
  console.log(`Ciudad: ${colors.bold(cityLabel(city))}`);
  console.log(`Temperatura: ${formatTemperature(forecast.current.temperature_2m, units)}`);
  console.log(`Hora: ${forecast.current.time}`);
  console.log(`Zona horaria: ${forecast.timezone}`);
  console.log(`${colors.cyan("--------------")}\n`);
}

/** Tabla del pronóstico diario. */
export function printDailyForecast(
  city: City,
  days: DailyForecast[],
  units: Units
): void {
  console.log(
    `\n${colors.cyan(`--- Pronóstico ${days.length} días: ${cityLabel(city)} ---`)}`
  );

  for (const day of days) {
    const date = formatDate(day.date).padEnd(9, " ");
    const range = `${formatTemperature(day.tempMin, units)} / ${formatTemperature(day.tempMax, units)}`;
    const rain =
      day.precipitationProbability === null
        ? ""
        : colors.dim(`  lluvia ${day.precipitationProbability}%`);
    console.log(`  ${date} ${weatherCodeLabel(day.weatherCode)}  ${range}${rain}`);
  }

  console.log(`${colors.cyan("-----------------------------------")}\n`);
}
