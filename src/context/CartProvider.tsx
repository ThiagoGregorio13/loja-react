import { useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import type { Product, itemCart } from "../types";


export function CartProvider({ children }: { children: React.ReactNode }) {
  // read the saved cart only once, when the page opens (lazy initialization)
  const [cart, setCart] = useState<itemCart[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];

  });

  // save a copy every time the cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));

  }, [cart]);

      const cartTotal = cart.reduce((acc, p) => acc + p.price, 0);

  
  function addToCart(product: Product) {
    setCart((current) => [...current, {...product , cartId: crypto.randomUUID()}]);
  }

  function removeFromCart(cartId: string) {
  setCart((current) => current.filter((item) => item.cartId !== cartId));
  }

  return (
    <CartContext value={{ addToCart, removeFromCart, cart, cartTotal}}>
      {children}
    </CartContext>
  );
}
