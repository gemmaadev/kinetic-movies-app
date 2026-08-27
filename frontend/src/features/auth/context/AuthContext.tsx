import { createContext } from "react";
import type { User } from "firebase/auth";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  getIdToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
