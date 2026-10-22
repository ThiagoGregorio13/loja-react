import type { Product } from "../types";
import { API_URL } from "../config";
import { useFetch } from "./useFetch";


export function useProduct(id:string | undefined) {
 const {data, loading, error} = useFetch<Product>(`${API_URL}/products/${id}`)

  return { product: data, loading, error };
}
