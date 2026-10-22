import { useRef } from "react";
import type { Product } from "../types";
import { TransitionLink } from "./TransitionLink";
import { useCart } from "../context/CartContext";
import { useTilt3D } from "../animations/useTilt3D";
import { flyToCart } from "../animations/flyToCart";
import { formatPrice } from "../utils/format";
import { FREE_SHIPPING_FROM, INSTALLMENTS, installmentPrice, originalPrice } from "../utils/pricing";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const cardRef = useTilt3D<HTMLLIElement>(8);
  const imageRef = useRef<HTMLImageElement>(null);

  const discount = Math.round(product.discountPercentage);

  function handleAdd() {
    addToCart(product);
    flyToCart(imageRef.current);
  }

  return (
    <li className="card" ref={cardRef}>
      <span className="card-glow" aria-hidden="true" />
      {discount > 0 && <span className="discount-badge">-{discount}%</span>}

      <TransitionLink to={`/product/${product.id}`} className="card-image" data-cursor="View">
        <img ref={imageRef} src={product.thumbnail} alt={product.title} />
      </TransitionLink>

      <div className="card-body">
        <span className="category">{product.category}</span>
        <TransitionLink to={`/product/${product.id}`}>
          <h3 className="card-title">{product.title}</h3>
        </TransitionLink>

        <div className="card-info">
          <span className="rating">★ {product.rating.toFixed(1)}</span>
          {product.stock === 0 ? (
            <span className="sold-out">Sold out</span>
          ) : (
            <span>{product.stock} in stock</span>
          )}
        </div>

        {product.price >= FREE_SHIPPING_FROM && <span className="free-shipping">Free shipping</span>}

        <div className="card-footer">
          <div className="card-pricing">
            {discount > 0 && (
              <span className="price-old">{formatPrice(originalPrice(product.price, product.discountPercentage))}</span>
            )}
            <p className="price">{formatPrice(product.price)}</p>
            <span className="installments">
              or {INSTALLMENTS}x {formatPrice(installmentPrice(product.price))}
            </span>
          </div>
          <button className="button" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    </li>
  );
}
