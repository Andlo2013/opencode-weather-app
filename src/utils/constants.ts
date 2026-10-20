/** Endpoints de OpenMeteo (geocoding y pronóstico). */
export const GEOCODING_BASE = "https://geocoding-api.open-meteo.com/v1/search";
export const FORECAST_BASE = "https://api.open-meteo.com/v1/forecast";

/** Días de pronóstico de la opción "Pronóstico 7 días". */
export const FORECAST_DAYS = 7;

/** Tecla del menú que sale de la app. */
export const EXIT_KEY = "9";

/** Respuestas consideradas afirmativas en las confirmaciones (s/n). */
export const AFFIRMATIVE = new Set(["s", "si", "sí", "y", "yes"]);

/** Días de la semana abreviados, empezando en domingo (`Date#getDay`). */
export const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/** Etiquetas legibles para los códigos de clima WMO de Open-Meteo. */
export const WEATHER_CODES: Record<number, string> = {
  0: "☀️  Despejado",
  1: "🌤️  Mayormente despejado",
  2: "⛅ Parcialmente nublado",
  3: "☁️  Nublado",
  45: "🌫️  Niebla",
  48: "🌫️  Niebla con escarcha",
  51: "🌦️  Llovizna ligera",
  53: "🌦️  Llovizna moderada",
  55: "🌦️  Llovizna intensa",
  56: "🌧️  Llovizna helada ligera",
  57: "🌧️  Llovizna helada intensa",
  61: "🌧️  Lluvia ligera",
  63: "🌧️  Lluvia moderada",
  65: "🌧️  Lluvia intensa",
  66: "🌧️  Lluvia helada ligera",
  67: "🌧️  Lluvia helada intensa",
  71: "🌨️  Nieve ligera",
  73: "🌨️  Nieve moderada",
  75: "🌨️  Nieve intensa",
  77: "🌨️  Granos de nieve",
  80: "🌦️  Chubascos ligeros",
  81: "🌦️  Chubascos moderados",
  82: "🌦️  Chubascos violentos",
  85: "🌨️  Chubascos de nieve ligeros",
  86: "🌨️  Chubascos de nieve intensos",
  95: "⛈️  Tormenta",
  96: "⛈️  Tormenta con granizo ligero",
  99: "⛈️  Tormenta con granizo intenso",
};
