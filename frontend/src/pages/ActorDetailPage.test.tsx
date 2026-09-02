import { it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import ActorDetailPage from "./ActorDetailPage";
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

// Scenario: Actor's page shows only their acting credits
//   Given a person with both acting and directing credits
//   When I view their actor detail page
//   Then only their acting credits should be shown, not their directing credits
it("renders acting filmography, not directing credits", () => {
  vi.mocked(usePersonDetail).mockReturnValue({
    person: {
      id: 1,
      name: "Test Actor",
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
    notFound: false,
  });

  render(
    <MemoryRouter initialEntries={["/actor/1"]}>
      <Routes>
        <Route path="/actor/:id" element={<ActorDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("Acted Movie")).toBeInTheDocument();
  expect(screen.queryByText("Directed Movie")).not.toBeInTheDocument();
});
