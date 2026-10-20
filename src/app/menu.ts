import { colors } from "../ui/colors";
import type { AppState } from "../types";

export function printBanner(): void {
  console.log(colors.cyan("═══════════════════════════════════════"));
  console.log(colors.cyan("         WEATHER CLI"));
  console.log(colors.cyan("═══════════════════════════════════════"));
}

export function printMenu(state: AppState): void {
  const unitsLabel = state.units === "C" ? "°C" : "°F";
  const option = (key: string, label: string) =>
    console.log(`  ${colors.cyan(key)}. ${label}`);

  option("1", "Clima de ciudad default");
  option("2", `Clima de todas las ciudades (${state.cities.length})`);
  option("3", "Buscar y agregar ciudad");
  option("4", "Eliminar ciudad");
  option("5", "Establecer ciudad default");
  option("6", "Pronóstico 7 días");
  option("8", `Ajustes (${unitsLabel})`);
  option("9", "Salir");
  console.log(colors.cyan("═══════════════════════════════════════"));
}
