import { Link } from "react-router";
import { Star } from "lucide-react";
import type { Movie } from "../types/movie.types";

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
          <Link
            key={movie.id}
            to={`/pelicula/${movie.id}`}
            className="w-40 shrink-0"
          >
            <div className="flex flex-col gap-3">
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="h-60 w-40 rounded-md object-cover"
              />
              <p className="font-bold">{movie.title}</p>
              <div className="flex items-center gap-1 text-sm text-secondary-text">
                <Star size={14} className="fill-amber-300 text-amber-300" />
                <span>{movie.voteAverage.toFixed(1)}</span>
                <span>- {movie.releaseYear}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
