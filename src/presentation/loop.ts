import { colors } from "../utils/colors";
import { EXIT_KEY } from "../utils/constants";
import { printError, warn } from "./output";
import { printBanner, printMenu } from "./menu";
import { addCityFlow } from "../actions/addCity";
import { removeCityFlow } from "../actions/removeCity";
import { setDefaultCityFlow } from "../actions/setDefaultCity";
import { listCities } from "../actions/listCities";
import { toggleUnits } from "../actions/toggleUnits";
import { showAllCities, showDefaultCity } from "../actions/getWeather";
import { showWeeklyForecast } from "../actions/weeklyForecast";
import { PromptClosedError } from "./input";
import type { AppState } from "../types";
import type { Prompt } from "./input";

/**
 * Ejecuta una opción del menú. Para agregar una funcionalidad nueva:
 *  1. Crea su handler en `src/actions/`.
 *  2. Regístralo en `COMMANDS` con la tecla del menú.
 *  3. Añade su fila en `MENU_OPTIONS` (`presentation/menu.ts`).
 */
type Command = (state: AppState, prompt: Prompt) => Promise<void>;

const COMMANDS: Record<string, Command> = {
  "1": (state) => showDefaultCity(state),
  "2": (state) => showAllCities(state),
  "3": (state, prompt) => addCityFlow(state, prompt),
  "4": (state, prompt) => removeCityFlow(state, prompt),
  "5": (state, prompt) => setDefaultCityFlow(state, prompt),
  "6": (state) => {
    listCities(state);
    return Promise.resolve();
  },
  "7": (state, prompt) => showWeeklyForecast(state, prompt),
  "8": (state) => {
    toggleUnits(state);
    return Promise.resolve();
  },
};

export async function runApp(state: AppState, prompt: Prompt): Promise<void> {
  try {
    while (true) {
      console.clear();
      printBanner();
      printMenu(state);

      const option = await prompt.ask("  Selecciona una opción: ");

      if (option === EXIT_KEY) {
        console.log(colors.cyan("\n¡Hasta luego!\n"));
        return;
      }

      const command = COMMANDS[option];
      if (!command) {
        warn(`Opción inválida: "${option}". Inténtalo de nuevo.`);
        await prompt.pause();
        continue;
      }

      try {
        await command(state, prompt);
      } catch (cause) {
        if (cause instanceof PromptClosedError) {
          throw cause;
        }
        printError(cause);
      }

      // Toda opción (incluidas las canceladas) vuelve al menú principal.
      await prompt.pause();
    }
  } catch (cause) {
    if (cause instanceof PromptClosedError) {
      return;
    }
    throw cause;
  }
}
