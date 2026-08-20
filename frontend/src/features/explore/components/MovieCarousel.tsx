import type { Movie } from "../types/movie.types";
import { MovieCard } from "./MovieCard";

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
}

export function MovieCarousel({ title, movies }: MovieCarouselProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold">{title}</h2>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
