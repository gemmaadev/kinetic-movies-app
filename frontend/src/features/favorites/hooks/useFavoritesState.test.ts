import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useFavoritesState } from "./useFavoritesState";
import { apiClient } from "@/shared/services/apiClient";
import { useAuth } from "@/features/auth/hooks/useAuth";

vi.mock("@/shared/services/apiClient", () => ({
  apiClient: vi.fn(),
}));

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("useFavoritesState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Scenario: Load favorites when authenticated
  //   Given the user is authenticated
  //   When the hook mounts
  //   Then it should fetch and store the user's favorite movie ids
  it("loads favorite ids when the user is authenticated", async () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as never);
    vi.mocked(apiClient).mockResolvedValue({
      favorites: [{ movieId: 550 }, { movieId: 27205 }],
    });

    const { result } = renderHook(() => useFavoritesState());

    await waitFor(() => {
      expect(result.current.favoriteIds.has(550)).toBe(true);
      expect(result.current.favoriteIds.has(27205)).toBe(true);
    });
  });

  // Scenario: No favorites loaded when not authenticated
  //   Given the user is not authenticated
  //   When the hook mounts
  //   Then favoriteIds should be empty and no API call should be made
  it("returns an empty set and does not call the API when not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false } as never);

    const { result } = renderHook(() => useFavoritesState());

    expect(result.current.favoriteIds.size).toBe(0);
    expect(apiClient).not.toHaveBeenCalled();
  });

  // Scenario: Toggle adds a movie optimistically and confirms with the server
  //   Given the movie is not currently a favorite
  //   When toggleFavorite is called and the API succeeds
  //   Then the movie should be added to favoriteIds
  it("optimistically adds a movie and confirms via the API", async () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as never);
    vi.mocked(apiClient).mockResolvedValueOnce({ favorites: [] });

    const { result } = renderHook(() => useFavoritesState());

    await waitFor(() => expect(apiClient).toHaveBeenCalledTimes(1));

    vi.mocked(apiClient).mockResolvedValueOnce({ isFavourite: true });

    await act(async () => {
      await result.current.toggleFavorite(550);
    });

    expect(result.current.favoriteIds.has(550)).toBe(true);
    expect(apiClient).toHaveBeenCalledWith("/api/movie/favorites", {
      method: "POST",
      body: JSON.stringify({ movieId: 550 }),
    });
  });

  // Scenario: Toggle removes a movie that was already a favorite
  //   Given the movie is currently a favorite
  //   When toggleFavorite is called and the API succeeds
  //   Then the movie should be removed from favoriteIds
  it("optimistically removes a movie that was already a favorite", async () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as never);
    vi.mocked(apiClient).mockResolvedValueOnce({
      favorites: [{ movieId: 550 }],
    });

    const { result } = renderHook(() => useFavoritesState());

    await waitFor(() => expect(result.current.favoriteIds.has(550)).toBe(true));

    vi.mocked(apiClient).mockResolvedValueOnce({ isFavourite: false });

    await act(async () => {
      await result.current.toggleFavorite(550);
    });

    expect(result.current.favoriteIds.has(550)).toBe(false);
  });

  // Scenario: Toggle reverts on API failure
  //   Given a toggle is in progress
  //   When the API call fails
  //   Then the optimistic update should be reverted and the error re-thrown
  it("reverts the optimistic update if the API call fails", async () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as never);
    vi.mocked(apiClient).mockResolvedValueOnce({ favorites: [] });

    const { result } = renderHook(() => useFavoritesState());

    await waitFor(() => expect(apiClient).toHaveBeenCalledTimes(1));

    vi.mocked(apiClient).mockRejectedValueOnce(new Error("Network error"));

    await act(async () => {
      await expect(result.current.toggleFavorite(550)).rejects.toThrow(
        "Network error",
      );
    });

    expect(result.current.favoriteIds.has(550)).toBe(false);
  });
});
