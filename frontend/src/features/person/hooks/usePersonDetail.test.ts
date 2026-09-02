import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { usePersonDetail } from "./usePersonDetail";
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

const mockPerson = {
  id: 6193,
  name: "Leonardo DiCaprio",
  photoUrl: "https://image.tmdb.org/t/p/w500/dicaprio.jpg",
  biography: "American actor and producer.",
  birthday: "1974-11-11",
  placeOfBirth: "Los Angeles, California, USA",
  filmography: [],
  filmographyAsDirector: [],
};

describe("usePersonDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Scenario: Fetch person detail successfully
  //   Given a valid person id
  //   When the hook is called
  //   Then it should request the person from the API and return its data
  it("fetches and returns person detail when id is provided", async () => {
    vi.mocked(apiClient).mockResolvedValue(mockPerson);

    const { result } = renderHook(() => usePersonDetail("6193"));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(apiClient).toHaveBeenCalledWith("/api/person/6193");
    expect(result.current.person).toEqual(mockPerson);
    expect(result.current.error).toBeNull();
    expect(result.current.notFound).toBe(false);
  });

  // Scenario: API request fails with a generic error
  //   Given a request that fails with a non-404 error
  //   When the hook is called
  //   Then it should set the error and leave the person as null
  it("sets error when the request fails with a generic error", async () => {
    vi.mocked(apiClient).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => usePersonDetail("999999"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe("Network error");
    expect(result.current.person).toBeNull();
    expect(result.current.notFound).toBe(false);
  });

  // Scenario: Person not found (404)
  //   Given a person id that doesn't exist in TMDB
  //   When the hook is called
  //   Then it should set notFound to true, not error
  it("sets notFound when the API returns a 404", async () => {
    vi.mocked(apiClient).mockRejectedValue(new ApiError(404, "Not Found"));

    const { result } = renderHook(() => usePersonDetail("999999999"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.notFound).toBe(true);
    expect(result.current.error).toBeNull();
  });

  // Scenario: No id is provided
  //   Given the hook is called without an id
  //   When the effect runs
  //   Then it should not make any API request
  it("does not fetch when id is undefined", () => {
    renderHook(() => usePersonDetail(undefined));

    expect(apiClient).not.toHaveBeenCalled();
  });
});
