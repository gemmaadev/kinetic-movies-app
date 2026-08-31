import type { ReactNode } from "react";
import { PrimaryLinkButton } from "./buttons/PrimaryLinkButton";

interface EmptyStateProps {
  quote: string;
  cite?: string;
  cta?: {
    to: string;
    label: ReactNode;
  };
}

export function EmptyState({ quote, cite, cta }: EmptyStateProps) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6 text-center">
      <blockquote className="italic text-xl font-bold md:text-2xl">
        "{quote}"
        {cite && (
          <cite className="block text-lg not-italic md:text-xl">
            — <span className="font-medium">{cite}</span>
          </cite>
        )}
      </blockquote>

      {cta && <PrimaryLinkButton to={cta.to}>{cta.label}</PrimaryLinkButton>}
    </div>
  );
}
