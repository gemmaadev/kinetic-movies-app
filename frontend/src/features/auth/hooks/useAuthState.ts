import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { AuthContextValue } from "../context/AuthContext";
import { firebaseAuth } from "@/shared/services/firebase";

export function useAuthState(): AuthContextValue {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function getIdToken(): Promise<string | null> {
    if (!user) return null;
    return user.getIdToken();
  }

  return { user, isAuthenticated: !!user, loading, getIdToken };
}
