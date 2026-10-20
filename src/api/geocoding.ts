import { fetchJson } from "./client";
import type { GeocodingResponse, GeocodingResult } from "../types";

const GEOCODING_BASE = "https://geocoding-api.open-meteo.com/v1/search";

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
