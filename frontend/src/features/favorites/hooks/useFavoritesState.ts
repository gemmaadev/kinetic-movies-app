import { useState, useCallback, useEffect } from "react";
import { apiClient } from "@/shared/services/apiClient";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { FavoritesContextValue } from "../context/FavoritesContext";

export function useFavoritesState(): FavoritesContextValue {
  const [rawFavoriteIds, setRawFavoriteIds] = useState<Set<number>>(new Set());
  const { isAuthenticated } = useAuth();

  const favoriteIds = isAuthenticated ? rawFavoriteIds : new Set<number>();

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    apiClient<{ favorites: { movieId: number }[] }>("/api/movie/favorites")
      .then((data) => {
        if (!cancelled) {
          setRawFavoriteIds(new Set(data.favorites.map((f) => f.movieId)));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const toggleFavorite = useCallback(
    async (movieId: number) => {
      const wasAlreadyFavorite = rawFavoriteIds.has(movieId);

      setRawFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasAlreadyFavorite) {
          next.delete(movieId);
        } else {
          next.add(movieId);
        }
        return next;
      });

      try {
        await apiClient("/api/movie/favorites", {
          method: "POST",
          body: JSON.stringify({ movieId }),
        });
      } catch (error) {
        setRawFavoriteIds((prev) => {
          const next = new Set(prev);
          if (wasAlreadyFavorite) {
            next.add(movieId);
          } else {
            next.delete(movieId);
          }
          return next;
        });
        throw error;
      }
    },
    [rawFavoriteIds],
  );

  return { favoriteIds, toggleFavorite };
}
