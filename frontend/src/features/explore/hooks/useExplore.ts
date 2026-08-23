import { useEffect, useState } from "react";
import { apiClient } from "@/shared/services/apiClient";
import type { Movie } from "../types/movie.types";
import type {
  Person,
  ExploreResponse,
  CategoryResponse,
  ExploreFilters,
} from "../types/explore.types";

const categoryEndpoints: Record<string, string> = {
  popular: "/api/movie",
  "now-playing": "/api/movie/now-playing",
  "top-rated": "/api/movie/top-rated",
  trending: "/api/movie/trending",
  upcoming: "/api/movie/upcoming",
};

export function useExplore(
  search: string,
  category: string,
  filters: ExploreFilters = {},
  page: number = 1,
) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [actors, setActors] = useState<Person[]>([]);
  const [directors, setDirectors] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hasFilters = Boolean(
      filters.genre || filters.year || filters.language || filters.minRating,
    );

    if (search) {
      const params = new URLSearchParams();
      params.set("search", search);
      params.set("page", String(page));

      apiClient<ExploreResponse>(`/api/explore?${params.toString()}`)
        .then((data) => {
          setMovies(data.movies);
          setActors(data.actors);
          setDirectors(data.directors);
        })
        .catch((error) => setError(error.message))
        .finally(() => setIsLoading(false));
    } else if (hasFilters) {
      const params = new URLSearchParams();
      if (filters.genre) params.set("genre", filters.genre);
      if (filters.year) params.set("year", filters.year);
      if (filters.language) params.set("language", filters.language);
      if (filters.minRating) params.set("minRating", filters.minRating);
      params.set("page", String(page));

      apiClient<CategoryResponse>(`/api/explore?${params.toString()}`)
        .then((data) => {
          setMovies(data.movies);
          setActors([]);
          setDirectors([]);
        })
        .catch((error) => setError(error.message))
        .finally(() => setIsLoading(false));
    } else {
      const endpoint = categoryEndpoints[category] ?? categoryEndpoints.popular;

      apiClient<CategoryResponse>(endpoint)
        .then((data) => {
          setMovies(data.movies);
          setActors([]);
          setDirectors([]);
        })
        .catch((error) => setError(error.message))
        .finally(() => setIsLoading(false));
    }
  }, [
    search,
    category,
    filters.genre,
    filters.year,
    filters.language,
    filters.minRating,
    page,
  ]);

  return { movies, actors, directors, isLoading, error };
}
