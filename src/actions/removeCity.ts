import { info, printError, success } from "../presentation/output";
import { selectSavedCity } from "../presentation/input";
import { removeCityAt, saveCitiesState } from "../storage/citiesStorage";
import type { AppState } from "../types";
import type { Prompt } from "../presentation/input";

/** Opción 4: elegir una ciudad guardada, confirmar y eliminarla. */
export async function removeCityFlow(state: AppState, prompt: Prompt): Promise<void> {
  if (state.cities.length === 0) {
    info("No hay ciudades guardadas para eliminar.");
    return;
  }

  const city = await selectSavedCity(
    prompt,
    state,
    "Selecciona el número de la ciudad a eliminar (0 para cancelar): "
  );
  if (!city) {
    info("Operación cancelada. Volviendo al menú principal.");
    return;
  }

  const confirmed = await prompt.confirm(`¿Eliminar "${city.name}"? (s/n): `);
  if (!confirmed) {
    info("Operación cancelada. Volviendo al menú principal.");
    return;
  }

  const removed = removeCityAt(state, state.cities.indexOf(city));
  if (!removed) {
    info("Operación cancelada. Volviendo al menú principal.");
    return;
  }

  try {
    saveCitiesState(state);
  } catch (cause) {
    printError(cause);
    return;
  }
  success(`Ciudad "${removed.name}" eliminada correctamente.`);
}
