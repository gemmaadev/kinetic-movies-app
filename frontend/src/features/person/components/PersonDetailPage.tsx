import { useState } from "react";
import { usePersonDetail } from "@/features/person/hooks/usePersonDetail";
import { MovieGrid } from "@/features/explore/components/MovieGrid";
import { SecondaryButton } from "@/shared/components/buttons/SecondaryButton";
import { useParams } from "react-router";
import type { MovieCredit } from "@/features/person/types/person.types";
import { BackButton } from "@/shared/components/BackButton";

const FEATURED_MOVIES_LIMIT = 8;

interface PersonDetailPageProps {
  getMovies: (
    filmography: MovieCredit[],
    filmographyAsDirector: MovieCredit[],
  ) => MovieCredit[];
  moviesTitle: string;
  notFoundMessage: string;
}

export function PersonDetailPage({
  getMovies,
  moviesTitle,
  notFoundMessage,
}: PersonDetailPageProps) {
  const { id } = useParams();
  const { person, isLoading, error, notFound } = usePersonDetail(id);
  const [showAll, setShowAll] = useState(false);

  if (isLoading) return <p className="p-6">Cargando...</p>;
  if (error)
    return (
      <p className="p-6 text-error">
        Ha ocurrido un error. Inténtalo de nuevo más tarde.
      </p>
    );
  if (notFound) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 p-6 text-center">
        <h1 className="text-2xl font-bold">{notFoundMessage}</h1>
        <p className="text-secondary-text">
          No hemos podido encontrar a la persona que buscas.
        </p>
      </div>
    );
  }
  if (!person) return null;

  const movies = getMovies(person.filmography, person.filmographyAsDirector);
  const visibleMovies = showAll
    ? movies
    : movies.slice(0, FEATURED_MOVIES_LIMIT);

  return (
    <article className="flex flex-col gap-5 pb-15 px-6">
      <BackButton />
      <section className="flex flex-col gap-6 pb-7 md:flex-row">
        {person.photoUrl ? (
          <img
            src={person.photoUrl}
            alt={`Imagen de ${person.name}`}
            width={240}
            height={360}
            className="w-60 self-start rounded-lg"
          />
        ) : (
          <div
            className="w-60 self-start rounded-lg bg-bg-surface"
            style={{ aspectRatio: "2/3" }}
            role="img"
            aria-label={`Sin imagen disponible de ${person.name}`}
          />
        )}

        <div className="flex flex-col gap-4">
          <div
            className="flex flex-col gap-2"
            role="group"
            aria-label="Información personal"
          >
            <h1 className="text-2xl font-bold md:text-5xl">{person.name}</h1>

            <span className="flex flex-col gap-1 text-secondary-text">
              {person.placeOfBirth && <span>{person.placeOfBirth}</span>}
              {person.birthday && (
                <span>
                  {new Date(person.birthday).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
            </span>
            <span className="pt-4">{person.biography}</span>
          </div>
        </div>
      </section>

      {movies.length > 0 && (
        <section className="flex flex-col gap-8">
          <h2 className="text-3xl font-bold">{moviesTitle}</h2>
          <MovieGrid movies={visibleMovies} />

          {!showAll && movies.length > FEATURED_MOVIES_LIMIT && (
            <div className="flex justify-center">
              <SecondaryButton onClick={() => setShowAll(true)}>
                Ver toda su filmografía
              </SecondaryButton>
            </div>
          )}
        </section>
      )}
    </article>
  );
}
