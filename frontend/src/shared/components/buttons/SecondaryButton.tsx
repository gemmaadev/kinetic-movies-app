import type { ReactNode } from "react";
import { secondaryStyles } from "./buttonStyles";

interface SecondaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function SecondaryButton({
  children,
  onClick,
  type = "button",
}: SecondaryButtonProps) {
  return (
    <button type={type} onClick={onClick} className={secondaryStyles}>
      {children}
    </button>
  );
}
