import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export function PasswordInput({ value, onChange, label }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm">
        {label}
        <span className="text-error" aria-hidden="true">
          *
        </span>
      </span>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          aria-required="true"
          className="w-full rounded-md bg-bg-surface p-2 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword((show) => !show)}
          aria-label={
            showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
          }
          className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary-text pr-3"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}
