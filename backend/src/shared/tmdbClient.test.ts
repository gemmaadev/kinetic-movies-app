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

  // Scenario: Successful TMDB request
  //   Given a valid TMDB endpoint
  //   When tmdbFetch is called
  //   Then it should include the api_key parameter and return the parsed JSON
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

  // Scenario: TMDB request fails
  //   Given TMDB returns a non-ok response
  //   When tmdbFetch is called
  //   Then it should throw a TmdbError with the failure details
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
