import { afterEach, describe, expect, test } from "bun:test";
import { ApiError, fetchJson } from "../../src/api/client";

describe("api/client", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test("fetchJson returns parsed JSON on success", async () => {
    global.fetch = (async () => {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }) as any;

    const result = await fetchJson<{ ok: boolean }>("https://example.com");
    expect(result.ok).toBe(true);
  });

  test("fetchJson throws ApiError with status on HTTP error", async () => {
    global.fetch = (async () => {
      return new Response("Not found", {
        status: 404,
        statusText: "Not Found",
      });
    }) as any;

    expect(fetchJson("https://example.com")).rejects.toBeInstanceOf(ApiError);
    try {
      await fetchJson("https://example.com");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(404);
      expect((err as ApiError).message).toContain("404");
    }
  });

  test("fetchJson throws ApiError on network error", async () => {
    global.fetch = (async () => {
      throw new Error("network down");
    }) as any;

    try {
      await fetchJson("https://example.com");
      expect(true).toBe(false); // should not reach
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).message).toContain("No se pudo conectar");
    }
  });

  test("fetchJson throws ApiError on invalid JSON", async () => {
    global.fetch = (async () => {
      return new Response("not json", { status: 200 });
    }) as any;

    try {
      await fetchJson("https://example.com");
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).message).toContain("respuesta inválida");
    }
  });
});
