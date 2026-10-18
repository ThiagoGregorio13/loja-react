// Registers GSAP and its plugins ONCE. The rest of the app imports from here.
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  SplitText,
  Draggable,
  InertiaPlugin,
  MotionPathPlugin,
  Physics2DPlugin,
);

// Only animate for people who did NOT ask for "reduce motion" in their system settings.
export const NO_REDUCED_MOTION = "(prefers-reduced-motion: no-preference)";

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, useGSAP, ScrollTrigger, SplitText, Draggable };
