import { createContext } from "react";

export interface MovieSnapshot {
  movieId: number;
  title: string;
  posterUrl: string | null;
  voteAverage: number;
  releaseYear: number | null;
}

export interface FavoritesContextValue {
  favoriteIds: Set<number>;
  toggleFavorite: (movie: MovieSnapshot) => Promise<void>;
}

export const FavoritesContext = createContext<
  FavoritesContextValue | undefined
>(undefined);
