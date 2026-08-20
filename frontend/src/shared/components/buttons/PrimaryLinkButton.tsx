import { Link } from "react-router";
import { primaryStyles } from "./buttonStyles";

export function PrimaryLinkButton({ to, children, className = "" }) {
  return (
    <Link to={to} className={`${primaryStyles} ${className}`}>
      {children}
    </Link>
  );
}
