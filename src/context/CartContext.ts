import type { Product, itemCart} from "../types";
import { createContext, useContext } from "react";

type CartContextValue = {
addToCart: (product: Product) => void;
  removeFromCart: (cartId: string) => void;
cart: itemCart[]
  cartTotal: number

};

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return context;
}
