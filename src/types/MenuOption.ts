import type { AppState } from "./AppState";

/**
 * Fila del menú principal. `key` es la tecla que dispara la acción y
 * `detail` calcula el texto dinámico que se muestra entre paréntesis.
 */
export interface MenuOption {
  key: string;
  label: string;
  detail?: (state: AppState) => string;
}
