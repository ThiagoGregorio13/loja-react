import { useRef } from "react";
import { TransitionLink } from "../components/TransitionLink";
import { Receipt } from "../components/Receipt";
import { useCart } from "../context/CartContext";
import {
  gsap,
  useGSAP,
  NO_REDUCED_MOTION,
  prefersReducedMotion,
} from "../animations/gsap";
import { formatPrice } from "../utils/format";

export function Cart() {
  const { cart, removeFromCart, cartTotal: total } = useCart();

  const pageRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLElement>(null);
  const previousTotal = useRef(total);

  // intro: the items slide in one after another
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        gsap.from(".cart-item", {
          opacity: 0,
          x: -30,
          stagger: 0.06,
          duration: 0.6,
          ease: "power3.out",
        });
      });
      return () => mm.revert();
    },
    { scope: pageRef },
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
          el.textContent = `${formatPrice(counter.value)}`;
        },
      });
      previousTotal.current = total;
    },
    { dependencies: [total] },
  );

  function handleRemove(cartId: string, item: HTMLElement) {
    if (item.dataset.leaving) return; // avoid double clicks during the animation
    if (prefersReducedMotion()) {
      removeFromCart(cartId);
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
        removeFromCart(cartId);
      },
    });
  }

  return (
    <div className="cart" ref={pageRef}>
      <Receipt total={total} count={cart.length} />
      <TransitionLink to="/" className="back-link">
        <span className="back-link-arrow" aria-hidden="true">
          ←
        </span>{" "}
        Back to store
      </TransitionLink>

      <h2>Cart</h2>

      {cart.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <ul className="cart-list">
          {cart.map((p) => (
            <li key={p.cartId} className="cart-item">
              {/* the photo and the name go back to the product page */}
              <TransitionLink to={`/product/${p.id}`} className="cart-item-image" data-cursor="View">
                <img src={p.thumbnail} alt={p.title} />
              </TransitionLink>
              <TransitionLink to={`/product/${p.id}`} className="cart-item-name">
                {p.title}
              </TransitionLink>
              <span className="cart-item-price">{formatPrice(p.price)}</span>
              <button
                className="button-remove"
                onClick={(e) => handleRemove(p.cartId, e.currentTarget.closest("li")!)}
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
