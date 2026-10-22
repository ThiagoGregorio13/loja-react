import { useId, useRef } from "react";
import { gsap, useGSAP, NO_REDUCED_MOTION } from "../animations/gsap";

type BackdropDrawingProps = {
  children: React.ReactNode; // the shapes (<path>, <circle>) of a 24x24 icon
  className: string; // positions the drawing (see "Backdrop drawings" in index.css)
  drawOn: "scroll" | "load";
  colors: string[]; // the line goes from the first color (top left) to the last (bottom right)
};

// A big line drawing behind the content, drawn stroke by stroke (DrawSVG plugin).
// "scroll": tied to the scroll, scrolling back up "erases" it. "load": draws once when the page opens.
// With "reduce motion" on, it simply shows up already drawn.
export function BackdropDrawing({ children, className, drawOn, colors }: BackdropDrawingProps) {
  const ref = useRef<HTMLDivElement>(null);
  // each drawing needs its OWN gradient id (there can be several on the page).
  // useId creates a unique one; we keep only letters/numbers so it is safe inside url(#...)
  const gradientId = "stroke-" + useId().replace(/[^a-zA-Z0-9]/g, "");

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
      <svg viewBox="0 0 24 24" stroke={`url(#${gradientId})`}>
        <defs>
          {/* userSpaceOnUse: ONE gradient across the whole drawing (otherwise each shape gets its own) */}
          <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24">
            {colors.map((color, i) => (
              <stop key={color} offset={i / Math.max(colors.length - 1, 1)} stopColor={color} />
            ))}
          </linearGradient>
        </defs>
        {children}
      </svg>
    </div>
  );
}

// the icons below come from lucide.dev (same family as the cursor)

export function BackdropCart() {
  return (
    <BackdropDrawing className="backdrop-cart" drawOn="scroll" colors={["#7c3aed", "#ec4899", "#f97316"]}>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
    </BackdropDrawing>
  );
}
