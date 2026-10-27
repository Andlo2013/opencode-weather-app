import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { homedir } from "os";
import { join } from "path";

describe("storage/paths", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Clear relevant env vars
    delete process.env.WEATHER_CLI_CONFIG_DIR;
    delete process.env.XDG_CONFIG_HOME;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  test("configDir uses WEATHER_CLI_CONFIG_DIR override", async () => {
    process.env.WEATHER_CLI_CONFIG_DIR = "/custom/config";
    const { configDir } = await import("../../src/storage/paths.ts");
    expect(configDir()).toBe("/custom/config");
  });

  test("configDir uses XDG_CONFIG_HOME when set", async () => {
    process.env.XDG_CONFIG_HOME = "/xdg";
    const { configDir } = await import("../../src/storage/paths.ts");
    expect(configDir()).toBe(join("/xdg", "weather-cli"));
  });

  test("configDir falls back to ~/.config/weather-cli", async () => {
    const { configDir } = await import("../../src/storage/paths.ts");
    expect(configDir()).toBe(join(homedir(), ".config", "weather-cli"));
  });

  test("statePath returns config.json under configDir", async () => {
    process.env.WEATHER_CLI_CONFIG_DIR = "/tmp/test-weather";
    const { statePath } = await import("../../src/storage/paths.ts");
    expect(statePath()).toBe(join("/tmp/test-weather", "config.json"));
  });
});
