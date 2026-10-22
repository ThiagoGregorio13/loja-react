// Two "ad" bands from edge to edge, crossing each other in an X, sliding in opposite directions.
// The text is written twice in a row: when the first copy has slid out completely (-50%),
// the animation restarts, and since the second copy is identical, no one sees the jump.

// brands that really exist in the catalog (DummyJSON)
const BRANDS = ["Apple", "Samsung", "Rolex", "Nike", "Gucci", "Prada", "Calvin Klein", "Puma", "Huawei", "Lenovo", "Longines", "Oppo"];
const PERKS = ["Free shipping over $100", "10x interest-free", "30-day returns", "Secure checkout", "New drops every week"];

type BandProps = {
  items: string[];
  className: string;
};

function Band({ items, className }: BandProps) {
  return (
    <div className={`marquee-band ${className}`}>
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          // the second copy is only decoration: screen readers read the list once
          <span key={i} aria-hidden={i >= items.length}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BrandMarquee() {
  return (
    <section className="marquee" aria-label="Brands we work with">
      <Band items={PERKS} className="marquee-band-dark" />
      <Band items={BRANDS} className="marquee-band-bright" />
    </section>
  );
}
