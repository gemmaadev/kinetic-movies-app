import { describe, it, expect, vi, beforeEach } from "vitest";
import { tmdbFetch } from "./tmdbClient.js";

describe("tmdbFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calls TMDB with the api_key parameter", async () => {
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
