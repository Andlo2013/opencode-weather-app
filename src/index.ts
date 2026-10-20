import { runApp } from "./presentation/loop";
import { loadCitiesState } from "./storage/citiesStorage";
import { loadUnits } from "./storage/settingsStorage";
import { printError } from "./presentation/output";
import { createPrompt, PromptClosedError } from "./presentation/input";
import type { AppState } from "./types";

async function main(): Promise<void> {
  const prompt = createPrompt();
  try {
    const state: AppState = { ...loadCitiesState(), units: loadUnits() };
    await runApp(state, prompt);
  } catch (cause) {
    if (!(cause instanceof PromptClosedError)) {
      printError(cause);
    }
  } finally {
    prompt.close();
  }
}

await main();
