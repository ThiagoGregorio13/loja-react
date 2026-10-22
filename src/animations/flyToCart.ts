import { gsap, prefersReducedMotion } from "./gsap";

// A copy of the product image "flies" in an arc to the cart counter.
// When it lands, the counter bounces and releases particles with gravity.
export function flyToCart(source: HTMLImageElement | null) {
  const target = document.querySelector<HTMLElement>("[data-cart-target]");
  if (!target) return;

  if (!source || prefersReducedMotion()) {
    bounceCounter(target);
    return;
  }

  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();

  const flyer = source.cloneNode() as HTMLImageElement;
  flyer.removeAttribute("style"); // don't inherit the original image's animations
  flyer.className = "flyer";
  Object.assign(flyer.style, {
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
  });
  document.body.appendChild(flyer);

  // distance between the center of the image and the center of the counter
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);

  gsap.to(flyer, {
    duration: 0.9,
    ease: "power2.inOut",
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: dx * 0.4, y: Math.min(dy, 0) - 160 }, // top of the arc
        { x: dx, y: dy },
      ],
      curviness: 1.4,
    },
    scale: 0.1,
    rotation: 30,
    onComplete() {
      flyer.remove();
      bounceCounter(target);
      releaseParticles(target.getBoundingClientRect());
    },
  });
}

function bounceCounter(target: HTMLElement) {
  gsap.fromTo(
    target,
    { scale: 1.8 },
    { scale: 1, duration: 0.9, ease: "elastic.out(1, 0.35)", overwrite: true },
  );
}

// Real physics: each particle starts with a random velocity and angle,
// and gravity pulls it down.
function releaseParticles(r: DOMRect) {
  const colors = ["#7c3aed", "#ec4899", "#f97316", "#facc15"];

  for (let i = 0; i < 16; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.style.left = `${r.left + r.width / 2}px`;
    p.style.top = `${r.top + r.height / 2}px`;
    p.style.background = colors[i % colors.length];
    document.body.appendChild(p);

    gsap.to(p, {
      duration: gsap.utils.random(0.8, 1.4),
      physics2D: {
        velocity: gsap.utils.random(140, 320),
        angle: gsap.utils.random(180, 360), // from "left" to "right", going over the top
        gravity: 800,
      },
      opacity: 0,
      scale: gsap.utils.random(0.4, 1.1),
      ease: "none",
      onComplete: () => p.remove(),
    });
  }
}
