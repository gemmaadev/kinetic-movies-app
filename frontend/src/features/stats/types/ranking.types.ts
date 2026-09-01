import type { Movie } from "@/features/explore/types/movie.types";

export interface RankedMovie extends Movie {
  averageRating: number;
  ratingCount: number;
}
