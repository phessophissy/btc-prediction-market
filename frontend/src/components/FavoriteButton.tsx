"use client";

import { Star } from "lucide-react";
import { useFavorites } from "../contexts/FavoritesContext";

interface FavoriteButtonProps {
  marketId: number;
  className?: string;
}

export function FavoriteButton({ marketId, className = "" }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(marketId);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={active}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(marketId);
      }}
      className={`group inline-flex items-center justify-center rounded-full p-1.5 transition-colors
        ${active ? "text-amber-400" : "text-white/30 hover:text-amber-300"} ${className}`}
    >
      <Star
        className="h-4 w-4 transition-transform group-hover:scale-110"
        fill={active ? "currentColor" : "none"}
      />
    </button>
  );
}
