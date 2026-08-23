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
}

export interface CategoryResponse {
  movies: Movie[];
}

export interface ExploreFilters {
  genre?: string;
  year?: string;
  language?: string;
  minRating?: string;
}
