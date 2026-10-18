import { useEffect, useState } from "react";

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("https://dummyjson.com/products/category-list");
        if (!response.ok) {
          throw new Error(`Error ${response.status} while fetching categories`);
        }
        const data: string[] = await response.json();
        setCategories(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    }
    loadCategories();
  }, []);

  return { categories, error };
}
