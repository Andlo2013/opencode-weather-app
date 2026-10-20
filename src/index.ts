import { runApp } from "./app/loop";
import { loadState } from "./storage/state";
import { printError } from "./ui/messages";
import { createPrompt, PromptClosedError } from "./ui/prompt";

async function main(): Promise<void> {
  const prompt = createPrompt();
  try {
    const state = loadState();
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
