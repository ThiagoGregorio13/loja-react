import type { ApiResponse } from "../types";
import { API_URL } from "../config";
import { useFetch } from "./useFetch";


export function useProducts(category:string | undefined) {
const url = category === "" ? `${API_URL}/products?limit=0` : `${API_URL}/products/category/${category}`;
const { data, loading, error } = useFetch<ApiResponse>(url);

  return {products: data?.products ?? [], loading, error}
}
