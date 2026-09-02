import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMovieDetail } from "./useMovieDetail";
import { apiClient, ApiError } from "@/shared/services/apiClient";

vi.mock("@/shared/services/apiClient", () => ({
  apiClient: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, statusText: string) {
      super(`API request failed: ${status} ${statusText}`);
      this.status = status;
    }
  },
}));

const mockMovie = {
  id: 157336,
  title: "Interstellar",
  posterUrl: "https://image.tmdb.org/t/p/w500/interstellar.jpg",
  voteAverage: 8.6,
  releaseYear: 2014,
  overview: "A team travels through a wormhole.",
  backdropUrl: null,
  runtime: 169,
  genres: [{ id: 878, name: "Ciencia ficción" }],
  tagline: null,
  cast: [],
  director: { id: 525, name: "Christopher Nolan" },
  writers: [],
  trailerUrl: null,
  watchProviders: [],
  watchProvidersLink: null,
};

describe("useMovieDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Scenario: Fetch movie detail successfully
  //   Given a valid movie id
  //   When the hook is called
  //   Then it should request the movie from the API and return its data
  it("fetches and returns movie detail when id is provided", async () => {
    vi.mocked(apiClient).mockResolvedValue(mockMovie);

    const { result } = renderHook(() => useMovieDetail("157336"));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(apiClient).toHaveBeenCalledWith("/api/movie/157336");
    expect(result.current.movie).toEqual(mockMovie);
    expect(result.current.error).toBeNull();
    expect(result.current.notFound).toBe(false);
  });

  // Scenario: API request fails with a generic error
  //   Given a request that fails with a non-404 error
  //   When the hook is called
  //   Then it should set the error and leave the movie as null
  it("sets error when the request fails with a generic error", async () => {
    vi.mocked(apiClient).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useMovieDetail("999999"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe("Network error");
    expect(result.current.movie).toBeNull();
    expect(result.current.notFound).toBe(false);
  });

  // Scenario: Movie not found (404)
  //   Given a movie id that doesn't exist in TMDB
  //   When the hook is called
  //   Then it should set notFound to true, not error
  it("sets notFound when the API returns a 404", async () => {
    vi.mocked(apiClient).mockRejectedValue(new ApiError(404, "Not Found"));

    const { result } = renderHook(() => useMovieDetail("999999999"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.notFound).toBe(true);
    expect(result.current.error).toBeNull();
  });

  // Scenario: No id is provided
  //   Given the hook is called without an id
  //   When the effect runs
  //   Then it should not make any API request
  it("does not fetch when id is undefined", () => {
    renderHook(() => useMovieDetail(undefined));

    expect(apiClient).not.toHaveBeenCalled();
  });
});
