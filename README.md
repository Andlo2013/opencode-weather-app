# Weather CLI APP

El objetivo de esta aplicación es que creemos una aplicación de consola que pida que ingresemos la ciudad, Al final, generaremos un binario ejecutable.

### Opciones:

- Ingresar el nombre de una ciudad.
- Guardar la ciudad por defecto.
- Registrar varias otras ciudades para buscar el clima en esas otras ciudades.
- Listar las ciudades guardadas.
- Ver el pronóstico de los próximos 7 días.

## Stack

- Bun.js
- OpenMeteo

## Ejemplo de petición http:

1. Paso 1: Geocoding API (`count=8` para poder desambiguar ciudades).
2. Paso 2: OpenMeteo API (clima actual y pronóstico diario).

```
https://geocoding-api.open-meteo.com/v1/search?name=Ottawa&count=8&language=es&format=json
https://api.open-meteo.com/v1/forecast?latitude=45.41117&longitude=-75.69812&current=temperature_2m&timezone=auto
https://api.open-meteo.com/v1/forecast?latitude=45.41117&longitude=-75.69812&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto
```

## Inicializar proyecto

```bash
bun init
bun install
```

## Estructura

Código en `src/`, organizado por funcionalidad (ver `AGENTS.md` para el detalle):

```
src/
  index.ts        # entry
  actions/        # casos de uso: getWeather, addCity, removeCity, setDefaultCity, listCities...
  presentation/   # menú, bucle, salida, entrada (único readline) y spinner
  storage/        # persistencia: config.json (ciudades + ajustes)
  types/          # tipos compartidos (City, Weather, AppState, MenuOption)
  api/            # geocoding y weather (OpenMeteo)
  utils/          # format, constants, colors
```

## Datos / persistencia

El estado se guarda en `~/.config/weather-cli/config.json` (funciona igual para el binario). Se puede cambiar con la variable `WEATHER_CLI_CONFIG_DIR`. Si existe un `.weather.json` antiguo en el directorio actual, se migra automáticamente.

## Comandos

```bash
bun run start      # ejecutar la app
bun run dev        # modo watch
bun run typecheck  # verificar tipos
bun run build      # compilar binario -> weather (weather.exe en Windows)
```

## Releases

El release se publica automáticamente con GitHub Actions (`.github/workflows/release.yml`):

1. Sube el número de `version` en `package.json` (semver).
2. Haz commit y push a `main`.
3. El workflow crea el tag `v<version>` y la release, adjuntando el binario
   `weather-windows-x64.exe` compilado con `bun run build`.

Si el tag `v<version>` ya existe, el workflow no hace nada (no hay releases duplicadas).
También puedes lanzarlo a mano desde la pestaña **Actions → Release → Run workflow**.

## Colores

- **Cyan**: menú y etiquetas.
- **Amarillo**: temperaturas.
- **Verde**: operaciones exitosas.
- **Rojo**: errores.

Se desactivan con `NO_COLOR` o cuando la salida no es una terminal.

### Ejemplo del menú

Esta es la apariencia que deseamos crear

```bash
═══════════════════════════════════════
         WEATHER CLI
═══════════════════════════════════════
  1. Clima de ciudad default
  2. Clima de todas las ciudades (1)
  3. Buscar y agregar ciudad
  4. Eliminar ciudad
  5. Establecer ciudad default
  6. Listar ciudades guardadas
  7. Pronóstico 7 días
  8. Ajustes (°C)
  9. Salir
═══════════════════════════════════════
  Selecciona una opción: 5
```
