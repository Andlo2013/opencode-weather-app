import { printError, success } from "../ui/messages";
import { saveState } from "../storage/state";
import type { AppState } from "../types";

export function toggleUnits(state: AppState): void {
  state.units = state.units === "C" ? "F" : "C";
  try {
    saveState(state);
  } catch (cause) {
    printError(cause);
    return;
  }
  success(`Unidades cambiadas a °${state.units}`);
}
