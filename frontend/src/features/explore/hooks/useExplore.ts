import { useEffect, useState } from "react";
import { apiClient } from "@/shared/services/apiClient";
import type { Movie } from "../../movie/types/movie.types";
import type {
  Person,
  ExploreResponse,
  CategoryResponse,
  ExploreFiltersValues,
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
  filters: ExploreFiltersValues,
  page: number = 1,
) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [actors, setActors] = useState<Person[]>([]);
  const [directors, setDirectors] = useState<Person[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hasFilters = Boolean(
      filters.genre || filters.year || filters.language || filters.minRating,
    );

    function applyResults(data: {
      movies: Movie[];
      actors?: Person[];
      directors?: Person[];
      totalPages: number;
    }) {
      setMovies((prev) => {
        if (page === 1) return data.movies;

        const existingIds = new Set(prev.map((movie) => movie.id));
        const newMovies = data.movies.filter(
          (movie) => !existingIds.has(movie.id),
        );
        return [...prev, ...newMovies];
      });
      setActors(data.actors ?? []);
      setDirectors(data.directors ?? []);
      setTotalPages(data.totalPages);
    }

    if (search) {
      const params = new URLSearchParams();
      params.set("search", search);
      params.set("page", String(page));

      apiClient<ExploreResponse>(`/api/explore?${params.toString()}`)
        .then(applyResults)
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
        .then(applyResults)
        .catch((error) => setError(error.message))
        .finally(() => setIsLoading(false));
    } else {
      const endpoint = categoryEndpoints[category] ?? categoryEndpoints.popular;
      const params = new URLSearchParams();
      params.set("page", String(page));

      apiClient<CategoryResponse>(`${endpoint}?${params.toString()}`)
        .then(applyResults)
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

  const hasMore = page < totalPages;

  return { movies, actors, directors, isLoading, error, hasMore };
}
