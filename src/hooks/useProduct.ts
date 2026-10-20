import { useEffect, useState } from "react";
import type { Product } from "../types";
import {API_URL} from "../config"


export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status} while fetching the product`);
        }
        const data: Product = await response.json();
        if (!ignore) setProduct(data);
      } catch (e) {
        if (!ignore) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [id]);

  return { product, loading, error };
}
