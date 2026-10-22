import { lazy, Suspense, useRef } from "react";
import { gsap, useGSAP, SplitText, NO_REDUCED_MOTION } from "../animations/gsap";
import { useTransitionNavigate } from "../animations/useTransitionNavigate";
import { useProducts } from "../hooks/useProducts";

// Three.js is heavy: this import only happens when the Hero renders
const HeroScene = lazy(() => import("./HeroScene"));

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const navigate = useTransitionNavigate();

  const { products } = useProducts("smartphones");
  const featured = products.slice(0, 10);

  // Intro: the title rises letter by letter; on scroll, the text moves away (the ring stays still)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        const title = SplitText.create(titleRef.current, { type: "words,chars", mask: "words" });

        // each letter gets one color of the gradient: violet → pink → orange.
        // interpolate(array) returns a function: 0 = first color, 1 = last, 0.5 = the one in the middle
        const paint = gsap.utils.interpolate(["#a78bfa", "#f472b6", "#fb923c"]);
        title.chars.forEach((char, i) => {
          (char as HTMLElement).style.color = paint(i / (title.chars.length - 1));
        });

        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(title.chars, {
            yPercent: 110,
            rotationX: -70,
            transformPerspective: 400,
            opacity: 0,
            duration: 1.1,
            stagger: 0.03,
          })
          .from(".hero-text .eyebrow, .hero-text p", { y: 24, opacity: 0, duration: 0.9, stagger: 0.1 }, "-=0.7")
          .from(".ring-scene", { opacity: 0, scale: 0.8, y: 80, duration: 1.6, ease: "expo.out" }, "-=0.9");

        const onScroll = { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero-text", { yPercent: -40, opacity: 0, ease: "none", scrollTrigger: onScroll });
        // the hint fades out as soon as the user scrolls (or, on short screens,
        // as soon as it has fully entered the screen) and only vanishes when the hero leaves the screen
        gsap.to(".ring-hint", {
          opacity: 0,
          y: -10,
          ease: "none",
          scrollTrigger: {
            trigger: ".ring-hint",
            start: "clamp(bottom bottom)", // clamp: never before scroll 0
            endTrigger: heroRef.current, // the END is measured by the hero, not by the hint
            end: "bottom top", // = when the bottom of the hero reaches the top of the screen
            scrub: 1, // takes 1s to "catch up" with the scroll: smooths out wheel jumps
          },
        });

        return () => title.revert();
      });
      return () => mm.revert();
    },
    { scope: heroRef },
  );

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-text">
        <span className="eyebrow">New season · up to 25% off</span>
        <h1 ref={titleRef}>Made to matter.</h1>
        <p>A curated selection of products chosen for quality. Nothing but the essentials.</p>
      </div>

      <div className="hero-stage">
        <div className="ring-scene">
          {featured.length > 0 && (
            <Suspense fallback={null}>
              <HeroScene products={featured} onOpen={(id) => navigate(`/product/${id}`)} />
            </Suspense>
          )}
        </div>
        <p className="ring-hint">← Drag to spin →</p>
      </div>
    </section>
  );
}
