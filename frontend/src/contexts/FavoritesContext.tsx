"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface FavoritesContextValue {
  favorites: number[];
  isFavorite: (marketId: number) => boolean;
  toggleFavorite: (marketId: number) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites, clearFavorites] = useLocalStorage<number[]>(
    "btc-pm-favorites",
    [],
  );

  function isFavorite(marketId: number) {
    return favorites.includes(marketId);
  }

  function toggleFavorite(marketId: number) {
    setFavorites((prev) =>
      prev.includes(marketId)
        ? prev.filter((id) => id !== marketId)
        : [...prev, marketId],
    );
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within <FavoritesProvider>");
  }
  return ctx;
}
