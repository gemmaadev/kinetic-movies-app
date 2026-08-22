import { useEffect, useState } from "react";
import type { Movie } from "../types/movie.types";
import { apiClient } from "@/shared/services/apiClient";

interface NowPlayingResponse {
  movies: Movie[];
}

export function useNowPlaying() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient<NowPlayingResponse>("/api/movie/now-playing")
      .then((data) => setMovies(data.movies))
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { movies, isLoading, error };
}
