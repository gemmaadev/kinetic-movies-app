import { useEffect, useState } from "react";
import { apiClient } from "@/shared/services/apiClient";
import type { Movie } from "../types/movie.types";
import type {
  Person,
  ExploreResponse,
  CategoryResponse,
} from "../types/explore.types";

const categoryEndpoints: Record<string, string> = {
  popular: "/api/movie",
  "now-playing": "/api/movie/now-playing",
  "top-rated": "/api/movie/top-rated",
  trending: "/api/movie/trending",
  upcoming: "/api/movie/upcoming",
};

export function useExplore(search: string, category: string, page: number = 1) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [actors, setActors] = useState<Person[]>([]);
  const [directors, setDirectors] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [search, category, page]);

  return { movies, actors, directors, isLoading, error };
}
