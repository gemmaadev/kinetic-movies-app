import { useEffect, useState } from "react";
import { apiClient } from "@/shared/services/apiClient";
import type { MovieDetail } from "../types/movieDetail.types";

export function useMovieDetail(id: string | undefined) {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    apiClient<MovieDetail>(`/api/movie/${id}`)
      .then((data) => setMovie(data))
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { movie, isLoading, error };
}
