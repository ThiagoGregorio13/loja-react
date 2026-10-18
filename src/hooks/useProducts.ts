import { useEffect, useState } from "react";
import type { Product, ApiResponse } from "../types";

export function useProducts(category: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // if the category changes before the response arrives, ignore the old response
    let ignore = false;

    async function loadProducts() {
      setLoading(true); // turn "loading" on for every new request
      setError(null); // clear the previous error

      // the URL depends on the selected category
      const url =
        category === ""
          ? "https://dummyjson.com/products?limit=0"
          : `https://dummyjson.com/products/category/${category}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error ${response.status} while fetching products`);
        }
        const data: ApiResponse = await response.json();
        if (!ignore) setProducts(data.products);
      } catch (e) {
        if (!ignore) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [category]);

  return { products, loading, error };
}
