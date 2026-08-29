import type { ReactNode } from "react";
import { FavoritesContext } from "./FavoritesContext";
import { useFavoritesState } from "../hooks/useFavoritesState";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const value = useFavoritesState();
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
