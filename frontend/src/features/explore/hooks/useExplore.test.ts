import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useExplore } from "./useExplore";
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

const mockPeople = [{ id: 5, name: "Denis Villeneuve", photoUrl: null }];

const emptyFilters = { genre: "", year: "", language: "", minRating: "" };

describe("useExplore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the default category when there is no search or filters", async () => {
    vi.mocked(apiClient).mockResolvedValue({ movies: mockMovies });

    const { result } = renderHook(() =>
      useExplore("", "popular", emptyFilters, 1),
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(apiClient).toHaveBeenCalledWith("/api/movie");
    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.actors).toEqual([]);
    expect(result.current.directors).toEqual([]);
  });

  it("fetches combined results when there is a search term", async () => {
    vi.mocked(apiClient).mockResolvedValue({
      movies: mockMovies,
      actors: mockPeople,
      directors: mockPeople,
    });

    const { result } = renderHook(() =>
      useExplore("dune", "popular", emptyFilters, 1),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(apiClient).toHaveBeenCalledWith(
      expect.stringContaining("search=dune"),
    );
    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.actors).toEqual(mockPeople);
    expect(result.current.directors).toEqual(mockPeople);
  });

  it("fetches filtered results when filters are set but there is no search", async () => {
    vi.mocked(apiClient).mockResolvedValue({ movies: mockMovies });

    const filters = { ...emptyFilters, genre: "28", minRating: "7" };

    const { result } = renderHook(() => useExplore("", "popular", filters, 1));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const calledUrl = vi.mocked(apiClient).mock.calls[0][0] as string;
    expect(calledUrl).toContain("genre=28");
    expect(calledUrl).toContain("minRating=7");
    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.actors).toEqual([]);
    expect(result.current.directors).toEqual([]);
  });

  it("uses the correct endpoint per category", async () => {
    vi.mocked(apiClient).mockResolvedValue({ movies: mockMovies });

    renderHook(() => useExplore("", "trending", emptyFilters, 1));

    await waitFor(() =>
      expect(apiClient).toHaveBeenCalledWith("/api/movie/trending"),
    );
  });

  it("sets error when the request fails", async () => {
    vi.mocked(apiClient).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() =>
      useExplore("", "popular", emptyFilters, 1),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe("Network error");
    expect(result.current.movies).toEqual([]);
  });
});
