import { useEffect, useState } from "react";
import { apiClient } from "@/shared/services/apiClient";
import type { FavoriteMovie } from "../types/favorite.types";

export function useFavoritesList() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient<{ favorites: FavoriteMovie[] }>("/api/movie/favorites")
      .then((data) => setFavorites(data.favorites))
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { favorites, isLoading, error };
}
