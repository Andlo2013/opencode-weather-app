import { homedir } from "os";
import { join } from "path";

const APP_DIR = "weather-cli";
const STATE_FILE = "config.json";

/**
 * Directorio de configuración del binario.
 *
 * Orden de resolución:
 *  1. `WEATHER_CLI_CONFIG_DIR` (override explícito).
 *  2. `XDG_CONFIG_HOME/weather-cli` si está definido.
 *  3. `~/.config/weather-cli`.
 */
export function configDir(): string {
  const override = process.env.WEATHER_CLI_CONFIG_DIR?.trim();
  if (override) {
    return override;
  }

  const xdg = process.env.XDG_CONFIG_HOME?.trim();
  if (xdg) {
    return join(xdg, APP_DIR);
  }

  return join(homedir(), ".config", APP_DIR);
}

/** Ruta completa del archivo de estado: `~/.config/weather-cli/config.json`. */
export function statePath(): string {
  return join(configDir(), STATE_FILE);
}
