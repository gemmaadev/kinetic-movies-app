import { useEffect, useState } from "react";
import { apiClient } from "@/shared/services/apiClient";
import type { MyRankedMovie } from "../types/ranking.types";

export function useMyRanking() {
  const [myRanking, setMyRanking] = useState<MyRankedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient<{ ranking: MyRankedMovie[] }>("/api/movie/stats/mine")
      .then((data) => setMyRanking(data.ranking))
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { myRanking, isLoading, error };
}
