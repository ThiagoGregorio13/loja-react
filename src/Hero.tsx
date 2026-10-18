import { useRef } from "react";
import { Link } from "react-router";
import { gsap, useGSAP, SplitText, Draggable, NO_REDUCED_MOTION, prefersReducedMotion } from "./animations/gsap";
import { useProducts } from "./hooks/useProducts";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const wasDragged = useRef(false);

  const { products } = useProducts("smartphones");
  const featured = products.slice(0, 10);

  // 1) Intro: the title rises letter by letter; on scroll, the hero moves away
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        const title = SplitText.create(titleRef.current, { type: "words,chars", mask: "words" });

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
        gsap.to(".hero-stage", { y: 140, rotationX: 30, scale: 0.85, ease: "none", scrollTrigger: onScroll });
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

  // 2) 3D ring: spins on its own and can be dragged, with inertia (physics)
  useGSAP(
    () => {
      const ring = ringRef.current;
      const scene = sceneRef.current;
      if (!ring || !scene || featured.length === 0) return;

      const items = gsap.utils.toArray<HTMLElement>(".ring-item", ring);
      const step = 360 / items.length;
      const radius = Math.round(85 / Math.tan(Math.PI / items.length)) + 60;
      items.forEach((item, i) => {
        item.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`;
      });

      const reduced = prefersReducedMotion();
      const spin = () => gsap.to(ring, { rotationY: "-=360", duration: 45, ease: "none", repeat: -1 });
      let spinning = reduced ? null : spin();
      const resume = () => {
        if (reduced) return;
        spinning?.kill();
        spinning = spin();
      };

      let startRotation = 0;
      let startX = 0;
      const followDrag = () => {
        gsap.set(ring, { rotationY: startRotation + (drag.x - startX) * 0.35 });
      };

      const [drag] = Draggable.create(document.createElement("div"), {
        type: "x",
        trigger: scene,
        inertia: true,
        dragClickables: true,
        onPress() {
          spinning?.pause();
          wasDragged.current = false;
          startRotation = Number(gsap.getProperty(ring, "rotationY"));
          startX = drag.x;
        },
        onDragStart() {
          wasDragged.current = true;
        },
        onDrag: followDrag,
        onThrowUpdate: followDrag,
        onThrowComplete: resume,
        onRelease() {
          if (!drag.isThrowing) resume();
        },
      });

      return () => {
        drag.kill();
        spinning?.kill();
      };
    },
    { scope: heroRef, dependencies: [featured.length] },
  );

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-text">
        <span className="eyebrow">AXON</span>
        <h1 ref={titleRef}>Made to matter.</h1>
        <p>A curated selection of products chosen for quality. Nothing but the essentials.</p>
      </div>

      <div className="hero-stage">
        <div className="ring-scene" ref={sceneRef}>
          <div className="ring" ref={ringRef}>
            {featured.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="ring-item"
                draggable={false}
                onClick={(e) => {
                  // if it was a drag, don't open the product
                  if (wasDragged.current) e.preventDefault();
                }}
              >
                <img src={p.thumbnail} alt={p.title} draggable={false} />
              </Link>
            ))}
          </div>
        </div>
        <p className="ring-hint">← Drag to spin →</p>
      </div>
    </section>
  );
}
