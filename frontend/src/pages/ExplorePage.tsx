import { useState } from "react";
import { useExplore } from "@/features/explore/hooks/useExplore";
import { Search, SlidersHorizontal } from "lucide-react";
import { PersonList } from "@/features/explore/components/PersonList";
import { EmptyState } from "@/shared/components";
import { ExploreFilters } from "@/features/explore/components/ExploreFilters";
import type { ExploreFiltersValues } from "@/features/explore/types/explore.types";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { MovieGrid } from "@/features/explore/components/MovieGrid";

const categories = [
  { key: "popular", label: "Populares" },
  { key: "now-playing", label: "En cines" },
  { key: "top-rated", label: "Mejor valoradas" },
  { key: "trending", label: "Tendencias" },
  { key: "upcoming", label: "Próximamente" },
];

const EMPTY_FILTERS: ExploreFiltersValues = {
  genre: "",
  year: "",
  language: "",
  minRating: "",
};

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [activeCategory, setActiveCategory] = useState("popular");
  const [filters, setFilters] = useState<ExploreFiltersValues>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const { movies, actors, directors, isLoading, error } = useExplore(
    debouncedSearch,
    activeCategory,
    filters,
    1,
  );

  function handleCategoryClick(categoryKey: string) {
    setActiveCategory(categoryKey);
    setFilters(EMPTY_FILTERS);
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold md:text-4xl">Explorar</h1>

      <div className="flex gap-3">
        <div className="relative flex-1">
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

        {!search && (
          <button
            onClick={() => setShowFilters((open) => !open)}
            className="flex items-center gap-2 rounded-md bg-bg-surface px-4 py-2 text-sm font-bold text-secondary-text"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        )}
      </div>

      {showFilters && !search && (
        <ExploreFilters filters={filters} onChange={setFilters} />
      )}

      {!search && (
        <div className="flex flex-wrap gap-2 md:gap-3">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => handleCategoryClick(category.key)}
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
          <EmptyState
            quote="Estos no son los droides que estás buscando."
            cite="Star Wars: Episode IV – A New Hope"
          />
        )}

      {movies.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold md:text-2xl">Películas</h2>
          <MovieGrid movies={movies} />
        </section>
      )}

      <PersonList
        title="Actores"
        people={actors}
        linkTo={(id) => `/actor/${id}`}
      />
      <PersonList
        title="Directores"
        people={directors}
        linkTo={(id) => `/director/${id}`}
      />
    </div>
  );
}
