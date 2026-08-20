import { secondaryStyles } from "./buttonStyles";

export function SecondaryButton({ children, onClick }) {
  return (
    <button onClick={onClick} className={secondaryStyles}>
      {children}
    </button>
  );
}
