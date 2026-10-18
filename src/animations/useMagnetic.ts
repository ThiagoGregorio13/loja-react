import { useRef } from "react";
import { gsap, useGSAP, NO_REDUCED_MOTION } from "./gsap";

// The element is "pulled" toward the cursor when the mouse is over it.
export function useMagnetic<T extends HTMLElement>(strength = 0.35, dependencies: unknown[] = []) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(`(hover: hover) and ${NO_REDUCED_MOTION}`, () => {
        const moveX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
        const moveY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          moveX((e.clientX - (r.left + r.width / 2)) * strength);
          moveY((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const onLeave = () => {
          moveX(0);
          moveY(0);
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
