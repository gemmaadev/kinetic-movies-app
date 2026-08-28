import { useEffect, useState } from "react";
import { apiClient } from "@/shared/services/apiClient";

interface UserProfile {
  id: string;
  uid: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient<UserProfile>("/api/user/profile")
      .then((data) => setProfile(data))
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { profile, isLoading, error };
}
