import { useState } from "react";
import { useExplore } from "@/features/explore/hooks/useExplore";
import { MovieCard } from "@/features/explore/components/MovieCard";
import { Search } from "lucide-react";

const categories = [
  { key: "popular", label: "Populares" },
  { key: "now-playing", label: "En cines" },
  { key: "top-rated", label: "Mejor valoradas" },
  { key: "trending", label: "Tendencias" },
  { key: "upcoming", label: "Próximamente" },
];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("popular");
  const { movies, actors, directors, isLoading, error } = useExplore(
    search,
    activeCategory,
    1,
  );

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold md:text-4xl">Explorar</h1>

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

      {!search && (
        <div className="flex flex-wrap gap-2 md:gap-3">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                activeCategory === category.key
                  ? "bg-brand-blue text-kinetic-bg"
                  : "bg-bg-surface text-secondary-text hover:bg-brand-teal hover:text-kinetic-bg"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      {isLoading && <p>Cargando...</p>}
      {error && <p className="text-error">Error: {error}</p>}
      {!isLoading &&
        !error &&
        movies.length === 0 &&
        actors.length === 0 &&
        directors.length === 0 && (
          <div className="flex min-h-[60vh] w-full flex-col items-center justify-center text-center">
            <blockquote className="italic text-xl font-bold md:text-2xl">
              "Estos no son los droides que estás buscando."
              <cite className="block text-lg not-italic md:text-xl">
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
          <h2 className="text-xl font-bold md:text-2xl">Películas</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,160px)] md:gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {actors.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold md:text-2xl">Actores</h2>
          <div className="flex flex-wrap gap-4">
            {actors.map((actor) => (
              <div key={actor.id} className="flex flex-col items-center gap-2">
                {actor.photoUrl && (
                  <img
                    src={actor.photoUrl}
                    alt={actor.name}
                    className="h-20 w-20 rounded-full object-cover md:h-30 md:w-30"
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
          <h2 className="text-xl font-bold md:text-2xl">Directores</h2>
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
                    className="h-20 w-20 rounded-full object-cover md:h-30 md:w-30"
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
