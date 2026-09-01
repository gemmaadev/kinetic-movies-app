import { MovieCard } from "./MovieCard";
import type { Movie } from "../types/movie.types";

interface MovieGridProps {
  movies: (Movie & { userRating?: number | null })[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,160px)] gap-3 md:gap-4 justify-center">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} userRating={movie.userRating} />
      ))}
    </div>
  );
}
