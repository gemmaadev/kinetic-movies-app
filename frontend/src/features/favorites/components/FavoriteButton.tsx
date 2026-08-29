import { Heart } from "lucide-react";
import { useFavoritesContext } from "@/features/favorites/hooks/useFavoritesContext";
import { PrimaryButton } from "@/shared/components/buttons/PrimaryButton";

interface FavoriteButtonProps {
  movieId: number;
  variant?: "icon" | "button";
}

export function FavoriteButton({
  movieId,
  variant = "icon",
}: FavoriteButtonProps) {
  const { favoriteIds, toggleFavorite } = useFavoritesContext();
  const isFavorite = favoriteIds.has(movieId);

  function handleClick() {
    toggleFavorite(movieId).catch(() => {});
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
