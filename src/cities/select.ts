import { colors } from "../ui/colors";
import { cityLabel } from "../ui/format";
import type { AppState, City } from "../types";
import type { Prompt } from "../ui/prompt";

/**
 * Muestra las ciudades guardadas numeradas y devuelve la elegida.
 * Devuelve `null` cuando el usuario cancela (0, entrada inválida o lista vacía).
 */
export async function selectSavedCity(
  prompt: Prompt,
  state: AppState,
  question: string
): Promise<City | null> {
  if (state.cities.length === 0) {
    return null;
  }

  console.log(`\n${colors.cyan("--- Ciudades guardadas ---")}`);
  state.cities.forEach((city, index) => {
    const isDefault = state.defaultCity !== null && state.defaultCity.toLowerCase() === city.name.toLowerCase();
    const marker = isDefault ? colors.green(" (default)") : "";
    console.log(`  ${colors.cyan(String(index + 1))}. ${cityLabel(city)}${marker}`);
  });
  console.log(colors.cyan("--------------------------"));

  const answer = await prompt.ask(question);
  const index = Number.parseInt(answer, 10);
  if (!Number.isInteger(index) || index <= 0 || index > state.cities.length) {
    return null;
  }
  return state.cities[index - 1] ?? null;
}
