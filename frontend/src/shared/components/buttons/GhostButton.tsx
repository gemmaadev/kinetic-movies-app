import type { ReactNode } from "react";
import { ghostStyles } from "./buttonStyles";

interface GhostButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export function GhostButton({ children, onClick }: GhostButtonProps) {
  return (
    <button onClick={onClick} className={ghostStyles}>
      {children}
    </button>
  );
}
