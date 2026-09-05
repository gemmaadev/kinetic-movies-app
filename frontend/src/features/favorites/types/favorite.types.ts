import type { Movie } from "@/features/movie/types/movie.types";

export interface FavoriteMovie extends Movie {
  userRating: number | null;
  addedAt: string;
}
