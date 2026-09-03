import { Link } from "react-router";
import { Star } from "lucide-react";
import type { Movie } from "../types/movie.types";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import { resizePosterUrl } from "@/shared/utils/resizePosterUrl";

interface MovieCardProps {
  movie: Movie;
  userRating?: number | null;
}

export function MovieCard({ movie, userRating }: MovieCardProps) {
  return (
    <article className="relative w-40 shrink-0 overflow-hidden rounded-lg bg-bg-surface transition-transform hover:scale-[1.02]">
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
            src={resizePosterUrl(movie.posterUrl, "w200") ?? undefined}
            alt={movie.title}
            width={160}
            height={240}
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
              <span>
                {movie.voteAverage != null ? movie.voteAverage.toFixed(1) : "—"}
              </span>
            </div>
            <span>{movie.releaseYear}</span>
          </div>
          {userRating != null && (
            <div className="flex items-center gap-1 text-sm text-brand-blue">
              <Star size={14} className="fill-brand-blue text-brand-blue" />
              <span className="font-bold">Tu nota: {userRating}/10</span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
