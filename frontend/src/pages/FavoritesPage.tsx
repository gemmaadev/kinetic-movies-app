import { MovieGrid } from "@/features/movie/components/MovieGrid";
import { FilterSelect } from "@/features/explore/components/FilterSelect";
import { useFavoritesList } from "@/features/favorites/hooks/useFavoritesList";
import { EmptyState } from "@/shared/components";
import { useState } from "react";

const sortOptions = [
  { value: "recent", label: "Añadidas recientemente" },
  { value: "rating", label: "Mejor puntuadas" },
];

export default function FavoritesPage() {
  const { favorites, error, isLoading } = useFavoritesList();
  const [sortBy, setSortBy] = useState("recent");

  const sortedFavorites = [...favorites].sort((movieA, movieB) => {
    if (sortBy === "rating") {
      return (movieB.voteAverage ?? 0) - (movieA.voteAverage ?? 0);
    }
    return (
      new Date(movieB.addedAt).getTime() - new Date(movieA.addedAt).getTime()
    );
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col p-6">
        <p>Cargando...</p>
      </div>
    );
  }
  if (error)
    return (
      <p className="p-6 text-error">
        Ha ocurrido un error. Inténtalo de nuevo más tarde.
      </p>
    );

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold md:text-4xl">Mis favoritas</h1>
          <span className="text-secondary-text">
            {favorites.length} películas
          </span>
        </div>

        <div className="self-start md:self-auto">
          <FilterSelect
            value={sortBy}
            onChange={setSortBy}
            placeholder="Ordenar por"
            options={sortOptions}
          />
        </div>
      </div>

      {favorites.length > 0 ? (
        <MovieGrid movies={sortedFavorites} />
      ) : (
        <EmptyState
          quote="Cuando no tienes nada, no tienes nada que perder"
          cite="Titanic"
          cta={{ to: "/explorar", label: "Explorar películas" }}
        />
      )}
    </div>
  );
}
