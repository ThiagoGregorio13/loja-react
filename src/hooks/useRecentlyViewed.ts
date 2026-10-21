import type { Product } from "../types";
import { useLocalStorage } from "./useLocalStorage";

export function useRecentlyViewed(){
  const [viewed, setViewed] = useLocalStorage<Product[]>("recently-viewed", [])

  function addViewed(product:Product){
    setViewed((current) => [
{...product},
...current.filter((p) => p.id !== product.id)
    ]
    .slice(0,4)
    )
  }
  return {viewed, addViewed}
}