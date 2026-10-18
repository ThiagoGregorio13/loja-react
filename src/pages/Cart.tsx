import { useRef } from "react";
import { Link } from "react-router";
import { useCart } from "../context/CartContext";
import { gsap, useGSAP, NO_REDUCED_MOTION, prefersReducedMotion } from "../animations/gsap";

export function Cart() {
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((acc, p) => acc + p.price, 0);

  const pageRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLElement>(null);
  const previousTotal = useRef(total);
  const needsCleanup = useRef(false);

  // intro: the items slide in one after another
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        gsap.from(".cart-item", { opacity: 0, x: -30, stagger: 0.06, duration: 0.6, ease: "power3.out" });
      });
      return () => mm.revert();
    },
    { scope: pageRef },
  );

  // after removing, clear the animation styles before the screen is painted
  useGSAP(
    () => {
      if (!needsCleanup.current) return;
      gsap.set(".cart-item", { clearProps: "all" });
      needsCleanup.current = false;
    },
    { scope: pageRef, dependencies: [cart.length] },
  );

  // the total "counts" from the old value to the new one
  useGSAP(
    () => {
      const el = totalRef.current;
      if (!el) return;
      const counter = { value: previousTotal.current };
      gsap.to(counter, {
        value: total,
        duration: prefersReducedMotion() ? 0 : 0.8,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = `US$ ${counter.value.toFixed(2)}`;
        },
      });
      previousTotal.current = total;
    },
    { dependencies: [total] },
  );

  function handleRemove(index: number, item: HTMLElement) {
    if (item.dataset.leaving) return; // avoid double clicks during the animation
    if (prefersReducedMotion()) {
      removeFromCart(index);
      return;
    }
    item.dataset.leaving = "true";
    gsap.to(item, {
      x: -80,
      opacity: 0,
      height: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: 0.45,
      ease: "power3.in",
      onComplete: () => {
        delete item.dataset.leaving;
        needsCleanup.current = true;
        removeFromCart(index);
      },
    });
  }

  return (
    <div className="cart" ref={pageRef}>
      <Link to="/" className="back-link">
        ← Back to store
      </Link>

      <h2>Cart</h2>

      {cart.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <ul className="cart-list">
          {cart.map((p, i) => (
            <li key={i} className="cart-item">
              <img src={p.thumbnail} alt={p.title} />
              <span className="cart-item-name">{p.title}</span>
              <span className="cart-item-price">US$ {p.price}</span>
              <button
                className="button-remove"
                onClick={(e) => handleRemove(i, e.currentTarget.closest("li")!)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="cart-total">
        <span>Total</span>
        <strong ref={totalRef} />
      </div>
    </div>
  );
}
