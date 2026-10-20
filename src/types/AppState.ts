import type { City } from "./City";
import type { Units } from "./Weather";

/** Estado en memoria de la app; se persiste en `~/.config/weather-cli/config.json`. */
export interface AppState {
  defaultCity: string | null;
  cities: City[];
  units: Units;
}
