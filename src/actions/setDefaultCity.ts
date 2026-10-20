import { info, printError, success } from "../presentation/output";
import { selectSavedCity } from "../presentation/input";
import { saveCitiesState } from "../storage/citiesStorage";
import type { AppState } from "../types";
import type { Prompt } from "../presentation/input";

/** Opción 5: marcar una ciudad guardada como la por defecto. */
export async function setDefaultCityFlow(
  state: AppState,
  prompt: Prompt
): Promise<void> {
  if (state.cities.length === 0) {
    info("No hay ciudades guardadas. Usa la opción 3 para buscar y agregar una.");
    return;
  }

  const city = await selectSavedCity(
    prompt,
    state,
    "Selecciona el número de la ciudad por defecto (0 para cancelar): "
  );
  if (!city) {
    info("Operación cancelada. Volviendo al menú principal.");
    return;
  }

  state.defaultCity = city.name;
  try {
    saveCitiesState(state);
  } catch (cause) {
    printError(cause);
    return;
  }
  success(`Ciudad por defecto establecida: ${city.name}`);
}
