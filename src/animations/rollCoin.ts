import { gsap } from "./gsap";

// Page transition: a coin rolls across the screen from left to right and
// "uncovers" the new page as it goes (the edge of the new page follows the coin).
//
// Rolling = moving + spinning at the same time. In one full turn (360°) a coin
// travels its own circumference (π × diameter). So: degrees = distance / (π × diameter) × 360.
export const ROLL_DURATION = 0.9; // seconds. In index.css, page-out lasts a bit longer (1s)

// only the two promises we use. Typing it as "ViewTransition" broke the build on Netlify:
// the browser types and the React types each have their own ViewTransition, and they don't match
type Transition = {
  ready: Promise<void>;
  finished: Promise<void>;
};

export function rollCoin(transition: Transition) {
  const coin = document.querySelector<HTMLElement>(".page-coin");
  const root = document.documentElement;
  if (!coin) return;

  // --reveal = how many px of the new page are visible (from the left). Starts hidden
  root.style.setProperty("--reveal", "0px");

  transition.ready
    .then(() => {
      const size = coin.offsetWidth;
      const start = -size; // fully out of the screen on the left
      const end = window.innerWidth; // fully out of the screen on the right

      gsap.fromTo(
        coin,
        { x: start, rotation: 0, autoAlpha: 1 },
        {
          x: end,
          rotation: ((end - start) / (Math.PI * size)) * 360,
          duration: ROLL_DURATION,
          ease: "power2.inOut",
          // on every frame, the edge of the new page goes to the center of the coin
          onUpdate: () => {
            const center = (gsap.getProperty(coin, "x") as number) + size / 2;
            root.style.setProperty("--reveal", `${center}px`);
          },
          onComplete: () => {
            gsap.set(coin, { autoAlpha: 0 });
          },
        },
      );
    })
    .catch(() => {}); // the transition was skipped (e.g. two quick clicks): nothing to roll

  transition.finished.finally(() => root.style.removeProperty("--reveal"));
}
