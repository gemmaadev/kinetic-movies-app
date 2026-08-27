import { useState } from "react";
import { Link } from "react-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth } from "@/shared/services/firebase";
import { AuthPageLayout } from "@/features/auth/components/AuthPageLayout";
import { PrimaryButton } from "@/shared/components/buttons/PrimaryButton";
import { FormField } from "@/shared/components/FormField";

function getFirebaseErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;

  switch (code) {
    case "auth/invalid-email":
      return "El formato del email no es válido.";
    case "auth/user-not-found":
      return "No existe ninguna cuenta con este email.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Inténtalo más tarde.";
    default:
      return "Ha ocurrido un error. Inténtalo de nuevo.";
  }
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function validate(): boolean {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Introduce un email válido.");
      return false;
    }
    setError(null);
    return true;
  }

  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      setSuccess(true);
    } catch (error) {
      setError(getFirebaseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <AuthPageLayout>
        <div className="flex w-full max-w-md flex-col gap-4">
          <h1 className="text-2xl font-bold">Revisa tu email</h1>
          <p className="text-secondary-text">
            Te hemos enviado un enlace a <strong>{email}</strong> para
            restablecer tu contraseña.
          </p>
          <Link
            to="/login"
            className="text-sm font-bold text-brand-blue hover:text-brand-teal"
          >
            Volver a iniciar sesión
          </Link>
        </div>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-6"
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">¿Olvidaste tu contraseña?</h1>
          <p className="text-secondary-text">
            Introduce tu email y te enviaremos un enlace para restablecerla.
          </p>
        </div>

        <FormField
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={setEmail}
        />

        {error && <p className="text-error">{error}</p>}

        <PrimaryButton type="submit">
          {isLoading ? "Enviando..." : "Enviar enlace"}
        </PrimaryButton>

        <Link
          to="/login"
          className="self-center text-sm text-secondary-text hover:text-brand-teal hover:underline"
        >
          Volver a iniciar sesión
        </Link>
      </form>
    </AuthPageLayout>
  );
}
