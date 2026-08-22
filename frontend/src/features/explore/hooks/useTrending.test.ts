import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useTrending } from "./useTrending";
import { apiClient } from "@/shared/services/apiClient";

vi.mock("@/shared/services/apiClient", () => ({
  apiClient: vi.fn(),
}));

const mockMovies = [
  {
    id: 1,
    title: "Interstellar",
    posterUrl: "https://image.tmdb.org/t/p/w500/interstellar.jpg",
    voteAverage: 8.6,
    releaseYear: 2014,
  },
];

describe("useTrending", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and returns trending movies", async () => {
    vi.mocked(apiClient).mockResolvedValue({ movies: mockMovies });

    const { result } = renderHook(() => useTrending());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(apiClient).toHaveBeenCalledWith("/api/movie/trending");
    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.error).toBeNull();
  });

  it("sets error when the request fails", async () => {
    vi.mocked(apiClient).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useTrending());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe("Network error");
    expect(result.current.movies).toEqual([]);
  });
});
