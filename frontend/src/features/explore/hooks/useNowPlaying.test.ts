import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useNowPlaying } from "./useNowPlaying";
import { apiClient } from "@/shared/services/apiClient";

vi.mock("@/shared/services/apiClient", () => ({
  apiClient: vi.fn(),
}));

const mockMovies = [
  {
    id: 2,
    title: "Dune: Parte Dos",
    posterUrl: "https://image.tmdb.org/t/p/w500/dune.jpg",
    voteAverage: 8.7,
    releaseYear: 2024,
  },
];

describe("useNowPlaying", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Scenario: Successfully load now-playing movies
  //   Given the API returns now-playing movies
  //   When the hook mounts
  //   Then it should store the movies and stop loading
  it("fetches and returns now-playing movies", async () => {
    vi.mocked(apiClient).mockResolvedValue({ movies: mockMovies });

    const { result } = renderHook(() => useNowPlaying());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(apiClient).toHaveBeenCalledWith("/api/movie/now-playing");
    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.error).toBeNull();
  });

  // Scenario: API request fails
  //   Given the API call fails
  //   When the hook mounts
  //   Then it should set an error and leave movies empty
  it("sets error when the request fails", async () => {
    vi.mocked(apiClient).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useNowPlaying());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe("Network error");
    expect(result.current.movies).toEqual([]);
  });
});
