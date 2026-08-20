import { useState } from "react";
import type { Movie } from "../types/movie.types";

const mockTrending: Movie[] = [
  {
    id: 1,
    title: "Toy Story 5",
    posterPath: "https://placehold.co/500x750/151f2e/f8fafc?text=Toy+Story+5",
    voteAverage: 7.5,
    releaseYear: 2026,
  },
  {
    id: 2,
    title: "Spider-Man: Brand New Day",
    posterPath: "https://placehold.co/500x750/151f2e/f8fafc?text=Spider-Man",
    voteAverage: 8.0,
    releaseYear: 2026,
  },
  {
    id: 3,
    title: "The Odyssey",
    posterPath: "https://placehold.co/500x750/151f2e/f8fafc?text=The+Odyssey",
    voteAverage: 7.9,
    releaseYear: 2026,
  },
  {
    id: 4,
    title: "Minions & Monsters",
    posterPath: "https://placehold.co/500x750/151f2e/f8fafc?text=Minions",
    voteAverage: 6.4,
    releaseYear: 2026,
  },
  {
    id: 5,
    title: "The End of Oak Street",
    posterPath: "https://placehold.co/500x750/151f2e/f8fafc?text=Oak+Street",
    voteAverage: 6.5,
    releaseYear: 2026,
  },
  {
    id: 6,
    title: "Obsession",
    posterPath: "https://placehold.co/500x750/151f2e/f8fafc?text=Obsession",
    voteAverage: 6.8,
    releaseYear: 2026,
  },
];

export function useTrending() {
  // Mock for now — will call GET /api/movie/trending once backend/movie-catalog-feature exists
  const [movies] = useState<Movie[]>(mockTrending);
  return { movies };
}
