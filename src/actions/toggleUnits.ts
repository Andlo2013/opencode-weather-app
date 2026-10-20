import { printError, success } from "../presentation/output";
import { saveUnits } from "../storage/settingsStorage";
import type { AppState } from "../types";

/** Opción 8: alterna entre °C y °F y lo persiste. */
export function toggleUnits(state: AppState): void {
  state.units = state.units === "C" ? "F" : "C";
  try {
    saveUnits(state.units);
  } catch (cause) {
    printError(cause);
    return;
  }
  success(`Unidades cambiadas a °${state.units}`);
}
