import { useEffect, useState } from "react";
import { apiClient } from "@/shared/services/apiClient";
import type { RankedMovie } from "../types/ranking.types";

export function useRanking() {
  const [ranking, setRanking] = useState<RankedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient<{ ranking: RankedMovie[] }>("/api/movie/stats/ranking")
      .then((data) => setRanking(data.ranking))
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { ranking, isLoading, error };
}
