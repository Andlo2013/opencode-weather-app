import { withLoading } from "../presentation/spinner";
import { info, printError, success } from "../presentation/output";
import { selectFromList } from "../presentation/input";
import { cityLabel } from "../utils/format";
import { fromGeocoding, searchCities } from "../api/geocoding";
import { addCity, saveCitiesState } from "../storage/citiesStorage";
import type { AppState, GeocodingResult } from "../types";
import type { Prompt } from "../presentation/input";

/** Opción 3: buscar una ciudad por nombre, elegir resultado y guardarla. */
export async function addCityFlow(state: AppState, prompt: Prompt): Promise<void> {
  const name = await prompt.ask("Ingresa el nombre de la ciudad: ");
  if (!name) {
    info("Nombre de ciudad vacío. Operación cancelada.");
    return;
  }

  let results: GeocodingResult[];
  try {
    results = await withLoading(`Buscando "${name}"...`, () => searchCities(name));
  } catch (cause) {
    printError(cause);
    return;
  }

  if (results.length === 0) {
    info("No se encontraron resultados para esa ciudad.");
    return;
  }

  const selected = await selectFromList(prompt, results, {
    title: "Resultados encontrados",
    question: "\nSelecciona el número de la ciudad (0 para cancelar): ",
    toLabel: cityLabel,
  });
  if (!selected) {
    info("Operación cancelada.");
    return;
  }

  const city = fromGeocoding(selected);
  if (!addCity(state, city)) {
    info(`"${city.name}" ya está en tu lista de ciudades.`);
    return;
  }

  try {
    saveCitiesState(state);
  } catch (cause) {
    printError(cause);
    return;
  }
  success(`Ciudad "${city.name}" agregada correctamente.`);
}
