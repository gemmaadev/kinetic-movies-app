import type { ReactNode } from "react";
import { primaryStyles } from "./buttonStyles";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
}: PrimaryButtonProps) {
  return (
    <button type={type} onClick={onClick} className={primaryStyles}>
      {children}
    </button>
  );
}
