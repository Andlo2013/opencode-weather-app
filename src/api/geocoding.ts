import { fetchJson } from "./client";
import { GEOCODING_BASE } from "../utils/constants";
import { hasCoordinates } from "../types";
import type { City, Coordinates, GeocodingResponse, GeocodingResult } from "../types";

/**
 * Busca ciudades por nombre y devuelve varias coincidencias para poder
 * desambiguar (país/región) en vez de asumir la primera.
 */
export async function searchCities(name: string, count = 8): Promise<GeocodingResult[]> {
  const url = new URL(GEOCODING_BASE);
  url.searchParams.set("name", name);
  url.searchParams.set("count", String(count));
  url.searchParams.set("language", "es");
  url.searchParams.set("format", "json");

  const data = await fetchJson<GeocodingResponse>(url);
  return data.results ?? [];
}

/**
 * Devuelve coordenadas para una ciudad. Si ya las tiene, no vuelve a geocodificar.
 * Las ciudades migradas del formato antiguo (solo nombre) se resuelven aquí.
 * No imprime nada: el llamador decide si muestra un spinner.
 */
export async function resolveCoordinates(city: City): Promise<Coordinates | null> {
  if (hasCoordinates(city)) {
    return { latitude: city.latitude, longitude: city.longitude };
  }

  const [first] = await searchCities(city.name, 1);
  if (!first) {
    return null;
  }
  return { latitude: first.latitude, longitude: first.longitude };
}

/** Adapta un resultado del geocoding al modelo `City` persistido. */
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
