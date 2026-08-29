import { createContext } from "react";

export interface FavoritesContextValue {
  favoriteIds: Set<number>;
  toggleFavorite: (movieId: number) => Promise<void>;
}

export const FavoritesContext = createContext<
  FavoritesContextValue | undefined
>(undefined);
