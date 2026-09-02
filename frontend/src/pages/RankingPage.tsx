import { Star } from "lucide-react";
import { useRanking } from "@/features/stats/hooks/useRanking";
import { Link } from "react-router";

export default function RankingPage() {
  const { ranking, isLoading, error } = useRanking();

  if (isLoading) return <p className="p-6">Cargando...</p>;
  if (error)
    return (
      <p className="p-6 text-error">
        Ha ocurrido un error. Inténtalo de nuevo más tarde.
      </p>
    );

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold md:text-4xl">Top 10 películas</h1>
        <span className="text-secondary-text">
          Ranking de las películas mejor valoradas por la comunidad Kinetic.
        </span>
      </div>

      <div className="flex flex-col gap-2 py-3 md:px-10 md:py-4">
        <div className="grid grid-cols-[40px_1fr_90px] items-center gap-2 px-3 text-sm font-bold text-secondary-text md:grid-cols-[60px_1fr_150px_100px] md:gap-4">
          <span className="text-center">#</span>
          <span>PELÍCULA</span>
          <span className="text-center">VALORACIÓN</span>
          <span className="hidden text-center md:block">VOTOS</span>
        </div>

        <ol className="flex flex-col gap-2">
          {ranking.map((movie, index) => (
            <li
              key={movie.id}
              className="grid grid-cols-[40px_1fr_90px] items-center gap-2 rounded-lg bg-bg-surface p-3 md:grid-cols-[60px_1fr_150px_100px] md:gap-4"
            >
              <span className="text-center text-lg font-bold md:text-xl">
                {index + 1}
              </span>

              <Link
                to={`/pelicula/${movie.id}`}
                aria-label={`Puesto ${index + 1}: ${movie.title}, valoración media ${movie.averageRating.toFixed(1)} de 10, ${movie.ratingCount} votos`}
                className="flex items-center gap-3 hover:text-brand-teal"
              >
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                ) : (
                  <div
                    className="h-12 w-12 rounded-md bg-bg-surface"
                    role="img"
                    aria-label={`Sin póster disponible de ${movie.title}`}
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{movie.title}</span>
                  <span className="text-xs text-secondary-text">
                    {movie.releaseYear}
                  </span>
                </div>
              </Link>

              <div className="flex items-center justify-center gap-1">
                <Star size={16} className="fill-brand-blue text-brand-blue" />
                <span className="font-medium">
                  {movie.averageRating.toFixed(1)}
                </span>
              </div>

              <span className="hidden text-center text-sm text-secondary-text md:block">
                {movie.ratingCount} votos
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
