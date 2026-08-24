import { FilterSelect } from "@/features/explore/components/FilterSelect";
import type { ExploreFiltersValues } from "../types/explore.types";

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

interface ExploreFiltersProps {
  filters: ExploreFiltersValues;
  onChange: (filters: ExploreFiltersValues) => void;
}

export function ExploreFilters({ filters, onChange }: ExploreFiltersProps) {
  function updateField<K extends keyof ExploreFiltersValues>(
    field: K,
    value: ExploreFiltersValues[K],
  ) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="flex flex-wrap gap-3">
      <FilterSelect
        value={filters.genre}
        onChange={(value) => updateField("genre", value)}
        placeholder="Género"
        options={genres.map((g) => ({ value: g.id, label: g.name }))}
      />

      <input
        type="number"
        placeholder="Año"
        value={filters.year}
        onChange={(event) => updateField("year", event.target.value)}
        className="w-24 rounded-md bg-bg-surface p-2 text-sm text-primary-text"
      />

      <FilterSelect
        value={filters.language}
        onChange={(value) => updateField("language", value)}
        placeholder="Idioma"
        options={languages.map((l) => ({ value: l.code, label: l.name }))}
      />

      <FilterSelect
        value={filters.minRating}
        onChange={(value) => updateField("minRating", value)}
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
  );
}
