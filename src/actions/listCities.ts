import {
  info,
  printNumberedList,
  printSection,
  printSectionEnd,
  savedCityLabel,
} from "../presentation/output";
import type { AppState } from "../types";

/** Opción 6: lista las ciudades guardadas, marcando la por defecto. */
export function listCities(state: AppState): void {
  if (state.cities.length === 0) {
    info("No hay ciudades guardadas. Usa la opción 3 para buscar y agregar una.");
    return;
  }

  printSection("Ciudades guardadas");
  printNumberedList(
    state.cities.map((city) => savedCityLabel(city, state.defaultCity))
  );
  printSectionEnd();
}
