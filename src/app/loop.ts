import { colors } from "../ui/colors";
import { printError, warn } from "../ui/messages";
import { printBanner, printMenu } from "./menu";
import { addCityFlow } from "../cities/addCity";
import { deleteCityFlow } from "../cities/deleteCity";
import { setDefaultCityFlow } from "../cities/setDefaultCity";
import { toggleUnits } from "../settings/units";
import { showAllCities, showDefaultCity } from "../weather/currentWeather";
import { showWeeklyForecast } from "../weather/weeklyForecast";
import { PromptClosedError } from "../ui/prompt";
import type { AppState } from "../types";
import type { Prompt } from "../ui/prompt";

/**
 * Ejecuta una opción del menú. Para agregar una funcionalidad nueva:
 *  1. Crea su handler (idealmente en la feature correspondiente).
 *  2. Regístralo en `COMMANDS` con la tecla del menú.
 *  3. Añade su fila en `printMenu`.
 */
type Command = (state: AppState, prompt: Prompt) => Promise<void>;

const COMMANDS: Record<string, Command> = {
  "1": (state) => showDefaultCity(state),
  "2": (state) => showAllCities(state),
  "3": (state, prompt) => addCityFlow(state, prompt),
  "4": (state, prompt) => deleteCityFlow(state, prompt),
  "5": (state, prompt) => setDefaultCityFlow(state, prompt),
  "6": (state, prompt) => showWeeklyForecast(state, prompt),
  "8": (state) => {
    toggleUnits(state);
    return Promise.resolve();
  },
};

const EXIT_KEY = "9";

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
