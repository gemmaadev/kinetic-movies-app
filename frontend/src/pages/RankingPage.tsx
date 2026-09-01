import { Star } from "lucide-react";
import { useRanking } from "@/features/stats/hooks/useRanking";

export default function RankingPage() {
  const { ranking, isLoading, error } = useRanking();

  if (isLoading) return <p className="p-6">Cargando...</p>;
  if (error) return <p className="p-6 text-error">Error: {error}</p>;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold md:text-4xl">Top 20 películas</h1>
        <span className="text-secondary-text">
          Ranking de las películas mejor valoradas por la comunidad Kinetic.
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-[60px_1fr_150px_100px] items-center gap-4 px-3 text-sm font-bold text-secondary-text">
          <span className="text-center">#</span>
          <span>PELÍCULA</span>
          <span className="text-center">VALORACIÓN MEDIA</span>
          <span className="text-center">VOTOS</span>
        </div>

        <ol className="flex flex-col gap-2">
          {ranking.map((movie, index) => (
            <li
              key={movie.id}
              className="grid grid-cols-[60px_1fr_150px_100px] items-center gap-4 rounded-lg bg-bg-surface p-3"
            >
              <span className="text-center text-xl font-bold">{index + 1}</span>

              <div className="flex items-center gap-3">
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
              </div>

              <div className="flex items-center justify-center gap-1">
                <Star size={16} className="fill-brand-blue text-brand-blue" />
                <span className="font-medium">
                  {movie.averageRating.toFixed(1)}
                </span>
              </div>

              <span className="text-center text-sm text-secondary-text">
                {movie.ratingCount} votos
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
