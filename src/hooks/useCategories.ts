import { API_URL } from "../config";
import { useFetch } from "./useFetch";

export function useCategories() {
  const { data, loading, error } = useFetch<string[]>(`${API_URL}/products/category-list`)
  return { categories: data ?? [], loading, error };

}
