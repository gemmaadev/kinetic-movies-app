import type { ReactNode } from "react";
import { Link } from "react-router";
import { primaryStyles } from "./buttonStyles";

interface PrimaryLinkButtonProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export function PrimaryLinkButton({
  to,
  children,
  className = "",
}: PrimaryLinkButtonProps) {
  return (
    <Link to={to} className={`${primaryStyles} ${className}`}>
      {children}
    </Link>
  );
}
