import { Link } from "react-router";
import { Star } from "lucide-react";
import type { Movie } from "../types/movie.types";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="relative w-40 shrink-0 overflow-hidden rounded-lg bg-bg-surface transition-transform hover:scale-[1.02]">
      <div className="absolute right-2 top-2 z-10">
        <FavoriteButton
          movie={{
            movieId: movie.id,
            title: movie.title,
            posterUrl: movie.posterUrl,
            voteAverage: movie.voteAverage,
            releaseYear: movie.releaseYear,
          }}
        />
      </div>

      <Link to={`/pelicula/${movie.id}`}>
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-60 w-40 object-cover"
          />
        ) : (
          <div
            className="h-60 w-40 bg-bg-surface"
            role="img"
            aria-label={`Sin póster disponible de ${movie.title}`}
          />
        )}
        <div className="flex flex-col gap-2 p-3">
          <p className="truncate font-bold">{movie.title}</p>
          <div className="flex items-center justify-between text-sm text-secondary-text">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-amber-300 text-amber-300" />
              <span>{movie.voteAverage.toFixed(1)}</span>
            </div>
            <span>{movie.releaseYear}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
