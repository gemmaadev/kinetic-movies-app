import { useState } from "react";
import type { Movie } from "../types/movie.types";

const mockTrending: Movie[] = [
  {
    id: 1,
    title: "Toy Story 5",
    posterPath:
      "https://image.tmdb.org/t/p/original/iJUV9QS4L9wS7WTV7ICV1TWUB1X.jpg",
    voteAverage: 7.5,
    releaseYear: 2026,
  },
  {
    id: 2,
    title: "Spider-Man: Brand New Day",
    posterPath:
      "https://image.tmdb.org/t/p/original/fBFjaDWfNslvrs6bJjknmG27wOS.jpg",
    voteAverage: 8.0,
    releaseYear: 2026,
  },
  {
    id: 3,
    title: "The Odyssey",
    posterPath:
      "https://image.tmdb.org/t/p/original/eoNiukYRWJRxMlVnTOye0kkUB5k.jpg",
    voteAverage: 7.9,
    releaseYear: 2026,
  },
  {
    id: 4,
    title: "Minions & Monsters",
    posterPath:
      "https://image.tmdb.org/t/p/original/cLB3xULSuBWXR5Hd1UzoydEC7q3.jpg",
    voteAverage: 6.4,
    releaseYear: 2026,
  },
  {
    id: 5,
    title: "The End of Oak Street",
    posterPath:
      "https://image.tmdb.org/t/p/original/hT5qnmx9FXGkuBy5Vo1DkOoYyuS.jpg",
    voteAverage: 6.5,
    releaseYear: 2026,
  },
  {
    id: 6,
    title: "Obsession",
    posterPath:
      "https://image.tmdb.org/t/p/original/rmCkNtzYR2xTOO3ZXmIqB5zgYdE.jpg",
    voteAverage: 6.8,
    releaseYear: 2026,
  },
];

export function useTrending() {
  // Mock for now — will call GET /api/movie/trending once backend/movie-catalog-feature exists
  const [movies] = useState<Movie[]>(mockTrending);
  return { movies };
}
