import { useState } from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { PrimaryButton } from "@/shared/components/buttons/PrimaryButton";

interface FavoriteButtonProps {
  movieId: number;
  initialIsFavorite: boolean;
  variant?: "icon" | "button";
}

export function FavoriteButton({
  movieId,
  initialIsFavorite,
  variant = "icon",
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const { toggleFavorite } = useFavorites();

  async function handleClick() {
    const previousState = isFavorite;
    setIsFavorite(!previousState);

    try {
      await toggleFavorite(movieId);
    } catch {
      setIsFavorite(previousState);
    }
  }

  if (variant === "button") {
    return (
      <PrimaryButton
        onClick={handleClick}
        addedStyles="flex gap-1 items-center"
      >
        <Heart
          size={18}
          className={isFavorite ? "fill-current inline" : "inline"}
        />
        {isFavorite ? "En favoritas" : "Añadir a favoritas"}
      </PrimaryButton>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isFavorite ? "Quitar de favoritas" : "Añadir a favoritas"}
      aria-pressed={isFavorite}
    >
      <Heart
        size={20}
        className={
          isFavorite ? "fill-brand-blue text-brand-blue" : "text-secondary-text"
        }
      />
    </button>
  );
}
