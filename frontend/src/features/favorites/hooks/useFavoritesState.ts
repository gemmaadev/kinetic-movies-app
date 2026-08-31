import { useState, useCallback, useEffect } from "react";
import { apiClient } from "@/shared/services/apiClient";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type {
  FavoritesContextValue,
  MovieSnapshot,
} from "../context/FavoritesContext";

export function useFavoritesState(): FavoritesContextValue {
  const [rawFavoriteIds, setRawFavoriteIds] = useState<Set<number>>(new Set());
  const { isAuthenticated } = useAuth();

  const favoriteIds = isAuthenticated ? rawFavoriteIds : new Set<number>();

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    apiClient<{ favorites: { id: number }[] }>("/api/movie/favorites")
      .then((data) => {
        if (!cancelled) {
          setRawFavoriteIds(new Set(data.favorites.map((f) => f.id)));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const toggleFavorite = useCallback(
    async (movie: MovieSnapshot) => {
      const wasAlreadyFavorite = rawFavoriteIds.has(movie.movieId);

      setRawFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasAlreadyFavorite) {
          next.delete(movie.movieId);
        } else {
          next.add(movie.movieId);
        }
        return next;
      });

      try {
        await apiClient("/api/movie/favorites", {
          method: "POST",
          body: JSON.stringify(movie),
        });
      } catch (error) {
        setRawFavoriteIds((prev) => {
          const next = new Set(prev);
          if (wasAlreadyFavorite) {
            next.add(movie.movieId);
          } else {
            next.delete(movie.movieId);
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
