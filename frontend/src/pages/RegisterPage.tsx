import { useState } from "react";
import { Link } from "react-router";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { AuthPageLayout } from "@/features/auth/components/AuthPageLayout";
import { PrimaryButton } from "@/shared/components/buttons/PrimaryButton";
import { FormField } from "@/shared/components/FormField";
import { PasswordInput } from "@/shared/components/PasswordInput";
import { SocialAuthDivider } from "@/features/auth/components/SocialAuthDivider";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { registerWithEmail, loginWithGoogle, isLoading, error } =
    useAuthActions();

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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    registerWithEmail(email, password, name);
  }

  return (
    <AuthPageLayout>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-md flex-col gap-6"
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
          <p className="text-secondary-text">Únete y empieza a disfrutar.</p>
        </div>

        <FormField label="Nombre" type="text" value={name} onChange={setName} />
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
        <PasswordInput
          label="Confirmar contraseña"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        {(validationError || error) && (
          <p className="text-error">{validationError ?? error}</p>
        )}

        <PrimaryButton type="submit">
          {isLoading ? "Creando cuenta..." : "Registrarme"}
        </PrimaryButton>

        <SocialAuthDivider onGoogleClick={loginWithGoogle} />

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
    </AuthPageLayout>
  );
}
