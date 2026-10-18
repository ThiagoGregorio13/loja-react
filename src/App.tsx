import { useRef } from "react";
import { Routes, Route, Link, useLocation } from "react-router";
import { Store } from "./pages/Store";
import { Cart } from "./pages/Cart";
import { ProductDetail } from "./pages/ProductDetail";
import { useCart } from "./context/CartContext";
import { gsap, useGSAP, NO_REDUCED_MOTION } from "./animations/gsap";

export default function App() {
  const { cart } = useCart();
  const cartCount = cart.length;
  const cartTotal = cart.reduce((acc, p) => acc + p.price, 0);

  // page transition: scroll back to the top and fade the new page in
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      window.scrollTo(0, 0);
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        gsap.from(mainRef.current!.children, { opacity: 0, y: 24, duration: 0.7, ease: "power3.out" });
      });
      return () => mm.revert();
    },
    { scope: mainRef, dependencies: [pathname] },
  );

  return (
    <div>
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="logo">
            AXON
          </Link>
          <Link to="/cart" className="cart-link">
            Cart · US$ {cartTotal.toFixed(2)}
            <span data-cart-target className={cartCount > 0 ? "counter active" : "counter"}>
              {cartCount}
            </span>
          </Link>
        </div>
      </header>

      <main className="content" ref={mainRef}>
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </main>
    </div>
  );
}
