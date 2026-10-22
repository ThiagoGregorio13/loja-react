// "Why shop with us" section, between the hero and the catalog.
// The icons are from lucide.dev (same family as the cursor and the drawings).

const PERKS = [
  {
    title: "Free shipping",
    text: "On every order over $100, to anywhere in the country.",
    icon: (
      <>
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
      </>
    ),
  },
  {
    title: "10x interest-free",
    text: "Split any purchase into 10 payments without paying a cent more.",
    icon: (
      <>
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <path d="M2 10h20" />
      </>
    ),
  },
  {
    title: "30-day returns",
    text: "Changed your mind? Send it back within 30 days, no questions asked.",
    icon: (
      <>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </>
    ),
  },
  {
    title: "Secure checkout",
    text: "Your data is encrypted from the cart to the confirmation.",
    icon: (
      <>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
];

export function Perks() {
  return (
    <section className="perks">
      <h2>
        Why shop with <span className="gradient-text">AXON</span>
      </h2>
      <ul className="perks-grid">
        {PERKS.map((perk) => (
          <li key={perk.title} className="perk">
            <span className="perk-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">{perk.icon}</svg>
            </span>
            <h3>{perk.title}</h3>
            <p>{perk.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
