import type { Movie } from "@/features/explore/types/movie.types";

export interface FavoriteMovie extends Movie {
  userRating: number | null;
  addedAt: string;
}
