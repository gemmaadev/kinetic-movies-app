import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { MovieCard } from "./MovieCard";
import type { Movie } from "../types/movie.types";
import { useFavoritesContext } from "@/features/favorites/hooks/useFavoritesContext";

vi.mock("@/features/favorites/hooks/useFavoritesContext", () => ({
  useFavoritesContext: vi.fn(),
}));

const mockMovie: Movie = {
  id: 2,
  title: "Dune: Parte Dos",
  posterUrl: "https://image.tmdb.org/t/p/w500/dune.jpg",
  voteAverage: 8.7,
  releaseYear: 2024,
};

function renderMovieCard(movie: Movie) {
  return render(
    <MemoryRouter>
      <MovieCard movie={movie} />
    </MemoryRouter>,
  );
}

describe("MovieCard", () => {
  beforeEach(() => {
    vi.mocked(useFavoritesContext).mockReturnValue({
      favoriteIds: new Set(),
      toggleFavorite: vi.fn(),
    });
  });

  // Scenario: Render the movie's basic info
  //   Given a movie with title, rating, and release year
  //   When the card renders
  //   Then all three should be visible
  it("renders the movie title, rating and release year", () => {
    renderMovieCard(mockMovie);

    expect(screen.getByText("Dune: Parte Dos")).toBeInTheDocument();
    expect(screen.getByText("8.7")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  // Scenario: Card links to the movie's detail page
  //   Given a movie with a given id
  //   When the card renders
  //   Then it should link to /pelicula/:id
  it("links to the correct movie detail page", () => {
    renderMovieCard(mockMovie);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/pelicula/2");
  });

  // Scenario: Poster image renders with the correct source
  //   Given a movie with a posterUrl
  //   When the card renders
  //   Then the image should have the correct src and alt text
  it("renders the poster image with correct src and alt", () => {
    renderMovieCard(mockMovie);

    const image = screen.getByAltText("Dune: Parte Dos");
    expect(image).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w500/dune.jpg",
    );
  });

  // Scenario: No poster available
  //   Given a movie without a posterUrl
  //   When the card renders
  //   Then it should show an accessible placeholder instead of breaking
  it("does not break when posterUrl is null", () => {
    renderMovieCard({ ...mockMovie, posterUrl: null });

    expect(
      screen.queryByRole("img", { name: "Dune: Parte Dos" }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("img", {
        name: "Sin póster disponible de Dune: Parte Dos",
      }),
    ).toBeInTheDocument();
  });
});
