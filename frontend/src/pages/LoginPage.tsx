import { useState } from "react";
import { Link } from "react-router";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { PrimaryButton } from "@/shared/components/buttons/PrimaryButton";
import backgroundImage from "@/shared/assets/background-login-register.png";
import { FormField } from "@/shared/components/FormField";
import { PasswordInput } from "@/shared/components/PasswordInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { loginWithEmail, isLoading, error } = useAuthActions();

  function validate(): boolean {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Introduce un email válido.");
      return false;
    }
    if (!password) {
      setValidationError("Introduce tu contraseña.");
      return false;
    }
    setValidationError(null);
    return true;
  }

  function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    if (!validate()) return;
    loginWithEmail(email, password);
  }

  return (
    <div className="flex h-screen w-full">
      <div
        className="w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      <form
        onSubmit={handleSubmit}
        className="flex w-1/2 flex-col justify-center gap-6 p-20"
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">¡Bienvenido/a de nuevo!</h1>
          <p className="text-secondary-text">Inicia sesión para continuar.</p>
        </div>

        <FormField
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={setEmail}
        />
        <PasswordInput
          label="Contraseña"
          value={password}
          onChange={setPassword}
        />

        {(validationError || error) && (
          <p className="text-error">{validationError ?? error}</p>
        )}

        <PrimaryButton type="submit">
          {isLoading ? "Entrando..." : "Iniciar sesión"}
        </PrimaryButton>

        <p className="text-center text-sm text-secondary-text">
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            className="font-bold text-brand-blue hover:text-brand-teal"
          >
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}
