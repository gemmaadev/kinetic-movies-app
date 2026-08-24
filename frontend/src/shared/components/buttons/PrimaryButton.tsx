import type { ReactNode } from "react";
import { primaryStyles } from "./buttonStyles";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export function PrimaryButton({ children, onClick }: PrimaryButtonProps) {
  return (
    <button onClick={onClick} className={primaryStyles}>
      {children}
    </button>
  );
}
