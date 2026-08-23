import { useEffect, useState } from "react";
import { apiClient } from "@/shared/services/apiClient";
import type { Movie } from "../types/movie.types";
import type { Person, ExploreResponse } from "../types/explore.types";

export function useExplore(search: string, page: number = 1) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [actors, setActors] = useState<Person[]>([]);
  const [directors, setDirectors] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));

    apiClient<ExploreResponse>(`/api/explore?${params.toString()}`)
      .then((data) => {
        setMovies(data.movies);
        setActors(data.actors);
        setDirectors(data.directors);
      })
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, [search, page]);

  return { movies, actors, directors, isLoading, error };
}
