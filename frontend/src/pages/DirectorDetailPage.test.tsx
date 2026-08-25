import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import DirectorDetailPage from "./DirectorDetailPage";
import { usePersonDetail } from "@/features/person/hooks/usePersonDetail";

vi.mock("@/features/person/hooks/usePersonDetail", () => ({
  usePersonDetail: vi.fn(),
}));

// Scenario: DirectorDetailPage uses the director's filmography (not acting credits)
it("renders directing filmography, not acting credits", () => {
  vi.mocked(usePersonDetail).mockReturnValue({
    person: {
      id: 1,
      name: "Test Director",
      photoUrl: null,
      biography: "",
      birthday: null,
      placeOfBirth: null,
      filmography: [
        {
          id: 1,
          title: "Acted Movie",
          posterUrl: null,
          voteAverage: 7,
          releaseYear: 2020,
        },
      ],
      filmographyAsDirector: [
        {
          id: 2,
          title: "Directed Movie",
          posterUrl: null,
          voteAverage: 8,
          releaseYear: 2021,
        },
      ],
    },
    isLoading: false,
    error: null,
  });

  render(
    <MemoryRouter initialEntries={["/director/1"]}>
      <Routes>
        <Route path="/director/:id" element={<DirectorDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("Directed Movie")).toBeInTheDocument();
  expect(screen.queryByText("Acted Movie")).not.toBeInTheDocument();
});
