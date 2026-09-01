import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useExplore } from "./useExplore";
import { apiClient } from "@/shared/services/apiClient";

vi.mock("@/shared/services/apiClient", () => ({
  apiClient: vi.fn(),
}));

const mockMovies = [
  {
    id: 1,
    title: "Interstellar",
    posterUrl: null,
    voteAverage: 8.6,
    releaseYear: 2014,
  },
];

const mockActors = [{ id: 10, name: "Matthew McConaughey", photoUrl: null }];
const mockDirectors = [{ id: 20, name: "Christopher Nolan", photoUrl: null }];

const emptyFilters = { genre: "", year: "", language: "", minRating: "" };

describe("useExplore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Scenario: No search or filters, fetch the default category
  //   Given no search term and no filters
  //   When the hook mounts
  //   Then it should fetch the popular category by default
  it("fetches the default category when there is no search or filters", async () => {
    vi.mocked(apiClient).mockResolvedValue({
      movies: mockMovies,
      totalPages: 5,
    });

    const { result } = renderHook(() =>
      useExplore("", "popular", emptyFilters),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(apiClient).toHaveBeenCalledWith("/api/movie?page=1");
    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.actors).toEqual([]);
    expect(result.current.directors).toEqual([]);
  });

  // Scenario: Search term provided, fetch combined results
  //   Given a search term
  //   When the hook mounts
  //   Then it should fetch combined movies, actors, and directors
  it("fetches combined results when there is a search term", async () => {
    vi.mocked(apiClient).mockResolvedValue({
      movies: mockMovies,
      actors: mockActors,
      directors: mockDirectors,
      totalPages: 3,
    });

    const { result } = renderHook(() =>
      useExplore("interstellar", "popular", emptyFilters),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(apiClient).toHaveBeenCalledWith(
      "/api/explore?search=interstellar&page=1",
    );
    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.actors).toEqual(mockActors);
    expect(result.current.directors).toEqual(mockDirectors);
  });

  // Scenario: Filters set but no search term, fetch filtered results
  //   Given filters are set but no search term
  //   When the hook mounts
  //   Then it should fetch filtered movies with empty actors/directors
  it("fetches filtered results when filters are set but there is no search", async () => {
    vi.mocked(apiClient).mockResolvedValue({
      movies: mockMovies,
      totalPages: 2,
    });

    const { result } = renderHook(() =>
      useExplore("", "popular", { ...emptyFilters, genre: "28" }),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(apiClient).toHaveBeenCalledWith("/api/explore?genre=28&page=1");
    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.actors).toEqual([]);
    expect(result.current.directors).toEqual([]);
  });

  // Scenario: Uses the correct endpoint per category
  //   Given a category other than "popular"
  //   When the hook mounts
  //   Then it should call the matching category endpoint
  it("uses the correct endpoint per category", async () => {
    vi.mocked(apiClient).mockResolvedValue({
      movies: mockMovies,
      totalPages: 4,
    });

    renderHook(() => useExplore("", "trending", emptyFilters));

    await waitFor(() =>
      expect(apiClient).toHaveBeenCalledWith("/api/movie/trending?page=1"),
    );
  });

  // Scenario: Request fails
  //   Given the API call fails
  //   When the hook mounts
  //   Then it should set an error
  it("sets error when the request fails", async () => {
    vi.mocked(apiClient).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() =>
      useExplore("", "popular", emptyFilters),
    );

    await waitFor(() => {
      expect(result.current.error).toBe("Network error");
    });
  });
});
