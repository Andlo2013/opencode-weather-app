import { describe, expect, test } from "bun:test";
import { cityLabel, formatDate, formatTemperature, weatherCodeLabel } from "../../src/utils/format";
import { WEEKDAYS } from "../../src/utils/constants";

describe("utils/format", () => {
  test("formatTemperature uses Celsius by default", () => {
    const result = formatTemperature(20, "C");
    expect(result).toContain("20.0 °C");
  });

  test("formatTemperature converts to Fahrenheit", () => {
    const result = formatTemperature(0, "F");
    expect(result).toContain("32.0 °F");
  });

  test("formatTemperature converts 100C to 212F", () => {
    const result = formatTemperature(100, "F");
    expect(result).toContain("212.0 °F");
  });

  test("weatherCodeLabel returns label for known code", () => {
    expect(weatherCodeLabel(0)).toContain("Despejado");
    expect(weatherCodeLabel(95)).toContain("Tormenta");
  });

  test("weatherCodeLabel returns unknown for missing code", () => {
    expect(weatherCodeLabel(9999)).toBe("❓ Desconocido");
  });

  test("formatDate formats ISO date as 'Día DD/MM'", () => {
    const result = formatDate("2025-10-17");
    expect(result).toMatch(new RegExp(`${WEEKDAYS[5]} 17/10`));
  });

  test("formatDate returns original string if invalid", () => {
    expect(formatDate("invalid")).toBe("invalid");
  });

  test("cityLabel joins parts omitting empty and repeated admin1", () => {
    expect(cityLabel({ name: "Madrid" })).toBe("Madrid");
    expect(cityLabel({ name: "Madrid", country: "ES" })).toBe("Madrid, ES");
    expect(cityLabel({ name: "Madrid", admin1: "Comunidad de Madrid", country: "ES" })).toBe(
      "Madrid, Comunidad de Madrid, ES"
    );
    expect(cityLabel({ name: "Madrid", admin1: "Madrid", country: "ES" })).toBe("Madrid, ES");
  });
});
