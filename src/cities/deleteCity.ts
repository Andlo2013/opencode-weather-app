import { info, printError, success } from "../ui/messages";
import { removeCityAt } from "./store";
import { selectSavedCity } from "./select";
import { saveState } from "../storage/state";
import type { AppState } from "../types";
import type { Prompt } from "../ui/prompt";

export async function deleteCityFlow(state: AppState, prompt: Prompt): Promise<void> {
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
    saveState(state);
  } catch (cause) {
    printError(cause);
    return;
  }
  success(`Ciudad "${removed.name}" eliminada correctamente.`);
}
