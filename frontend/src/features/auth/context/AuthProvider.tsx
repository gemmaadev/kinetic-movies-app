import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { firebaseAuth } from "@/shared/services/firebase";
import { AuthContext, type AuthContextValue } from "../context/AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
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

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
