import { SecondaryButton } from "@/shared/components/buttons/SecondaryButton";
import { FcGoogle } from "react-icons/fc";

interface SocialAuthDividerProps {
  onGoogleClick: () => void;
}

export function SocialAuthDivider({ onGoogleClick }: SocialAuthDividerProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-bg-surface" />
        <span className="text-xs text-secondary-text">o continúa con</span>
        <div className="h-px flex-1 bg-bg-surface" />
      </div>

      <SecondaryButton type="button" onClick={onGoogleClick}>
        <span className="flex items-center justify-center gap-2 text-white">
          <FcGoogle size={18} />
          Continuar con Google
        </span>
      </SecondaryButton>
    </>
  );
}
