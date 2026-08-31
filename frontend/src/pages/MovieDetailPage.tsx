import { PersonList } from "@/features/explore/components/PersonList";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import { RatingInput } from "@/features/favorites/components/RatingInput";
import { useRating } from "@/features/favorites/hooks/useRating";
import { useMovieDetail } from "@/features/movie/hooks/useMovieDetail";
import type { MovieDetail } from "@/features/movie/types/movieDetail.types";
import { BackButton } from "@/shared/components/BackButton";
import { HeroSection } from "@/shared/components/HeroSection";
import { SecondaryButton } from "@/shared/components/buttons/SecondaryButton";
import { Star } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";

export default function MovieDetailPage() {
  const { id } = useParams();
  const { movie, isLoading, error } = useMovieDetail(id);
  const { rateMovie } = useRating();

  if (isLoading) return <p className="p-6">Cargando...</p>;
  if (error) return <p className="p-6 text-error">Error: {error}</p>;
  if (!movie) return <p className="p-6">Película no encontrada.</p>;

  return <MovieDetailContent movie={movie} rateMovie={rateMovie} />;
}

function MovieDetailContent({
  movie,
  rateMovie,
}: {
  movie: MovieDetail;
  rateMovie: (movieId: number, rating: number) => Promise<void>;
}) {
  const [currentRating, setCurrentRating] = useState(movie.userRating);

  async function handleRatingChange(rating: number) {
    const previousRating = currentRating;
    setCurrentRating(rating);

    try {
      await rateMovie(movie.id, rating);
    } catch {
      setCurrentRating(previousRating);
    }
  }

  return (
    <article>
      <BackButton />

      <HeroSection
        backgroundImage={movie.backdropUrl ?? undefined}
        className="flex min-h-[60vh] items-end p-4 md:p-6"
      >
        <div className="flex flex-col gap-6 md:flex-row">
          <img
            src={movie.posterUrl ?? undefined}
            alt={`Póster de ${movie.title}`}
            className="w-56 self-start rounded-lg"
          />

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold md:text-5xl">{movie.title}</h1>
              <div
                className="flex flex-wrap items-center gap-3 text-lg"
                role="group"
                aria-label="Información de la película"
              >
                <span className="flex items-center gap-1">
                  <Star
                    size={16}
                    className="fill-amber-300 text-amber-300"
                    aria-hidden="true"
                  />
                  <span>{movie.voteAverage.toFixed(1)}</span>
                  <span className="sr-only">de 10 puntos</span>
                </span>
                <span>{movie.releaseYear}</span>
                {movie.runtime && (
                  <span>
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                  </span>
                )}
              </div>
            </div>

            <ul className="flex flex-wrap gap-2" aria-label="Géneros">
              {movie.genres.map((genre) => (
                <li
                  key={genre.id}
                  className="rounded-full bg-bg-surface px-3 py-1 text-sm"
                >
                  {genre.name}
                </li>
              ))}
            </ul>

            <p className="max-w-xl text-sm md:text-base">{movie.overview}</p>

            <div className="flex flex-wrap gap-3">
              <FavoriteButton
                movie={{
                  movieId: movie.id,
                  title: movie.title,
                  posterUrl: movie.posterUrl,
                  voteAverage: movie.voteAverage,
                  releaseYear: movie.releaseYear,
                }}
                variant="button"
              />
              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SecondaryButton>Ver tráiler</SecondaryButton>
                </a>
              )}
            </div>
          </div>
        </div>
      </HeroSection>

      <div className="flex flex-col gap-6 p-4 md:flex-row md:p-11">
        <section className="flex w-full flex-col gap-4 md:w-1/2">
          <h2 className="text-2xl font-bold">Ficha técnica</h2>

          {movie.director && (
            <div>
              <h3 className="text-sm font-bold text-secondary-text">
                Director
              </h3>
              <Link
                to={`/director/${movie.director.id}`}
                className="hover:underline"
              >
                {movie.director.name}
              </Link>
            </div>
          )}

          {movie.writers.length > 0 && (
            <DetailField label="Guión" value={movie.writers.join(", ")} />
          )}

          {movie.cast.length > 0 && (
            <DetailField
              label="Reparto"
              value={movie.cast.map((member) => member.name).join(", ")}
            />
          )}

          {movie.genres.length > 0 && (
            <DetailField
              label="Géneros"
              value={movie.genres.map((genre) => genre.name).join(", ")}
            />
          )}

          {movie.releaseYear && (
            <DetailField label="Estreno" value={String(movie.releaseYear)} />
          )}
        </section>

        <div className="flex flex-col gap-5">
          <section className="flex flex-col gap-4 md:p-6">
            <h2 className="text-2xl font-bold">Tu valoración</h2>
            <RatingInput value={currentRating} onChange={handleRatingChange} />
          </section>

          {movie.watchProviders.length > 0 && (
            <section className="flex flex-col gap-4 md:p-6">
              <h2 className="text-2xl font-bold">¿Dónde ver?</h2>
              <ul
                className="flex flex-wrap gap-3"
                aria-label="Plataformas de streaming disponibles"
              >
                {movie.watchProviders.map((provider) => (
                  <li key={provider.providerId}>
                    <img
                      src={provider.logoUrl}
                      alt={provider.providerName}
                      title={provider.providerName}
                      className="h-12 w-12 rounded-lg"
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <section className="flex flex-col gap-4 p-4 md:p-11">
        <PersonList
          title="Reparto principal"
          people={movie.cast.map((member) => ({
            id: member.id,
            name: member.name,
            photoUrl: member.photoUrl,
            subtitle: member.character,
          }))}
          linkTo={(id) => `/actor/${id}`}
        />
      </section>
    </article>
  );
}

interface DetailFieldProps {
  label: string;
  value: string;
}

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div>
      <h3 className="text-sm font-bold text-secondary-text">{label}</h3>
      <p>{value}</p>
    </div>
  );
}
