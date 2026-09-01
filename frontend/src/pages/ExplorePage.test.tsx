import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import ExplorePage from "./ExplorePage";
import { useExplore } from "@/features/explore/hooks/useExplore";
import { useFavoritesContext } from "@/features/favorites/hooks/useFavoritesContext";

vi.mock("@/features/explore/hooks/useExplore", () => ({
  useExplore: vi.fn(),
}));

vi.mock("@/features/favorites/hooks/useFavoritesContext", () => ({
  useFavoritesContext: vi.fn(),
}));

function renderPage(initialEntry = "/explorar") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ExplorePage />
    </MemoryRouter>,
  );
}

const mockMovies = [
  {
    id: 1,
    title: "Interstellar",
    posterUrl: null,
    voteAverage: 8.6,
    releaseYear: 2014,
  },
];

const mockActors = [{ id: 10, name: "Matthew McConaughey", photoUrl: null }];
const mockDirectors = [{ id: 20, name: "Christopher Nolan", photoUrl: null }];

const defaultExploreReturn = {
  movies: [],
  actors: [],
  directors: [],
  isLoading: false,
  error: null,
  hasMore: false,
};

describe("ExplorePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFavoritesContext).mockReturnValue({
      favoriteIds: new Set(),
      toggleFavorite: vi.fn(),
    });
  });

  // Scenario: Show loading indicator while data is being fetched
  //   Given the page is loading results
  //   When the page renders
  //   Then a "Cargando..." indicator should be visible
  it("shows loading state", () => {
    vi.mocked(useExplore).mockReturnValue({
      ...defaultExploreReturn,
      isLoading: true,
    });

    renderPage();

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  // Scenario: Show an error message if the request fails
  //   Given the request failed
  //   When the page renders
  //   Then an error message should be visible
  it("shows error state", () => {
    vi.mocked(useExplore).mockReturnValue({
      ...defaultExploreReturn,
      error: "Network error",
    });

    renderPage();

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  // Scenario: Render all category buttons
  //   Given no search term is active
  //   When the page renders
  //   Then all 5 category buttons should be visible
  it("renders the 5 category buttons", () => {
    vi.mocked(useExplore).mockReturnValue(defaultExploreReturn);

    renderPage();

    expect(screen.getByText("Populares")).toBeInTheDocument();
    expect(screen.getByText("En cines")).toBeInTheDocument();
    expect(screen.getByText("Mejor valoradas")).toBeInTheDocument();
    expect(screen.getByText("Tendencias")).toBeInTheDocument();
    expect(screen.getByText("Próximamente")).toBeInTheDocument();
  });

  // Scenario: Clicking a category updates the URL search params
  //   Given the default "Populares" category is active
  //   When I click "Tendencias"
  //   Then the category search param should update to "trending"
  it("updates the category in the URL when clicking a category button", async () => {
    vi.mocked(useExplore).mockReturnValue(defaultExploreReturn);
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByText("Tendencias"));

    expect(useExplore).toHaveBeenLastCalledWith(
      "",
      "trending",
      expect.any(Object),
      1,
    );
  });

  // Scenario: Typing in the search box hides categories and filters button
  //   Given a search term is entered
  //   When the page re-renders
  //   Then the category buttons and filter button should be hidden
  it("hides categories and the filter button while searching", async () => {
    vi.mocked(useExplore).mockReturnValue(defaultExploreReturn);

    renderPage("/explorar?search=interstellar");

    expect(screen.queryByText("Populares")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /mostrar filtros/i }),
    ).not.toBeInTheDocument();
  });

  // Scenario: Toggle the filters panel
  //   Given no search term is active
  //   When I click the "Filtros" button
  //   Then the filters panel should become visible
  it("shows the filters panel when clicking the filter button", async () => {
    vi.mocked(useExplore).mockReturnValue(defaultExploreReturn);
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole("button", { name: /mostrar filtros/i }));

    expect(screen.getByLabelText(/género/i)).toBeInTheDocument();
  });

  // Scenario: Show empty state when there are no results
  //   Given the search returned no movies, actors, or directors
  //   When the page renders
  //   Then the illustrative empty state should be visible
  it("shows the empty state when there are no results", () => {
    vi.mocked(useExplore).mockReturnValue(defaultExploreReturn);

    renderPage();

    expect(
      screen.getByText(/no son los droides que estás buscando/i),
    ).toBeInTheDocument();
  });

  // Scenario: Render movies, actors, and directors when there are results
  //   Given the hook returns movies, actors, and directors
  //   When the page renders
  //   Then all of them should be visible
  it("renders movies, actors, and directors when there are results", () => {
    vi.mocked(useExplore).mockReturnValue({
      ...defaultExploreReturn,
      movies: mockMovies,
      actors: mockActors,
      directors: mockDirectors,
    });

    renderPage();

    expect(screen.getByText("Interstellar")).toBeInTheDocument();
    expect(screen.getByText("Matthew McConaughey")).toBeInTheDocument();
    expect(screen.getByText("Christopher Nolan")).toBeInTheDocument();
  });

  // Scenario: "Cargar más" button is visible when there are more pages
  //   Given hasMore is true
  //   When the page renders
  //   Then the "Cargar más" button should be visible
  it("shows the 'Cargar más' button when hasMore is true", () => {
    vi.mocked(useExplore).mockReturnValue({
      ...defaultExploreReturn,
      movies: mockMovies,
      hasMore: true,
    });

    renderPage();

    expect(
      screen.getByRole("button", { name: /cargar más/i }),
    ).toBeInTheDocument();
  });

  // Scenario: "Cargar más" button is hidden when there are no more pages
  //   Given hasMore is false
  //   When the page renders
  //   Then the "Cargar más" button should not be visible
  it("hides the 'Cargar más' button when hasMore is false", () => {
    vi.mocked(useExplore).mockReturnValue({
      ...defaultExploreReturn,
      movies: mockMovies,
      hasMore: false,
    });

    renderPage();

    expect(
      screen.queryByRole("button", { name: /cargar más/i }),
    ).not.toBeInTheDocument();
  });

  // Scenario: Clicking "Cargar más" requests the next page, accumulating results
  //   Given there are more pages available
  //   When I click "Cargar más"
  //   Then useExplore should be called with page 2
  it("requests the next page when clicking 'Cargar más'", async () => {
    vi.mocked(useExplore).mockReturnValue({
      ...defaultExploreReturn,
      movies: mockMovies,
      hasMore: true,
    });
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole("button", { name: /cargar más/i }));

    expect(useExplore).toHaveBeenLastCalledWith(
      "",
      "popular",
      expect.any(Object),
      2,
    );
  });
});
