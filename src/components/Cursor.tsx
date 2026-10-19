import { useRef, useState } from "react";
import { gsap, useGSAP } from "../animations/gsap";
import { onCursorLabel } from "../animations/cursor";

// Only for real mice: on phones and tablets there is no cursor to replace.
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(FINE_POINTER, () => {
      document.documentElement.classList.add("has-custom-cursor");

      // quickTo = a reusable tween: much cheaper than creating a gsap.to() on every mouse move
      const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.15, ease: "power3" });
      const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.15, ease: "power3" });
      const bubbleX = gsap.quickTo(bubbleRef.current, "x", { duration: 0.5, ease: "power3" });
      const bubbleY = gsap.quickTo(bubbleRef.current, "y", { duration: 0.5, ease: "power3" });

      let labelFromDom: string | null = null;
      let labelFromEvent: string | null = null;
      const update = () => setLabel(labelFromEvent ?? labelFromDom);

      const onMove = (e: PointerEvent) => {
        dotX(e.clientX);
        dotY(e.clientY);
        bubbleX(e.clientX);
        bubbleY(e.clientY);
      };

      // any element with data-cursor="View" shows that label when hovered
      const onOver = (e: PointerEvent) => {
        const target = (e.target as Element).closest<HTMLElement>("[data-cursor]");
        labelFromDom = target?.dataset.cursor ?? null;
        update();
        const clickable = (e.target as Element).closest("a, button, select, label");
        dotRef.current?.classList.toggle("is-hovering", Boolean(clickable));
      };

      const onLeaveWindow = () => gsap.to([dotRef.current, bubbleRef.current], { autoAlpha: 0, duration: 0.2 });
      const onEnterWindow = () => gsap.to(dotRef.current, { autoAlpha: 1, duration: 0.2 });

      const stopListening = onCursorLabel((value) => {
        labelFromEvent = value;
        update();
      });

      window.addEventListener("pointermove", onMove);
      document.addEventListener("pointerover", onOver);
      document.documentElement.addEventListener("pointerleave", onLeaveWindow);
      document.documentElement.addEventListener("pointerenter", onEnterWindow);

      return () => {
        document.documentElement.classList.remove("has-custom-cursor");
        stopListening();
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
        document.documentElement.removeEventListener("pointerenter", onEnterWindow);
      };
    });
    return () => mm.revert();
  });

  // when there is a label, the small dot gives way to the bubble
  useGSAP(
    () => {
      gsap.to(bubbleRef.current, { scale: label ? 1 : 0, autoAlpha: label ? 1 : 0, duration: 0.4, ease: "back.out(2)" });
      gsap.to(dotRef.current, { scale: label ? 0 : 1, duration: 0.25 });
    },
    { dependencies: [label] },
  );

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-bubble" ref={bubbleRef} aria-hidden="true">
        {label}
      </div>
    </>
  );
}
