import { useEffect, useState } from "react";
import type { Product } from "../types";
import { CartContext } from "./CartContext";

export function CartProvider({ children }: { children: React.ReactNode }) {
  // read the saved cart only once, when the page opens (lazy initialization)
  const [cart, setCart] = useState<Product[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];

  });

  // save a copy every time the cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));

  }, [cart]);

      const cartTotal = cart.reduce((acc, p) => acc + p.price, 0);

  
  function addToCart(product: Product) {
    setCart((current) => [...current, product]);
  }

  function removeFromCart(index: number) {
    setCart((current) => current.filter((_, i) => i !== index));
  }

  return (
    <CartContext value={{ addToCart, removeFromCart, cart, cartTotal}}>
      {children}
    </CartContext>
  );
}
