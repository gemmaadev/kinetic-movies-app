import { useState } from "react";
import { apiClient } from "@/shared/services/apiClient";

export function useFavorites() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleFavorite(movieId: number): Promise<boolean> {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient<{ isFavourite: boolean }>(
        "/api/movie/favorites",
        {
          method: "POST",
          body: JSON.stringify({ movieId }),
        },
      );
      return result.isFavourite;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error al marcar como favorita",
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return { toggleFavorite, isLoading, error };
}
