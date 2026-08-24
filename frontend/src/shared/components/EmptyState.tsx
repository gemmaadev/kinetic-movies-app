interface EmptyStateProps {
  quote: string;
  cite?: string;
}

export function EmptyState({ quote, cite }: EmptyStateProps) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center text-center">
      <blockquote className="italic text-xl font-bold md:text-2xl">
        "{quote}"
        {cite && (
          <cite className="block text-lg not-italic md:text-xl">
            — <span className="font-medium">{cite}</span>
          </cite>
        )}
      </blockquote>
    </div>
  );
}
