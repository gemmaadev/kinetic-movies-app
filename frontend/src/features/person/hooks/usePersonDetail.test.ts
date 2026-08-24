import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { usePersonDetail } from "./usePersonDetail";
import { apiClient } from "@/shared/services/apiClient";

vi.mock("@/shared/services/apiClient", () => ({
  apiClient: vi.fn(),
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
  });

  // Scenario: API request fails
  //   Given a person id that does not exist or the request fails
  //   When the hook is called
  //   Then it should set the error and leave the person as null
  it("sets error when the request fails", async () => {
    vi.mocked(apiClient).mockRejectedValue(new Error("Not found"));

    const { result } = renderHook(() => usePersonDetail("999999"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe("Not found");
    expect(result.current.person).toBeNull();
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
