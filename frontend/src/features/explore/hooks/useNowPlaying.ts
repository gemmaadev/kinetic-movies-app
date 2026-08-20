import { useState } from "react";
import type { Movie } from "../types/movie.types";

const mockNowPlaying: Movie[] = [
  {
    id: 1,
    title: "Civil War",
    posterPath:
      "https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
    voteAverage: 8.3,
    releaseYear: 2024,
  },
  {
    id: 2,
    title: "Dune: Parte Dos",
    posterPath:
      "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    voteAverage: 8.7,
    releaseYear: 2024,
  },
  {
    id: 3,
    title: "Godzilla x Kong: El nuevo imperio",
    posterPath:
      "https://image.tmdb.org/t/p/w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg",
    voteAverage: 7.0,
    releaseYear: 2024,
  },
  {
    id: 4,
    title: "Kung Fu Panda 4",
    posterPath:
      "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
    voteAverage: 7.1,
    releaseYear: 2024,
  },
  {
    id: 5,
    title: "The Fall Guy",
    posterPath:
      "https://image.tmdb.org/t/p/original/A5LijwDVZsupBTL0qKoagMfUiKR.jpg",
    voteAverage: 7.3,
    releaseYear: 2024,
  },
  {
    id: 6,
    title: "Toy Story 5",
    posterPath:
      "https://image.tmdb.org/t/p/original/iJUV9QS4L9wS7WTV7ICV1TWUB1X.jpg",
    voteAverage: 7.5,
    releaseYear: 2026,
  },
];

export function useNowPlaying() {
  // Mock for now — will call GET /api/movie/playing once backend/movie-catalog-feature exists
  const [movies] = useState<Movie[]>(mockNowPlaying);
  return { movies };
}
