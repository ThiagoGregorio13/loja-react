import { useRef } from "react";
import type { Product } from "../types";
import { TransitionLink } from "./TransitionLink";
import { useCart } from "../context/CartContext";
import { useTilt3D } from "../animations/useTilt3D";
import { flyToCart } from "../animations/flyToCart";
import { formatPrice } from "../utils/format";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const cardRef = useTilt3D<HTMLLIElement>(8);
  const imageRef = useRef<HTMLImageElement>(null);

  function handleAdd() {
    addToCart(product);
    flyToCart(imageRef.current);
  }

  return (
    <li className="card" ref={cardRef}>
      <span className="card-glow" aria-hidden="true" />

      <TransitionLink to={`/product/${product.id}`} className="card-image" data-cursor="View">
        <img ref={imageRef} src={product.thumbnail} alt={product.title} />
      </TransitionLink>

      <div className="card-body">
        <span className="category">{product.category}</span>
        <TransitionLink to={`/product/${product.id}`}>
          <h3 className="card-title">{product.title}</h3>
        </TransitionLink>

        <div className="card-info">
          <span>Rating {product.rating}</span>
          {product.stock === 0 ? (
            <span className="sold-out">Sold out</span>
          ) : (
            <span>{product.stock} in stock</span>
          )}
        </div>

        <div className="card-footer">
          <p className="price">{formatPrice(product.price)}</p>
          <button className="button" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    </li>
  );
}
