import { withLoading } from "../presentation/spinner";
import { info, printDailyForecast, printError } from "../presentation/output";
import { getDailyForecast } from "../api/weather";
import { resolveCoordinates } from "../api/geocoding";
import { selectSavedCity } from "../presentation/input";
import { FORECAST_DAYS } from "../utils/constants";
import type { AppState, City } from "../types";
import type { Prompt } from "../presentation/input";

async function pickCity(state: AppState, prompt: Prompt): Promise<City | null> {
  if (state.cities.length > 0) {
    return selectSavedCity(
      prompt,
      state,
      "Selecciona el número de la ciudad para el pronóstico (0 para cancelar): "
    );
  }
  if (state.defaultCity) {
    return { name: state.defaultCity };
  }
  return null;
}

/** Opción 7: pronóstico de los próximos 7 días. */
export async function showWeeklyForecast(state: AppState, prompt: Prompt): Promise<void> {
  if (state.cities.length === 0 && !state.defaultCity) {
    info("No hay ciudades guardadas. Usa la opción 3 para buscar y agregar una.");
    return;
  }

  const city = await pickCity(state, prompt);
  if (!city) {
    info("Operación cancelada. Volviendo al menú principal.");
    return;
  }

  try {
    const coordinates = await withLoading(`Buscando ${city.name}...`, () =>
      resolveCoordinates(city)
    );
    if (!coordinates) {
      info(`No se encontró la ciudad: ${city.name}`);
      return;
    }

    const days = await withLoading(`Obteniendo pronóstico de ${city.name}...`, () =>
      getDailyForecast(coordinates.latitude, coordinates.longitude, FORECAST_DAYS)
    );
    if (days.length === 0) {
      info("No hay datos de pronóstico disponibles.");
      return;
    }

    printDailyForecast(city, days, state.units);
  } catch (cause) {
    printError(cause);
  }
}
