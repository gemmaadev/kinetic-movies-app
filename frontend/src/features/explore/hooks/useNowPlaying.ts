import { useEffect, useState } from "react";
import type { Movie, MovieListResponse } from "../../movie/types/movie.types";
import { apiClient } from "@/shared/services/apiClient";

export function useNowPlaying() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient<MovieListResponse>("/api/movie/now-playing")
      .then((data) => setMovies(data.movies))
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { movies, isLoading, error };
}
