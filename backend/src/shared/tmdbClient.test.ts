import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("tmdbFetch", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.TMDB_API_KEY = "test-api-key";
    process.env.TMDB_BASE_URL = "https://api.themoviedb.org/3";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls TMDB with the api_key parameter", async () => {
    const { tmdbFetch } = await import("./tmdbClient.js");
    const mockResponse = { results: [{ title: "Test Movie" }] };

    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const data = await tmdbFetch("/movie/popular");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("api_key="),
    );
    expect(data).toEqual(mockResponse);
  });

  it("throws an error when the TMDB request fails", async () => {
    const { tmdbFetch } = await import("./tmdbClient.js");

    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    } as Response);

    await expect(tmdbFetch("/movie/popular")).rejects.toThrow(
      "TMDB request failed",
    );
  });
});
