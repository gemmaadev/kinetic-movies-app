import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import FavoritesPage from "./FavoritesPage";
import { useFavoritesList } from "@/features/favorites/hooks/useFavoritesList";
import { useFavoritesContext } from "@/features/favorites/hooks/useFavoritesContext";

vi.mock("@/features/favorites/hooks/useFavoritesList", () => ({
  useFavoritesList: vi.fn(),
}));

vi.mock("@/features/favorites/hooks/useFavoritesContext", () => ({
  useFavoritesContext: vi.fn(),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <FavoritesPage />
    </MemoryRouter>,
  );
}

const mockFavorites = [
  {
    id: 1,
    title: "Interstellar",
    posterUrl: null,
    voteAverage: 8.6,
    releaseYear: 2014,
    userRating: 9,
    addedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    title: "Fight Club",
    posterUrl: null,
    voteAverage: 8.4,
    releaseYear: 1999,
    userRating: 6,
    addedAt: "2026-02-01T00:00:00.000Z",
  },
];

describe("FavoritesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFavoritesContext).mockReturnValue({
      favoriteIds: new Set(),
      toggleFavorite: vi.fn(),
    });
  });

  // Scenario: Show loading indicator while data is being fetched
  //   Given I navigate to the favorites page
  //   When the data is still loading
  //   Then I should see a "Cargando..." indicator
  it("shows loading state", () => {
    vi.mocked(useFavoritesList).mockReturnValue({
      favorites: [],
      isLoading: true,
      error: null,
    });

    renderPage();

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  // Scenario: Show an error message if the request fails
  //   Given I navigate to the favorites page
  //   When an error occurs while fetching the data
  //   Then I should see an error message
  it("shows error state", () => {
    vi.mocked(useFavoritesList).mockReturnValue({
      favorites: [],
      isLoading: false,
      error: "Network error",
    });

    renderPage();

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  // Scenario: Show empty state with a CTA when there are no favorites
  //   Given the user has no favorite movies
  //   When the page loads
  //   Then an illustrative empty state should appear
  //   And a CTA linking to /explorar should be visible
  it("shows the empty state with a CTA to explore movies", () => {
    vi.mocked(useFavoritesList).mockReturnValue({
      favorites: [],
      isLoading: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText(/cuando no tienes nada/i)).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: /explorar películas/i });
    expect(cta).toHaveAttribute("href", "/explorar");
  });

  // Scenario: Show the real favorites count
  //   Given the user has 2 favorite movies
  //   When the page loads
  //   Then the header should show "2 películas"
  it("shows the real favorites count", () => {
    vi.mocked(useFavoritesList).mockReturnValue({
      favorites: mockFavorites,
      isLoading: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText("2 películas")).toBeInTheDocument();
  });

  // Scenario: Render all favorite movies
  //   Given the user has favorite movies
  //   When the page loads
  //   Then every favorite movie's title should be visible
  it("renders all favorite movies", () => {
    vi.mocked(useFavoritesList).mockReturnValue({
      favorites: mockFavorites,
      isLoading: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText("Interstellar")).toBeInTheDocument();
    expect(screen.getByText("Fight Club")).toBeInTheDocument();
  });

  // Scenario: Default sort order is by most recently added
  //   Given the user has favorites added at different times
  //   When the page loads without changing the sort order
  //   Then movies should appear with the most recently added first
  it("sorts by most recently added by default", () => {
    vi.mocked(useFavoritesList).mockReturnValue({
      favorites: mockFavorites,
      isLoading: false,
      error: null,
    });

    renderPage();

    const titles = screen.getAllByText(/Interstellar|Fight Club/);
    expect(titles[0]).toHaveTextContent("Fight Club");
    expect(titles[1]).toHaveTextContent("Interstellar");
  });

  // Scenario: Sort by TMDB rating when selected
  //   Given the user has favorites with different TMDB ratings
  //   When they select "Mejor puntuadas" from the sort dropdown
  //   Then movies should appear ordered by TMDB voteAverage, highest first
  it("sorts by TMDB voteAverage when 'Mejor puntuadas' is selected", async () => {
    vi.mocked(useFavoritesList).mockReturnValue({
      favorites: mockFavorites,
      isLoading: false,
      error: null,
    });
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();

    renderPage();

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "rating");

    const titles = screen.getAllByText(/Interstellar|Fight Club/);
    expect(titles[0]).toHaveTextContent("Interstellar");
    expect(titles[1]).toHaveTextContent("Fight Club");
  });
});
