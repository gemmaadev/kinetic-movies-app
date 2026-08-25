import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 p-4 text-brand-blue hover:text-brand-teal font-bold md:p-6"
    >
      <ArrowLeft size={20} aria-hidden="true" />
      Volver
    </button>
  );
}
