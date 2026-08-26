import { useState } from "react";
import { Link } from "react-router";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { PrimaryButton } from "@/shared/components/buttons/PrimaryButton";
import backgroundImage from "@/shared/assets/background-login-register.png";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { registerWithEmail, isLoading, error } = useAuthActions();

  function validate(): boolean {
    if (!name.trim()) {
      setValidationError("El nombre es obligatorio.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Introduce un email válido.");
      return false;
    }
    if (password.length < 8) {
      setValidationError("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setValidationError("La contraseña debe incluir al menos una mayúscula.");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setValidationError("La contraseña debe incluir al menos un número.");
      return false;
    }
    if (password !== confirmPassword) {
      setValidationError("Las contraseñas no coinciden.");
      return false;
    }
    setValidationError(null);
    return true;
  }

  function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    if (!validate()) return;
    registerWithEmail(email, password, name);
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
          <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
          <p className="text-secondary-text">Únete y empieza a disfrutar.</p>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm">
            Nombre
            <span className="text-error" aria-hidden="true">
              *
            </span>
          </span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            aria-required="true"
            className="rounded-md bg-bg-surface p-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">
            Correo electrónico
            <span className="text-error" aria-hidden="true">
              *
            </span>
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            aria-required="true"
            className="rounded-md bg-bg-surface p-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">
            Contraseña
            <span className="text-error" aria-hidden="true">
              *
            </span>
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            aria-required="true"
            className="rounded-md bg-bg-surface p-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">
            Confirmar contraseña
            <span className="text-error" aria-hidden="true">
              *
            </span>
          </span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            aria-required="true"
            className="rounded-md bg-bg-surface p-2"
          />
        </label>

        {(validationError || error) && (
          <p className="text-error">{validationError ?? error}</p>
        )}

        <PrimaryButton type="submit">
          {isLoading ? "Creando cuenta..." : "Registrarme"}
        </PrimaryButton>

        <p className="text-center text-sm text-secondary-text">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="font-bold text-brand-blue hover:text-brand-teal"
          >
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
