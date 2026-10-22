import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { TransitionLink } from "../components/TransitionLink";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../context/CartContext";
import { gsap, useGSAP, NO_REDUCED_MOTION } from "../animations/gsap";
import { useTilt3D } from "../animations/useTilt3D";
import { useMagnetic } from "../animations/useMagnetic";
import { flyToCart } from "../animations/flyToCart";
import { formatPrice } from "../utils/format";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import { FloatingCoin } from "../components/Coin";
import { FREE_SHIPPING_FROM, INSTALLMENTS, installmentPrice, originalPrice } from "../utils/pricing";

export function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { addToCart } = useCart();
  const { addViewed } = useRecentlyViewed();

  // every product that is opened goes to the "Recently viewed" list
  useEffect(() => {
    if (!product) return;
    addViewed(product);
  }, [product, addViewed]);

  // hooks always at the top, BEFORE the "if" statements that return
  const pageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const showcaseRef = useTilt3D<HTMLDivElement>(10, [product?.id]);
  const buttonRef = useMagnetic<HTMLButtonElement>(0.3, [product?.id]);

  // intro: the image spins into place in 3D and the details rise in sequence
  useGSAP(
    () => {
      if (!product) return;
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        gsap.set(".detail-image img", { z: 60 });
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(".detail-image img", { opacity: 0, scale: 0.6, rotationY: -50, duration: 1.6 })
          .from(".detail-info > *", { opacity: 0, y: 30, stagger: 0.07, duration: 0.9, ease: "power3.out" }, "-=1.3");

        // floating gently, like a product on display
        gsap.to(".detail-image img", { y: -14, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.2 });
      });
      return () => mm.revert();
    },
    { scope: pageRef, dependencies: [product?.id] },
  );

  if (loading) return <p className="message">Loading...</p>;
  if (error) return <p className="message">Error: {error}</p>;
  if (!product) return <p className="message">Product not found</p>;

  const discount = Math.round(product.discountPercentage);

  function handleAdd() {
    if (!product) return;
    addToCart(product);
    flyToCart(imageRef.current);
  }

  return (
    <div className="detail-page" ref={pageRef}>
      <TransitionLink to="/" className="back-link">
        <span className="back-link-arrow" aria-hidden="true">←</span> Back to store
      </TransitionLink>

      <div className="detail-grid">
        <div className="detail-image" ref={showcaseRef}>
          <span className="card-glow" aria-hidden="true" />
          <img ref={imageRef} src={product.thumbnail} alt={product.title} />
          {/* key: a new product = a new coin, so the fall plays again */}
          <FloatingCoin key={product.id} />
        </div>

        <div className="detail-info">
          <span className="category">{product.category}</span>
          <h2>{product.title}</h2>
          <div className="detail-pricing">
            {discount > 0 && (
              <span className="price-old">{formatPrice(originalPrice(product.price, product.discountPercentage))}</span>
            )}
            <p className="price">{formatPrice(product.price)}</p>
            {discount > 0 && <span className="discount-badge">-{discount}%</span>}
          </div>
          <p className="installments">
            or {INSTALLMENTS}x {formatPrice(installmentPrice(product.price))} interest-free
          </p>
          {product.price >= FREE_SHIPPING_FROM && <span className="free-shipping">Free shipping</span>}

          <p className="description">{product.description}</p>

          <ul className="specs">
            {product.brand && (
              <li>
                <span>Brand</span>
                <span>{product.brand}</span>
              </li>
            )}
            <li>
              <span>Rating</span>
              <span>★ {product.rating} / 5</span>
            </li>
            <li>
              <span>Availability</span>
              <span>{product.stock === 0 ? "Sold out" : `${product.stock} in stock`}</span>
            </li>
            {product.shippingInformation && (
              <li>
                <span>Shipping</span>
                <span>{product.shippingInformation}</span>
              </li>
            )}
            {product.warrantyInformation && (
              <li>
                <span>Warranty</span>
                <span>{product.warrantyInformation}</span>
              </li>
            )}
          </ul>

          <button className="button" ref={buttonRef} onClick={handleAdd}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
