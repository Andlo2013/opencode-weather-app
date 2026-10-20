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
Feature-based layout under `src/`; each file has a single responsibility.

```
src/
  index.ts                     # entry: creates the Prompt, loads state, runs the app
  types.ts                     # shared types (Units, City, AppState, API responses)
  app/
    menu.ts                    # banner + menu rendering (cyan)
    loop.ts                    # command registry + main loop
  ui/
    colors.ts                  # ANSI helpers (NO_COLOR / TTY aware)
    prompt.ts                  # the ONLY readline interface (ask/confirm/pause)
    spinner.ts                 # withLoading() for async tasks
    format.ts                  # temperature / date / weather-code formatting
    messages.ts                # success / info / warn / error helpers
  api/
    client.ts                  # fetchJson<T>() + ApiError
    geocoding.ts               # searchCities(name, count) -> results[]
    forecast.ts                # getCurrentWeather(), getDailyForecast()
  storage/
    paths.ts                   # config dir resolution
    state.ts                   # load/save + validation + legacy migration
  cities/
    store.ts                   # pure ops: add/remove/duplicate/coords helpers
    resolve.ts                 # coordinates for a city (geocode if missing)
    select.ts                  # numbered city picker
    addCity.ts deleteCity.ts setDefaultCity.ts
  weather/
    currentWeather.ts          # default city + all cities
    weeklyForecast.ts          # 7-day forecast
  settings/
    units.ts                   # toggle °C/°F
```

## Persistence
- State file: `~/.config/weather-cli/config.json` on all platforms.
- Overrides: `WEATHER_CLI_CONFIG_DIR` (full dir) then `XDG_CONFIG_HOME` (if set); otherwise `~/.config/weather-cli`.
- Legacy `.weather.json` in the current directory is migrated automatically on first load.
- `cities` stores objects `{ name, country?, admin1?, latitude?, longitude? }`. Cities from the legacy format only have `name` and are geocoded on demand.

## Frontend / UX
- One shared `Prompt` (from `src/ui/prompt.ts`) is passed into every action. **Never create another `readline` interface** — a second interface over `process.stdin` breaks the menu loop.
- Every menu action returns to the main menu (cancel included); only option `9` exits.
- Colors: cyan (menu/labels), yellow (temperatures), green (success), red (errors). Disabled when `NO_COLOR` is set or output is not a TTY.

## Adding a new feature
1. Implement the handler (prefer a file in the relevant feature folder, e.g. `src/weather/`), taking `(state, prompt?)` as needed.
2. Register it in `COMMANDS` inside `src/app/loop.ts` under its menu key.
3. Add its row in `printMenu` (`src/app/menu.ts`).
4. Typecheck and smoke test.

## Development Guidelines
- Keep changes minimal and consistent with existing TS style (no `node_modules` edits).
- Prefer ESM (`import/export`). Bun handles TypeScript/ESM natively.
- No new runtime dependencies without a reason; colors and the spinner are hand-rolled.
- README is the source of truth for UX/API flow; align implementations with it.

## Quick Verification
1. `bun run typecheck`
2. `bun run start` (manual smoke test: options 1–6, 8, 9; try cancelling delete with `0`)
3. `bun run build` and run the binary from another directory to confirm it uses `~/.config/weather-cli/`.
