import { primaryStyles } from "./buttonStyles";

export function PrimaryButton({ children, onClick }) {
  return (
    <button onClick={onClick} className={primaryStyles}>
      {children}
    </button>
  );
}
