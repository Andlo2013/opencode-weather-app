import type { AppState, City, Coordinates, GeocodingResult } from "../types";

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

/** Agrega una ciudad. Devuelve `false` si está vacía o ya existe. */
export function addCity(state: AppState, city: City): boolean {
  if (!city.name.trim() || isDuplicate(state, city)) {
    return false;
  }
  state.cities.push(city);
  return true;
}

/** Elimina por índice y limpia la ciudad por defecto si coincidía. */
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

export function hasCoordinates(
  city: City
): city is City & Coordinates {
  return typeof city.latitude === "number" && typeof city.longitude === "number";
}

export function fromGeocoding(result: GeocodingResult): City {
  const city: City = {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
  };
  if (result.country) city.country = result.country;
  if (result.admin1) city.admin1 = result.admin1;
  return city;
}
