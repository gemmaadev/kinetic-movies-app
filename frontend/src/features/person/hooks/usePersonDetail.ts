import { useEffect, useState } from "react";
import { apiClient, ApiError } from "@/shared/services/apiClient";
import type { Person } from "../types/person.types";

export function usePersonDetail(id: string | undefined) {
  const [person, setPerson] = useState<Person | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    apiClient<Person>(`/api/person/${id}`)
      .then((data) => setPerson(data))
      .catch((error) => {
        if (error instanceof ApiError && error.status === 404) {
          setNotFound(true);
        } else {
          setError(error.message);
        }
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  return { person, isLoading, error, notFound };
}
