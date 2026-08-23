import { useState } from "react";
import { useExplore } from "@/features/explore/hooks/useExplore";
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
    </div>
  );
}
