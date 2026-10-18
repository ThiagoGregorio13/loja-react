import { useRef } from "react";
import { gsap, useGSAP, NO_REDUCED_MOTION } from "./gsap";

// Tilts the element in 3D following the mouse.
// Also updates the CSS variables --mx and --my (mouse position) for the glow.
export function useTilt3D<T extends HTMLElement>(intensity = 10, dependencies: unknown[] = []) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      // only on screens with a mouse (phones have no "hover")
      mm.add(`(hover: hover) and ${NO_REDUCED_MOTION}`, () => {
        gsap.set(el, { transformPerspective: 900 });
        const rotateX = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
        const rotateY = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width; // 0 (left) to 1 (right)
          const py = (e.clientY - r.top) / r.height; // 0 (top) to 1 (bottom)
          rotateY((px - 0.5) * intensity * 2);
          rotateX((0.5 - py) * intensity * 2);
          el.style.setProperty("--mx", `${px * 100}%`);
          el.style.setProperty("--my", `${py * 100}%`);
        };
        const onLeave = () => {
          rotateX(0);
          rotateY(0);
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies, revertOnUpdate: true },
  );

  return ref;
}
