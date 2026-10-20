import { searchCities } from "../api/geocoding";
import { hasCoordinates } from "./store";
import type { City, Coordinates } from "../types";

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
