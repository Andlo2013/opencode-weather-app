# AGENTS.md - Weather CLI

## Overview
- Bun + TypeScript CLI app (ESM, `"type": "module"`).
- Purpose: interactive console app to look up weather by city using OpenMeteo APIs. Supports storing a default city, managing a list of cities, toggling °C/°F, and a 7-day forecast.
- Primary entry: `src/index.ts` (bootstraps the shared `Prompt`, loads state, runs the menu loop).

## Key APIs
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=...&count=8&language=es&format=json`
- Weather: `https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...&current=temperature_2m&timezone=auto`
- Daily forecast: `...&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto`

## Commands
- Install deps: `bun install`
- Run CLI: `bun run start` (or `bun run src/index.ts`)
- Watch mode: `bun run dev`
- Typecheck: `bun run typecheck` (or `bun --bun tsc --noEmit`)
- Build binary: `bun run build` → `weather` (`weather.exe` on Windows)
- Add deps: `bun add <pkg>`; dev deps: `bun add -d <pkg>`

## Architecture
Layered layout under `src/` (see `references/file-system.md` for the target shape); each file has a single responsibility.

```
src/
  index.ts                     # entry: creates the Prompt, loads state, runs the app
  actions/                     # user-facing cases of use (orchestration)
    getWeather.ts              # showDefaultCity() + showAllCities()
    weeklyForecast.ts          # 7-day forecast
    addCity.ts                 # search by name, pick result, save
    removeCity.ts              # pick + confirm + delete
    setDefaultCity.ts          # pick + set default
    listCities.ts              # list saved cities (default marked)
    toggleUnits.ts             # toggle °C/°F
  presentation/                # everything console/CLI related
    menu.ts                    # MENU_OPTIONS (MenuOption[]) + banner/menu rendering
    loop.ts                    # COMMANDS registry + main loop
    output.ts                  # success/info/warn/error/printError + section/list/table rendering
    input.ts                   # the ONLY readline interface (Prompt), selectFromList, selectSavedCity
    spinner.ts                 # withLoading() for async tasks
  storage/                     # one shared config.json, split by concern
    paths.ts                   # config dir resolution
    configFile.ts              # readConfig()/writeConfig() + validation + legacy migration
    citiesStorage.ts           # load/save cities+default + pure ops (add/remove/find/duplicate)
    settingsStorage.ts         # load/save units
  types/                       # shared contracts (barrel: import from "../types")
    City.ts                    # City, Coordinates, hasCoordinates()
    Weather.ts                 # Units, Geocoding*, Forecast*, DailyForecast
    AppState.ts                # AppState
    MenuOption.ts              # MenuOption { key, label, detail? }
  api/
    client.ts                  # fetchJson<T>() + ApiError
    geocoding.ts               # searchCities(), resolveCoordinates(), fromGeocoding()
    weather.ts                 # getCurrentWeather(), getDailyForecast()
  utils/
    format.ts                  # temperature / date / weather-code formatting
    constants.ts               # API bases, FORECAST_DAYS, EXIT_KEY, AFFIRMATIVE, WMO codes...
    colors.ts                  # ANSI helpers (NO_COLOR / TTY aware)
```

## Releases
- `.github/workflows/release.yml` runs on push to `main` (and `workflow_dispatch`).
- Version source of truth: `version` in `package.json`; the tag is `v<version>`.
- If the tag already exists the job exits without building or publishing (idempotent).
- Publishes a single asset, `weather-windows-x64.exe`, from `bun run build` (which runs tests via `prebuild`), created with the preinstalled `gh` CLI — no third-party release actions.

## Persistence
- State file: `~/.config/weather-cli/config.json` on all platforms (single JSON shared by `citiesStorage` and `settingsStorage`; each save is read-modify-write so one side never clobbers the other).
- Overrides: `WEATHER_CLI_CONFIG_DIR` (full dir) then `XDG_CONFIG_HOME` (if set); otherwise `~/.config/weather-cli`.
- Legacy `.weather.json` in the current directory is migrated automatically on first load (`configFile.ts`).
- `cities` stores objects `{ name, country?, admin1?, latitude?, longitude? }`. Cities from the legacy format only have `name` and are geocoded on demand.

## Frontend / UX
- One shared `Prompt` (from `src/presentation/input.ts`) is passed into every action. **Never create another `readline` interface** — a second interface over `process.stdin` breaks the menu loop.
- Every menu action returns to the main menu (cancel included); only option `9` exits.
- Menu keys are contiguous 1–9 (`6` list cities, `7` forecast, `8` settings); rows live in `MENU_OPTIONS`, dispatch in `COMMANDS`.
- Colors: cyan (menu/labels), yellow (temperatures), green (success), red (errors). Disabled when `NO_COLOR` is set or output is not a TTY.

## Adding a new feature
1. Implement the handler in `src/actions/`, taking `(state, prompt?)` as needed; render via `presentation/output.ts` and read input via `presentation/input.ts`.
2. Register it in `COMMANDS` inside `src/presentation/loop.ts` under its menu key.
3. Add its row in `MENU_OPTIONS` (`src/presentation/menu.ts`).
4. Typecheck and smoke test.

## Development Guidelines
- Keep changes minimal and consistent with existing TS style (no `node_modules` edits).
- Prefer ESM (`import/export`). Bun handles TypeScript/ESM natively.
- No new runtime dependencies without a reason; colors and the spinner are hand-rolled.
- README is the source of truth for UX/API flow; align implementations with it.

## Quick Verification
1. `bun run typecheck`
2. `bun run start` (manual smoke test: options 1–8, 9; try cancelling delete with `0`)
3. `bun run build` and run the binary from another directory to confirm it uses `~/.config/weather-cli/`.
