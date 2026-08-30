import { useState } from "react";
import { Star, StarHalf } from "lucide-react";

interface RatingInputProps {
  value: number | null;
  onChange: (rating: number) => void;
}

export function RatingInput({ value, onChange }: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue ?? value;

  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label="Puntuar película del 1 al 10"
      onMouseLeave={() => setHoverValue(null)}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const starIndex = index + 1;
        const fullValue = starIndex * 2;
        const halfValue = fullValue - 1;

        const isFull = displayValue !== null && displayValue >= fullValue;
        const isHalf = displayValue !== null && displayValue === halfValue;

        return (
          <div key={starIndex} className="relative">
            <button
              type="button"
              onClick={() => onChange(halfValue)}
              onMouseEnter={() => setHoverValue(halfValue)}
              aria-label={`Puntuar con ${halfValue} de 10`}
              className="absolute left-0 top-0 z-10 h-full w-1/2"
            />
            <button
              type="button"
              onClick={() => onChange(fullValue)}
              onMouseEnter={() => setHoverValue(fullValue)}
              aria-label={`Puntuar con ${fullValue} de 10`}
              className="absolute right-0 top-0 z-10 h-full w-1/2"
            />
            {/* Background outline, always visible */}
            <Star size={24} className="text-secondary-text" />
            {isFull && (
              <Star
                size={24}
                className="absolute left-0 top-0 fill-brand-blue text-brand-blue"
              />
            )}
            {isHalf && (
              <StarHalf
                size={24}
                className="absolute left-0 top-0 fill-brand-blue text-brand-blue"
              />
            )}
          </div>
        );
      })}
      {displayValue !== null && (
        <span className="text-secondary-text">{displayValue}/10</span>
      )}
    </div>
  );
}
