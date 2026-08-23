import { useEffect, useState } from "react";
import { apiClient } from "@/shared/services/apiClient";
import type { Movie } from "../types/movie.types";
import type { Person, ExploreResponse } from "../types/explore.types";

export function useExplore(search: string) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [actors, setActors] = useState<Person[]>([]);
  const [directors, setDirectors] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = search
      ? `/api/explore?search=${encodeURIComponent(search)}`
      : "/api/explore";

    apiClient<ExploreResponse>(url)
      .then((data) => {
        setMovies(data.movies);
        setActors(data.actors);
        setDirectors(data.directors);
      })
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, [search]);

  return { movies, actors, directors, isLoading, error };
}
