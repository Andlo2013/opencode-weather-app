import { readConfig, writeConfig } from "./configFile";
import type { AppState, City } from "../types";

/** Ciudades guardadas y ciudad por defecto, tal como están en disco. */
export function loadCitiesState(): Pick<AppState, "cities" | "defaultCity"> {
  const { cities, defaultCity } = readConfig();
  return { cities, defaultCity };
}

/**
 * Persiste ciudades y default sobre el config, conservando el resto
 * (unidades) tal como está en disco.
 */
export function saveCitiesState(state: Pick<AppState, "cities" | "defaultCity">): void {
  const config = readConfig();
  writeConfig({ ...config, cities: state.cities, defaultCity: state.defaultCity });
}

export function cityKey(city: City): string {
  return `${city.name}|${city.admin1 ?? ""}|${city.country ?? ""}`.toLowerCase();
}

function sameName(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Evita duplicados por nombre o por ubicación (mismo nombre + región + país). */
export function isDuplicate(state: AppState, city: City): boolean {
  const key = cityKey(city);
  return state.cities.some(
    (existing) => cityKey(existing) === key || sameName(existing.name, city.name)
  );
}

/** Agrega una ciudad en memoria. Devuelve `false` si está vacía o ya existe. */
export function addCity(state: AppState, city: City): boolean {
  if (!city.name.trim() || isDuplicate(state, city)) {
    return false;
  }
  state.cities.push(city);
  return true;
}

/** Elimina por índice en memoria y limpia la ciudad por defecto si coincidía. */
export function removeCityAt(state: AppState, index: number): City | null {
  if (index < 0 || index >= state.cities.length) {
    return null;
  }

  const [removed] = state.cities.splice(index, 1);
  if (!removed) {
    return null;
  }

  if (state.defaultCity && sameName(state.defaultCity, removed.name)) {
    state.defaultCity = null;
  }
  return removed;
}

export function findCityByName(state: AppState, name: string): City | null {
  return state.cities.find((city) => sameName(city.name, name)) ?? null;
}
