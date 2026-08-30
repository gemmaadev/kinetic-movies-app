import type { ReactNode } from "react";
import { primaryStyles } from "./buttonStyles";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void | Promise<void>;
  type?: "button" | "submit";
  addedStyles?: string;
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  addedStyles,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={primaryStyles + " " + addedStyles}
    >
      {children}
    </button>
  );
}
