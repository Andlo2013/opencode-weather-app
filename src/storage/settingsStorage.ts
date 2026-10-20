import { readConfig, writeConfig } from "./configFile";
import type { Units } from "../types";

/** Unidades activas (°C/°F), tal como están en disco. */
export function loadUnits(): Units {
  return readConfig().units;
}

/** Persiste las unidades sobre el config, conservando ciudades y default. */
export function saveUnits(units: Units): void {
  writeConfig({ ...readConfig(), units });
}
