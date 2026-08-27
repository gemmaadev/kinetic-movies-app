import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router";
import { firebaseAuth } from "@/shared/services/firebase";
import { apiClient } from "@/shared/services/apiClient";

function getFirebaseErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;

  switch (code) {
    case "auth/email-already-in-use":
      return "Ya existe una cuenta con este email.";
    case "auth/invalid-email":
      return "El formato del email no es válido.";
    case "auth/weak-password":
      return "La contraseña es demasiado débil.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email o contraseña incorrectos.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Inténtalo más tarde.";
    case "auth/account-exists-with-different-credential":
      return "Ya existe una cuenta con este email usando otro método de acceso. Prueba a iniciar sesión con tu contraseña.";
    default:
      return "Ha ocurrido un error. Inténtalo de nuevo.";
  }
}

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function runAuthAction(action: () => Promise<void>) {
    setIsLoading(true);
    setError(null);

    try {
      await action();
      navigate("/");
    } catch (error) {
      setError(getFirebaseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  function registerWithEmail(email: string, password: string, name: string) {
    return runAuthAction(async () => {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await apiClient("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email }),
      });
    });
  }

  function loginWithEmail(email: string, password: string) {
    return runAuthAction(async () => {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      await apiClient("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({}),
      });
    });
  }

  function loginWithGoogle() {
    return runAuthAction(async () => {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(firebaseAuth, provider);

      await apiClient("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: credential.user.displayName,
          email: credential.user.email,
          avatarUrl: credential.user.photoURL,
        }),
      });
    });
  }

  return {
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    isLoading,
    error,
  };
}
