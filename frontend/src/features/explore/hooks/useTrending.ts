import { useEffect, useState } from "react";
import { apiClient } from "@/shared/services/apiClient";
import type { Movie } from "../types/movie.types";

interface TrendingResponse {
  movies: Movie[];
}

export function useTrending() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient<TrendingResponse>("/api/movie/trending")
      .then((data) => setMovies(data.movies))
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { movies, isLoading, error };
}
