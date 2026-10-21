import { useCallback } from "react";
import type { Product } from "../types";
import { useLocalStorage } from "./useLocalStorage";

export function useRecentlyViewed() {
  const [viewed, setViewed] = useLocalStorage<Product[]>("recently-viewed", []);

  // newest first, no duplicates, at most 4 products.
  // useCallback keeps the same function between renders, so it can be a useEffect dependency
  const addViewed = useCallback(
    (product: Product) => {
      setViewed((current) => [product, ...current.filter((p) => p.id !== product.id)].slice(0, 4));
    },
    [setViewed],
  );

  return { viewed, addViewed };
}
