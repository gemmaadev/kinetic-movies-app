import { useEffect, useState } from "react";
import { apiClient } from "@/shared/services/apiClient";
import type { Movie, MovieListResponse } from "../../movie/types/movie.types";

export function useTrending() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient<MovieListResponse>("/api/movie/trending?page=1")
      .then((data) => setMovies(data.movies))
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { movies, isLoading, error };
}
