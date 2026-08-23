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
