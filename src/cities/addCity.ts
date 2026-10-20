import { colors } from "../ui/colors";
import { withLoading } from "../ui/spinner";
import { info, printError, success } from "../ui/messages";
import { cityLabel } from "../ui/format";
import { searchCities } from "../api/geocoding";
import { addCity, fromGeocoding } from "./store";
import { saveState } from "../storage/state";
import type { AppState, GeocodingResult } from "../types";
import type { Prompt } from "../ui/prompt";

async function chooseCity(
  prompt: Prompt,
  results: GeocodingResult[]
): Promise<GeocodingResult | null> {
  console.log(`\n${colors.bold("Resultados encontrados:")}`);
  results.forEach((result, index) => {
    console.log(`  ${colors.cyan(String(index + 1))}. ${cityLabel(result)}`);
  });

  const answer = await prompt.ask(
    "\nSelecciona el número de la ciudad (0 para cancelar): "
  );
  const index = Number.parseInt(answer, 10);
  if (!Number.isInteger(index) || index <= 0 || index > results.length) {
    return null;
  }
  return results[index - 1] ?? null;
}

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

  const selected = await chooseCity(prompt, results);
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
    saveState(state);
  } catch (cause) {
    printError(cause);
    return;
  }
  success(`Ciudad "${city.name}" agregada correctamente.`);
}
