import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useRanking } from "./useRanking";
import { apiClient } from "@/shared/services/apiClient";

vi.mock("@/shared/services/apiClient", () => ({
  apiClient: vi.fn(),
}));

const mockRanking = [
  {
    id: 1,
    title: "Interstellar",
    posterUrl: null,
    voteAverage: 8.6,
    releaseYear: 2014,
    averageRating: 9.2,
    ratingCount: 15,
  },
];

describe("useRanking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Scenario: Successfully load the global ranking
  //   Given the API returns ranked movies
  //   When the hook mounts
  //   Then it should store the ranking and stop loading
  it("loads the global ranking on mount", async () => {
    vi.mocked(apiClient).mockResolvedValue({ ranking: mockRanking });

    const { result } = renderHook(() => useRanking());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.ranking).toEqual(mockRanking);
      expect(result.current.isLoading).toBe(false);
    });

    expect(apiClient).toHaveBeenCalledWith("/api/movie/stats/ranking");
  });

  // Scenario: API request fails
  //   Given the API call fails
  //   When the hook mounts
  //   Then it should set an error and stop loading
  it("sets an error when the request fails", async () => {
    vi.mocked(apiClient).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useRanking());

    await waitFor(() => {
      expect(result.current.error).toBe("Network error");
      expect(result.current.isLoading).toBe(false);
    });
  });
});
