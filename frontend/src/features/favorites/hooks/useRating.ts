import { useState } from "react";
import { apiClient } from "@/shared/services/apiClient";

export function useRating() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function rateMovie(movieId: number, rating: number): Promise<void> {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient("/api/movie/rating", {
        method: "PATCH",
        body: JSON.stringify({ movieId, rating }),
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error al guardar la puntuación",
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return { rateMovie, isLoading, error };
}
