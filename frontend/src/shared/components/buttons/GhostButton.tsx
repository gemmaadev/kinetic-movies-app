import { ghostStyles } from "./buttonStyles";

export function GhostButton({ children, onClick }) {
  return (
    <button onClick={onClick} className={ghostStyles}>
      {children}
    </button>
  );
}
