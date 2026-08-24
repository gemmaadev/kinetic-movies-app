import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { MovieCard } from "./MovieCard";
import type { Movie } from "../types/movie.types";

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
  it("renders the movie title, rating and release year", () => {
    renderMovieCard(mockMovie);

    expect(screen.getByText("Dune: Parte Dos")).toBeInTheDocument();
    expect(screen.getByText("8.7")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("links to the correct movie detail page", () => {
    renderMovieCard(mockMovie);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/pelicula/2");
  });

  it("renders the poster image with correct src and alt", () => {
    renderMovieCard(mockMovie);

    const image = screen.getByAltText("Dune: Parte Dos");
    expect(image).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w500/dune.jpg",
    );
  });

  it("does not break when posterUrl is null", () => {
    renderMovieCard({ ...mockMovie, posterUrl: null });

    const image = screen.getByAltText("Dune: Parte Dos");
    expect(image).not.toHaveAttribute("src", expect.stringContaining("null"));
  });
});
