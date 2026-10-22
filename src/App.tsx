import { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import { Store } from "./pages/Store";
import { Cart } from "./pages/Cart";
import { ProductDetail } from "./pages/ProductDetail";
import { useCart } from "./context/CartContext";
import { Cursor } from "./components/Cursor";
import { TransitionLink } from "./components/TransitionLink";
import { Coin } from "./components/Coin";
import { formatPrice } from "./utils/format";

export default function App() {
  const { cart, cartTotal } = useCart();
  const cartCount = cart.length;
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
            {/* shopping cart icon from lucide.dev (same one as the cursor) */}
            <svg className="cart-link-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            Cart · {formatPrice(cartTotal)}
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

      {/* hidden until a page transition rolls it across the screen (see rollCoin.ts) */}
      <Coin className="coin-gold page-coin" />
    </div>
  );
}
