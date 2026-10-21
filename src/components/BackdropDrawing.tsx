import { useRef } from "react";
import { gsap, useGSAP, NO_REDUCED_MOTION } from "../animations/gsap";

type BackdropDrawingProps = {
  children: React.ReactNode; // the shapes (<path>, <circle>) of a 24x24 icon
  className: string; // positions the drawing (see "Backdrop drawings" in index.css)
  drawOn: "scroll" | "load";
};

// A big line drawing behind the content, drawn stroke by stroke (DrawSVG plugin).
// "scroll": tied to the scroll, scrolling back up "erases" it. "load": draws once when the page opens.
// With "reduce motion" on, it simply shows up already drawn.
export function BackdropDrawing({ children, className, drawOn }: BackdropDrawingProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        const shapes = gsap.utils.toArray<SVGElement>("path, circle", ref.current);
        const timeline =
          drawOn === "scroll"
            ? // end "+=700" = everything is drawn in the first 700px of scroll (bigger = slower)
              gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: { trigger: ref.current, start: "top 75%", end: "+=700", scrub: 0.5 },
              })
            : gsap.timeline({ defaults: { ease: "power2.out" }, delay: 0.3 }); // right after the page intro starts

        // drawSVG: 0 = nothing of the stroke is visible; "from" grows it back to 100%, one shape after another.
        // duration = time of each stroke, stagger = gap between strokes (on scroll only the proportion matters)
        timeline.from(shapes, { drawSVG: 0, duration: 0.45, stagger: 0.25 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div className={`backdrop ${className}`} ref={ref} aria-hidden="true">
      <svg viewBox="0 0 24 24">{children}</svg>
    </div>
  );
}

// the icons below come from lucide.dev (same family as the cursor)

export function BackdropCart() {
  return (
    <BackdropDrawing className="backdrop-cart" drawOn="scroll">
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
    </BackdropDrawing>
  );
}

export function BackdropHandCoin() {
  return (
    <BackdropDrawing className="backdrop-hand" drawOn="load">
      <path d="m2 16 6 6" />
      <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
      <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
      <circle cx="16" cy="9" r="2.9" />
    </BackdropDrawing>
  );
}

export function BackdropReceipt() {
  return (
    <BackdropDrawing className="backdrop-receipt" drawOn="load">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5v-11" />
    </BackdropDrawing>
  );
}
