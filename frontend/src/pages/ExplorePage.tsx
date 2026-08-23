import { useState } from "react";
import { useExplore } from "@/features/explore/hooks/useExplore";
import { MovieCard } from "@/features/explore/components/MovieCard";
import { Search } from "lucide-react";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const { movies, actors, directors, isLoading, error } = useExplore(search, 1);

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-4xl font-bold">Explorar</h1>

      <div className="relative w-full">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text"
        />
        <input
          type="search"
          placeholder="Buscar películas, actores, directores..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-md bg-bg-surface p-2 pl-10 text-primary-text"
        />
      </div>

      {/* Filtros */}

      {/* Etiquetas */}

      {isLoading && <p>Cargando...</p>}
      {error && <p className="text-error">Error: {error}</p>}
      {!isLoading &&
        !error &&
        movies.length === 0 &&
        actors.length === 0 &&
        directors.length === 0 && (
          <div className="flex min-h-[60vh] w-full flex-col items-center justify-center text-center">
            <blockquote className="italic text-2xl font-bold">
              "Estos no son los droides que estás buscando."
              <cite className="block text-xl not-italic">
                —
                <span className="font-medium">
                  Star Wars: Episode IV – A New Hope
                </span>
              </cite>
            </blockquote>
          </div>
        )}

      {movies.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">Películas</h2>
          <div className="grid grid-cols-[repeat(auto-fill,160px)] justify-center gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {actors.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">Actores</h2>
          <div className="flex flex-wrap gap-4">
            {actors.map((actor) => (
              <div key={actor.id} className="flex flex-col items-center gap-2">
                {actor.photoUrl && (
                  <img
                    src={actor.photoUrl}
                    alt={actor.name}
                    className="h-30 w-30 rounded-full object-cover"
                  />
                )}
                <p className="text-center text-sm">{actor.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {directors.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">Directores</h2>
          <div className="flex flex-wrap gap-4">
            {directors.map((director) => (
              <div
                key={director.id}
                className="flex flex-col items-center gap-2"
              >
                {director.photoUrl && (
                  <img
                    src={director.photoUrl}
                    alt={director.name}
                    className="h-30 w-30 rounded-full object-cover"
                  />
                )}
                <p className="text-center text-sm">{director.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
