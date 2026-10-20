import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { statePath } from "./paths";
import type { AppState, City, Units } from "../types";

const DEFAULT_STATE: AppState = {
  defaultCity: null,
  cities: [],
  units: "C",
};

/** Archivo de estado de versiones anteriores, guardado junto al ejecutable. */
const LEGACY_FILE = ".weather.json";

function isUnits(value: unknown): value is Units {
  return value === "C" || value === "F";
}

function emptyState(): AppState {
  return { defaultCity: null, cities: [], units: "C" };
}

/**
 * Convierte una entrada de `cities` al modelo actual. Acepta el formato antiguo
 * (`string` con solo el nombre) para poder migrar estados ya guardados.
 */
function parseCity(value: unknown): City | null {
  if (typeof value === "string") {
    const name = value.trim();
    return name ? { name } : null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const obj = value as Record<string, unknown>;
  if (typeof obj.name !== "string" || !obj.name.trim()) {
    return null;
  }

  const city: City = { name: obj.name.trim() };
  if (typeof obj.country === "string") city.country = obj.country;
  if (typeof obj.admin1 === "string") city.admin1 = obj.admin1;
  if (typeof obj.latitude === "number") city.latitude = obj.latitude;
  if (typeof obj.longitude === "number") city.longitude = obj.longitude;
  return city;
}

function parseState(data: unknown): AppState | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const obj = data as Record<string, unknown>;
  if (!isUnits(obj.units) || !Array.isArray(obj.cities)) {
    return null;
  }

  const cities: City[] = [];
  for (const raw of obj.cities) {
    const city = parseCity(raw);
    if (city) cities.push(city);
  }

  return {
    defaultCity: typeof obj.defaultCity === "string" ? obj.defaultCity : null,
    cities,
    units: obj.units,
  };
}

function readStateFile(path: string): AppState | null {
  try {
    const content = readFileSync(path, "utf-8");
    if (!content.trim()) {
      return null;
    }
    return parseState(JSON.parse(content) as unknown);
  } catch {
    return null;
  }
}

/** Migra `.weather.json` del directorio actual al nuevo config dir, si existe. */
function migrateLegacyState(): AppState | null {
  const legacyPath = join(process.cwd(), LEGACY_FILE);
  if (!existsSync(legacyPath)) {
    return null;
  }

  const migrated = readStateFile(legacyPath);
  if (!migrated) {
    return null;
  }

  try {
    saveState(migrated);
  } catch {
    // Si no se puede escribir, al menos devolvemos el estado en memoria.
  }
  return migrated;
}

export function loadState(): AppState {
  const path = statePath();
  if (!existsSync(path)) {
    return migrateLegacyState() ?? emptyState();
  }

  const parsed = readStateFile(path);
  if (parsed) {
    return parsed;
  }

  console.warn(
    `Estado inválido en ${path}, usando valores por defecto (${DEFAULT_STATE.units}°).`
  );
  return emptyState();
}

export function saveState(state: AppState): void {
  const path = statePath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(state, null, 2)}\n`, "utf-8");
}
