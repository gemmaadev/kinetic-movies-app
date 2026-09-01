import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMyRanking } from "./useMyRanking";
import { apiClient } from "@/shared/services/apiClient";

vi.mock("@/shared/services/apiClient", () => ({
  apiClient: vi.fn(),
}));

const mockMyRanking = [
  {
    id: 1,
    title: "Interstellar",
    posterUrl: null,
    voteAverage: 8.6,
    releaseYear: 2014,
    userRating: 9,
  },
];

describe("useMyRanking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Scenario: Successfully load the user's own ranked movies
  //   Given the API returns the user's rated movies
  //   When the hook mounts
  //   Then it should store them and stop loading
  it("loads the user's ranked movies on mount", async () => {
    vi.mocked(apiClient).mockResolvedValue({ ranking: mockMyRanking });

    const { result } = renderHook(() => useMyRanking());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.myRanking).toEqual(mockMyRanking);
      expect(result.current.isLoading).toBe(false);
    });

    expect(apiClient).toHaveBeenCalledWith("/api/movie/stats/mine");
  });

  // Scenario: API request fails
  //   Given the API call fails
  //   When the hook mounts
  //   Then it should set an error and stop loading
  it("sets an error when the request fails", async () => {
    vi.mocked(apiClient).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useMyRanking());

    await waitFor(() => {
      expect(result.current.error).toBe("Network error");
      expect(result.current.isLoading).toBe(false);
    });
  });
});
