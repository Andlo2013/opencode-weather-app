export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface City {
  name: string;
  country?: string;
  admin1?: string;
  /** Opcional: las ciudades migradas desde el formato antiguo solo tienen `name`. */
  latitude?: number;
  longitude?: number;
}

/** Type guard: `true` si la ciudad ya tiene coordenadas resueltas. */
export function hasCoordinates(city: City): city is City & Coordinates {
  return typeof city.latitude === "number" && typeof city.longitude === "number";
}
