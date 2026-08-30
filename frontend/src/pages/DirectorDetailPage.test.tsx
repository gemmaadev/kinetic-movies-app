import { it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import DirectorDetailPage from "./DirectorDetailPage";
import { usePersonDetail } from "@/features/person/hooks/usePersonDetail";
import { useFavoritesContext } from "@/features/favorites/hooks/useFavoritesContext";

vi.mock("@/features/person/hooks/usePersonDetail", () => ({
  usePersonDetail: vi.fn(),
}));

vi.mock("@/features/favorites/hooks/useFavoritesContext", () => ({
  useFavoritesContext: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(useFavoritesContext).mockReturnValue({
    favoriteIds: new Set(),
    toggleFavorite: vi.fn(),
  });
});

// Scenario: Director's page shows only their directing credits
//   Given a person with both acting and directing credits
//   When I view their director detail page
//   Then only their directing credits should be shown, not their acting credits
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
