import { useRef, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { StoreSummary } from "../components/StoreSummary";
import { Filters } from "../components/Filters";
import { Hero } from "../components/Hero";
import { BackdropCart } from "../components/BackdropDrawing";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";
import { gsap, useGSAP, ScrollTrigger, NO_REDUCED_MOTION } from "../animations/gsap";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";

export function Store() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [topRated, setTopRated] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const { viewed } = useRecentlyViewed();

  const { categories } = useCategories();
  const { products, loading, error } = useProducts(category);

  const filtered = products
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => !topRated || p.rating >= 4.5);

  const visible = filtered.slice(0, 20);
  const count = filtered.length;
  const averagePrice = count === 0 ? 0 : filtered.reduce((acc, p) => acc + p.price, 0) / count;

  // the cards appear as they enter the screen while scrolling
  const visibleIds = visible.map((p) => p.id).join(",");
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".card");
        if (cards.length === 0) return;
        gsap.set(cards, { opacity: 0, y: 70 });
        ScrollTrigger.batch(cards, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, overwrite: "auto" }),
        });
      });
      return () => mm.revert();
    },
    { scope: pageRef, dependencies: [visibleIds], revertOnUpdate: true },
  );

  return (
    <div ref={pageRef}>
      <Hero />

      {viewed.length > 0 && (
        <section className="recently-viewed">
          <h2>Recently viewed</h2>
          <ul className="product-grid">
            {viewed.map((p) => (
<ProductCard key={p.id} product={p}/>
))}
          </ul>
        </section>
      )}

      <Filters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
        topRated={topRated}
        onTopRatedChange={setTopRated}
      />

      <StoreSummary showing={visible.length} total={count} averagePrice={averagePrice} />

      {loading && <p className="message">Loading...</p>}
      {error && <p className="message">Error: {error}</p>}

      {!loading && !error && (
        <div className="catalog">
          <BackdropCart />
          <ul className="product-grid">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
