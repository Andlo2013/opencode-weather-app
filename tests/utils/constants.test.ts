import { describe, expect, test } from "bun:test";
import { AFFIRMATIVE, EXIT_KEY, FORECAST_BASE, FORECAST_DAYS, GEOCODING_BASE, WEEKDAYS, WEATHER_CODES } from "../../src/utils/constants";

describe("utils/constants", () => {
  test("API bases are correct", () => {
    expect(GEOCODING_BASE).toBe("https://geocoding-api.open-meteo.com/v1/search");
    expect(FORECAST_BASE).toBe("https://api.open-meteo.com/v1/forecast");
  });

  test("FORECAST_DAYS is 7", () => {
    expect(FORECAST_DAYS).toBe(7);
  });

  test("EXIT_KEY is 9", () => {
    expect(EXIT_KEY).toBe("9");
  });

  test("AFFIRMATIVE contains expected values", () => {
    expect(AFFIRMATIVE.has("s")).toBe(true);
    expect(AFFIRMATIVE.has("si")).toBe(true);
    expect(AFFIRMATIVE.has("sí")).toBe(true);
    expect(AFFIRMATIVE.has("y")).toBe(true);
    expect(AFFIRMATIVE.has("yes")).toBe(true);
    expect(AFFIRMATIVE.has("n")).toBe(false);
  });

  test("WEEKDAYS starts on Sunday", () => {
    expect(WEEKDAYS).toEqual(["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]);
  });

  test("WEATHER_CODES has key entries", () => {
    expect(WEATHER_CODES[0]).toContain("Despejado");
    expect(WEATHER_CODES[3]).toContain("Nublado");
    expect(WEATHER_CODES[95]).toContain("Tormenta");
  });
});
