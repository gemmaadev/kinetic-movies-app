import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMovieDetail } from "./useMovieDetail";
import { apiClient } from "@/shared/services/apiClient";

vi.mock("@/shared/services/apiClient", () => ({
  apiClient: vi.fn(),
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
  });

  // Scenario: API request fails
  //   Given a movie id that does not exist or the request fails
  //   When the hook is called
  //   Then it should set the error and leave the movie as null
  it("sets error when the request fails", async () => {
    vi.mocked(apiClient).mockRejectedValue(new Error("Not found"));

    const { result } = renderHook(() => useMovieDetail("999999"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe("Not found");
    expect(result.current.movie).toBeNull();
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
