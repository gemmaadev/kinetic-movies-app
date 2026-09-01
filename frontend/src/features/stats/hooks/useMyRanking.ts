import { useEffect, useState } from "react";
import { apiClient } from "@/shared/services/apiClient";
import type { MyRankedMovie } from "../types/ranking.types";

export function useMyRanking() {
  const [myRanking, setMyRanking] = useState<MyRankedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient<{ ranking: MyRankedMovie[] }>("/api/movie/stats/mine")
      .then((data) => setMyRanking(data.ranking))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return { myRanking, isLoading };
}
