import { colors } from "../utils/colors";
import type { AppState, MenuOption } from "../types";

/**
 * Opciones del menú. Para agregar una funcionalidad nueva:
 *  1. Crea su handler en `src/actions/`.
 *  2. Regístralo en `COMMANDS` (`presentation/loop.ts`) con su `key`.
 *  3. Añade su fila aquí.
 */
export const MENU_OPTIONS: MenuOption[] = [
  { key: "1", label: "Clima de ciudad default" },
  {
    key: "2",
    label: "Clima de todas las ciudades",
    detail: (state) => String(state.cities.length),
  },
  { key: "3", label: "Buscar y agregar ciudad" },
  { key: "4", label: "Eliminar ciudad" },
  { key: "5", label: "Establecer ciudad default" },
  { key: "6", label: "Listar ciudades guardadas" },
  { key: "7", label: "Pronóstico 7 días" },
  {
    key: "8",
    label: "Ajustes Unidad",
    detail: (state) => (state.units === "C" ? "°C" : "°F"),
  },
  { key: "9", label: "Salir" },
];

export function printBanner(): void {
  console.log(colors.cyan("═══════════════════════════════════════"));
  console.log(colors.cyan("         WEATHER CLI"));
  console.log(colors.cyan("═══════════════════════════════════════"));
}

export function printMenu(state: AppState): void {
  for (const { key, label, detail } of MENU_OPTIONS) {
    const suffix = detail ? ` (${detail(state)})` : "";
    console.log(`  ${colors.cyan(key)}. ${label}${suffix}`);
  }
  console.log(colors.cyan("═══════════════════════════════════════"));
}
