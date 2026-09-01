import type { Movie } from "./movie.types";

export interface Person {
  id: number;
  name: string;
  photoUrl: string | null;
}

export interface ExploreResponse {
  movies: Movie[];
  actors: Person[];
  directors: Person[];
  totalPages: number;
}

export interface CategoryResponse {
  movies: Movie[];
  totalPages: number;
}

export interface ExploreFiltersValues {
  genre: string;
  year: string;
  language: string;
  minRating: string;
}
