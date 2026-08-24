import type { ReactNode } from "react";
import { secondaryStyles } from "./buttonStyles";

interface SecondaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export function SecondaryButton({ children, onClick }: SecondaryButtonProps) {
  return (
    <button onClick={onClick} className={secondaryStyles}>
      {children}
    </button>
  );
}
