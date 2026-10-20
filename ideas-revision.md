# Revisión Weather CLI

> Estado: implementado. Ver detalle al final de cada ítem.

- [x] **Codigo:**
  - [x] Debe estar dentro de una carpeta src
  - [x] Separarlo en subcarpetas por funcionalidades (cities, APIs, Settings, etc)
  - [x] Cada archivo debe tener responsabilidad unica
  - [x] Algunas opciones del menú se salen del bucle, ejemplo al eliminar una ciudad y cancelar la accion, debería volver al menú principal
- [x] **Colores:** no hay ninguno; falta definir cyan (menú), amarillo (temp), verde/rojo (ok/error).
- [x] **AGENTS.md:** dice que `index.ts` es stub, pero la app ya funciona — hay que actualizarlo.
- [x] **Ciudades:** geocoding solo trae 1 resultado; nombres ambiguos pueden fallar.
- [x] **Binario:** compila bien; revisar que `./weather` guarde datos en `~/.config/weather-cli/`.
- [x] **Escalabilidad:** ¿qué tan fácil será expandir con nuevas funcionalidades?
- [x] **Carga:** ¿hay estado de carga en las tareas asíncronas?
- [x] **7 day forecast** Agrega la posibilidad de tener el pronóstico del clima para los proximos 7 días

---

## Detalle de lo implementado

**Código**
- Todo el código vive ahora en `src/`, separado por funcionalidad: `app/`, `ui/`, `api/`, `storage/`, `cities/`, `weather/`, `settings/`, más `types.ts`.
- Cada archivo tiene una única responsabilidad (ver `AGENTS.md`).
- **Bug del menú corregido:** antes cada acción creaba su propia interfaz `readline`; ahora hay un único `Prompt` compartido (`src/ui/prompt.ts`) que además encola las líneas para no perder input. Cancelar (por ejemplo eliminar con `0`) vuelve al menú principal y solo la opción `9` sale.

**Colores** (`src/ui/colors.ts`)
- Cyan para el menú/etiquetas, amarillo para las temperaturas, verde para éxito y rojo para errores. Se desactivan con `NO_COLOR` o si la salida no es una terminal.

**AGENTS.md**
- Reescrito: ya no dice que `index.ts` es un stub; documenta la estructura en `src/`, los comandos reales, la persistencia, la UX y cómo agregar funcionalidades.

**Ciudades**
- El geocoding pide `count=8` y se muestra una lista numerada con región/país para desambiguar. La ciudad elegida se guarda con sus coordenadas (`latitude`/`longitude`) para no re-geocodificar.

**Binario**
- El estado se guarda en `~/.config/weather-cli/config.json` (en cualquier SO), con override `WEATHER_CLI_CONFIG_DIR` y soporte de `XDG_CONFIG_HOME`. Se migra automáticamente el `.weather.json` antiguo. Verificado compilando con `bun run build` y ejecutando el binario desde otro directorio.

**Escalabilidad**
- `src/app/loop.ts` usa un registro de comandos (`COMMANDS`). Agregar una funcionalidad = crear su handler, registrarlo y añadir su fila al menú.

**Carga**
- Indicador de carga (`src/ui/spinner.ts`, `withLoading`) durante geocoding y obtención de clima/pronóstico.

**7 day forecast**
- Nueva opción de menú **6. Pronóstico 7 días** (`src/weather/weeklyForecast.ts`) con min/max, código WMO traducido y probabilidad de lluvia, usando `daily=...&forecast_days=7&timezone=auto`.
