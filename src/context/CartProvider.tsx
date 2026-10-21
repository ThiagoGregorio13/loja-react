import { CartContext } from "./CartContext";
import type { Product, itemCart } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useLocalStorage<itemCart[]>("cart", []);
  const cartTotal = cart.reduce((acc, p) => acc + p.price, 0);

  function addToCart(product: Product) {
    setCart((current) => [
      ...current,
      { ...product, cartId: crypto.randomUUID() },
    ]);
  }

  function removeFromCart(cartId: string) {
    setCart((current) => current.filter((item) => item.cartId !== cartId));
  }

  return (
    <CartContext value={{ addToCart, removeFromCart, cart, cartTotal }}>
      {children}
    </CartContext>
  );
}
