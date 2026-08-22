export interface Movie {
  id: number;
  title: string;
  posterUrl: string | null;
  voteAverage: number;
  releaseYear: number | null;
}
export interface MovieListResponse {
  movies: Movie[];
}
