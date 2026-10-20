import { colors } from "../utils/colors";
import { withLoading } from "../presentation/spinner";
import {
  error,
  info,
  printCurrentWeather,
  printError,
  printNumberedLine,
  printSection,
  printSectionEnd,
} from "../presentation/output";
import { cityLabel, formatTemperature } from "../utils/format";
import { getCurrentWeather } from "../api/weather";
import { resolveCoordinates } from "../api/geocoding";
import { findCityByName } from "../storage/citiesStorage";
import type { AppState, City, Units } from "../types";

/** Línea resumida por ciudad, tolerante a errores, para el listado completo. */
async function fetchWeatherLine(city: City, units: Units): Promise<string> {
  const prefix = cityLabel(city);
  try {
    const coordinates = await resolveCoordinates(city);
    if (!coordinates) {
      return `${prefix}: ${colors.red("No encontrada")}`;
    }
    const forecast = await getCurrentWeather(coordinates.latitude, coordinates.longitude);
    return `${prefix}: ${formatTemperature(forecast.current.temperature_2m, units)}`;
  } catch {
    return `${prefix}: ${colors.red("Error al obtener clima")}`;
  }
}

/** Opción 1: clima actual de la ciudad por defecto. */
export async function showDefaultCity(state: AppState): Promise<void> {
  if (!state.defaultCity) {
    info(
      "No hay una ciudad por defecto configurada. Usa la opción 3 para agregar una o la opción 5 para establecerla."
    );
    return;
  }

  const city = findCityByName(state, state.defaultCity) ?? { name: state.defaultCity };

  try {
    const coordinates = await withLoading(`Buscando ${city.name}...`, () =>
      resolveCoordinates(city)
    );
    if (!coordinates) {
      error(`No se encontró la ciudad por defecto: ${state.defaultCity}`);
      return;
    }

    const forecast = await withLoading(`Obteniendo clima de ${city.name}...`, () =>
      getCurrentWeather(coordinates.latitude, coordinates.longitude)
    );
    printCurrentWeather(city, forecast, state.units);
  } catch (cause) {
    printError(cause);
  }
}

/** Opción 2: clima actual de todas las ciudades guardadas, en secuencia. */
export async function showAllCities(state: AppState): Promise<void> {
  if (state.cities.length === 0) {
    info("No hay ciudades guardadas. Usa la opción 3 para buscar y agregar una.");
    return;
  }

  printSection("Clima de todas las ciudades");
  for (let i = 0; i < state.cities.length; i += 1) {
    const city = state.cities[i];
    if (!city) continue;
    const line = await withLoading(`Consultando ${city.name}...`, () =>
      fetchWeatherLine(city, state.units)
    );
    printNumberedLine(i + 1, line);
  }
  printSectionEnd();
}
