import { useRef } from "react";
import { gsap, useGSAP, NO_REDUCED_MOTION } from "../animations/gsap";

type CoinProps = {
  className: string; // the color ("coin-gold" / "coin-green") + where it goes on the page
};

// A coin with two faces. Each face hides when it is facing away
// (backface-visibility), so when the coin turns in 3D we see the front, then the back.
export function Coin({ className }: CoinProps) {
  return (
    <div className={`coin ${className}`} aria-hidden="true">
      <span className="coin-face">$</span>
      <span className="coin-face coin-back">$</span>
    </div>
  );
}

// Product page: a big green coin popping out of the corner of the photo.
// It falls bouncing, then floats and flips from time to time.
export function FloatingCoin() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        // three elements, three animations, so they don't fight over the same property:
        // .coin falls and flips (y, rotationY), .floating-coin-bob floats (y)
        gsap.from(".coin", { y: -260, scale: 0.3, rotationY: -720, duration: 1.4, ease: "bounce.out", delay: 0.4 });
        gsap.to(".coin", {
          rotationY: "+=360",
          duration: 1.1,
          ease: "power2.inOut",
          repeat: -1,
          repeatDelay: 2.4,
          delay: 2.6, // only after the fall
        });
        gsap.to(".floating-coin-bob", { y: -14, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div className="floating-coin" ref={ref} aria-hidden="true">
      <span className="sparkle" />
      <span className="sparkle" />
      <span className="sparkle" />
      <div className="floating-coin-bob">
        <Coin className="coin-green" />
      </div>
    </div>
  );
}
