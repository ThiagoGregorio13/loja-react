import { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import { Store } from "./pages/Store";
import { Cart } from "./pages/Cart";
import { ProductDetail } from "./pages/ProductDetail";
import { useCart } from "./context/CartContext";
import { Cursor } from "./components/Cursor";
import { TransitionLink } from "./components/TransitionLink";

export default function App() {
  const { cart } = useCart();
  const cartCount = cart.length;
  const cartTotal = cart.reduce((acc, p) => acc + p.price, 0);

  // a new page always starts at the top. useLayoutEffect runs BEFORE the browser paints,
  // so the page transition "photographs" the new page already scrolled to the top
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div>
      <Cursor />

      <header className="site-header">
        <div className="site-header-inner">
          <TransitionLink to="/" className="logo">
            AXON
          </TransitionLink>
          <TransitionLink to="/cart" className="cart-link">
            Cart · US$ {cartTotal.toFixed(2)}
            <span data-cart-target className={cartCount > 0 ? "counter active" : "counter"}>
              {cartCount}
            </span>
          </TransitionLink>
        </div>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </main>
    </div>
  );
}
