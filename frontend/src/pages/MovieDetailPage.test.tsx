import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import MovieDetailPage from "./MovieDetailPage";
import { useMovieDetail } from "@/features/movie/hooks/useMovieDetail";
import { useFavoritesContext } from "@/features/favorites/hooks/useFavoritesContext";
import { useRating } from "@/features/favorites/hooks/useRating";

vi.mock("@/features/movie/hooks/useMovieDetail", () => ({
  useMovieDetail: vi.fn(),
}));

vi.mock("@/features/favorites/hooks/useFavoritesContext", () => ({
  useFavoritesContext: vi.fn(),
}));

vi.mock("@/features/favorites/hooks/useRating", () => ({
  useRating: vi.fn(),
}));

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={["/pelicula/157336"]}>
      <Routes>
        <Route path="/pelicula/:id" element={<MovieDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

const mockMovie = {
  id: 157336,
  title: "Interstellar",
  posterUrl: null,
  voteAverage: 8.6,
  releaseYear: 2014,
  overview: "A team travels through a wormhole.",
  backdropUrl: null,
  runtime: 169,
  genres: [{ id: 878, name: "Ciencia ficción" }],
  tagline: null,
  cast: [],
  director: { id: 525, name: "Christopher Nolan" },
  writers: [],
  trailerUrl: null,
  watchProviders: [],
  watchProvidersLink: null,
  isFavourite: false,
  userRating: null,
};

describe("MovieDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFavoritesContext).mockReturnValue({
      favoriteIds: new Set(),
      toggleFavorite: vi.fn(),
    });
    vi.mocked(useRating).mockReturnValue({
      rateMovie: vi.fn(),
      isLoading: false,
      error: null,
    });
  });

  // Scenario: Show loading indicator while data is being fetched
  //   Given I navigate to a movie detail page
  //   When the data is still loading
  //   Then I should see a "Cargando..." indicator
  it("shows loading state", () => {
    vi.mocked(useMovieDetail).mockReturnValue({
      movie: null,
      isLoading: true,
      error: null,
    });

    renderWithRouter();

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  // Scenario: Show an error message if the request fails
  //   Given I navigate to a movie detail page
  //   When an error occurs while fetching the data
  //   Then I should see an error message
  it("shows error state", () => {
    vi.mocked(useMovieDetail).mockReturnValue({
      movie: null,
      isLoading: false,
      error: "Network error",
    });

    renderWithRouter();

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  // Scenario: Show not-found page if the movie doesn't exist
  //   Given I navigate to a movie detail page with an invalid id
  //   When the request completes without finding the movie
  //   Then I should see the message "Película no encontrada"
  it("shows not found state when movie is null", () => {
    vi.mocked(useMovieDetail).mockReturnValue({
      movie: null,
      isLoading: false,
      error: null,
    });

    renderWithRouter();

    expect(screen.getByText(/no encontrada/i)).toBeInTheDocument();
  });

  // Scenario: View the detail sheet of an existing movie
  //   Given I navigate to the detail page of "Interstellar"
  //   When the page finishes loading
  //   Then I should see the title "Interstellar"
  it("renders the movie title when movie is loaded", () => {
    vi.mocked(useMovieDetail).mockReturnValue({
      movie: mockMovie,
      isLoading: false,
      error: null,
    });

    renderWithRouter();

    expect(
      screen.getByRole("heading", { name: "Interstellar" }),
    ).toBeInTheDocument();
  });

  // Scenario: Navigate to the director's profile
  //   Given I am on the detail page of "Interstellar"
  //   When I click on the director's name "Christopher Nolan"
  //   Then I should be redirected to that director's detail page
  it("renders a clickable director link pointing to /director/:id", () => {
    vi.mocked(useMovieDetail).mockReturnValue({
      movie: mockMovie,
      isLoading: false,
      error: null,
    });

    renderWithRouter();

    const directorLink = screen.getByRole("link", {
      name: "Christopher Nolan",
    });
    expect(directorLink).toHaveAttribute("href", "/director/525");
  });

  // Scenario: Rating input shows the movie's current rating
  //   Given the movie already has a userRating of 6
  //   When the page renders
  //   Then the rating input should display "6/10"
  it("shows the movie's current rating in the RatingInput", () => {
    vi.mocked(useMovieDetail).mockReturnValue({
      movie: { ...mockMovie, userRating: 6 },
      isLoading: false,
      error: null,
    });

    renderWithRouter();

    expect(screen.getByText("6/10")).toBeInTheDocument();
  });

  // Scenario: Clicking a rating star calls rateMovie
  //   Given the movie has no rating yet
  //   When I click a star to rate it
  //   Then rateMovie should be called with the movie's id and the chosen rating
  it("calls rateMovie when clicking a star in the RatingInput", async () => {
    const rateMovie = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useRating).mockReturnValue({
      rateMovie,
      isLoading: false,
      error: null,
    });
    vi.mocked(useMovieDetail).mockReturnValue({
      movie: mockMovie,
      isLoading: false,
      error: null,
    });

    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();

    renderWithRouter();

    const button = screen.getByLabelText("Puntuar con 8 de 10");
    await user.click(button);

    expect(rateMovie).toHaveBeenCalledWith(157336, 8);
  });
});
