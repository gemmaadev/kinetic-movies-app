import { useState } from "react";
import { useExplore } from "@/features/explore/hooks/useExplore";
import { MovieCard } from "@/features/explore/components/MovieCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { PersonList } from "@/features/explore/components/PersonList";
import { FilterSelect } from "@/features/explore/components/FilterSelect";
import { EmptyState } from "@/shared/components";

const categories = [
  { key: "popular", label: "Populares" },
  { key: "now-playing", label: "En cines" },
  { key: "top-rated", label: "Mejor valoradas" },
  { key: "trending", label: "Tendencias" },
  { key: "upcoming", label: "Próximamente" },
];

const genres = [
  { id: "28", name: "Acción" },
  { id: "35", name: "Comedia" },
  { id: "18", name: "Drama" },
  { id: "27", name: "Terror" },
  { id: "878", name: "Ciencia ficción" },
];

const languages = [
  { code: "es", name: "Español" },
  { code: "en", name: "Inglés" },
  { code: "fr", name: "Francés" },
  { code: "ja", name: "Japonés" },
];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("popular");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [language, setLanguage] = useState("");
  const [minRating, setMinRating] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { movies, actors, directors, isLoading, error } = useExplore(
    search,
    activeCategory,
    { genre, year, language, minRating },
    1,
  );

  function handleCategoryClick(categoryKey: string) {
    setActiveCategory(categoryKey);
    setGenre("");
    setYear("");
    setLanguage("");
    setMinRating("");
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
        <div className="flex flex-wrap gap-3">
          <FilterSelect
            value={genre}
            onChange={setGenre}
            placeholder="Género"
            options={genres.map((genre) => ({
              value: genre.id,
              label: genre.name,
            }))}
          />

          <input
            type="number"
            placeholder="Año"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="w-24 rounded-md bg-bg-surface p-2 text-sm text-primary-text"
          />

          <FilterSelect
            value={language}
            onChange={setLanguage}
            placeholder="Idioma"
            options={languages.map((language) => ({
              value: language.code,
              label: language.name,
            }))}
          />

          <FilterSelect
            value={minRating}
            onChange={setMinRating}
            placeholder="Puntuación mínima"
            options={[
              { value: "5", label: "5+" },
              { value: "6", label: "6+" },
              { value: "7", label: "7+" },
              { value: "8", label: "8+" },
              { value: "9", label: "9+" },
            ]}
          />
        </div>
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,160px)] md:gap-4 justify-center">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      <PersonList title="Actores" people={actors} />
      <PersonList title="Directores" people={directors} />
    </div>
  );
}
