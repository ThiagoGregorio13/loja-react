// The 3D ring of the hero, drawn with WebGL (Three.js + React Three Fiber).
// This file is loaded with React.lazy(), so Three.js only downloads
// when the hero appears — the rest of the store does not wait for it.
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { Product } from "../types";
import { setCursorLabel } from "../animations/cursor";
import { prefersReducedMotion } from "../animations/gsap";

type HeroSceneProps = {
  products: Product[];
  onOpen: (id: number) => void;
};

const CARD = 1.3; // card size, in 3D units
const GAP = 0.4;
const AUTO_SPIN = 0.12; // radians per second

export default function HeroScene({ products, onOpen }: HeroSceneProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);

  // stop drawing frames when the hero is out of the screen (saves battery/GPU)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(wrapperRef.current!);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hero-canvas" ref={wrapperRef} data-cursor="Drag">
      <Canvas
        frameloop={onScreen ? "always" : "never"}
        camera={{ position: [0, 1.3, 7], fov: 35 }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)} // looks at the ring from slightly above
        flat // no tone mapping: white stays really white (Apple-like)
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.6} />
        <directionalLight position={[3, 5, 6]} intensity={1.8} />
        <Suspense fallback={null}>
          <Ring products={products} onOpen={onOpen} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Ring({ products, onOpen }: HeroSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const gl = useThree((state) => state.gl);
  const radius = ((CARD + GAP) * products.length) / (2 * Math.PI);

  // drag with inertia: while dragging, the ring follows the finger/mouse;
  // on release, it keeps the speed and slows down little by little
  const drag = useRef({ active: false, lastX: 0, velocity: 0, moved: 0 });
  useEffect(() => {
    const canvas = gl.domElement;
    const onDown = (e: PointerEvent) => {
      drag.current = { active: true, lastX: e.clientX, velocity: 0, moved: 0 };
    };
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active) return;
      const dx = e.clientX - d.lastX;
      d.lastX = e.clientX;
      d.moved += Math.abs(dx);
      d.velocity = dx * 0.005;
      groupRef.current!.rotation.y += d.velocity;
    };
    const onUp = () => {
      drag.current.active = false;
    };
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [gl]);

  const reduced = prefersReducedMotion();

  // runs on EVERY frame (~60x per second). delta = seconds since the last frame
  useFrame((state, delta) => {
    // the narrower the screen, the further back the camera goes, so the whole ring fits
    const distance = THREE.MathUtils.clamp(6.2 / (0.63 * state.viewport.aspect), 6.5, 10);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, distance, 0.1);

    const d = drag.current;
    if (!d.active) {
      groupRef.current!.rotation.y += d.velocity + (reduced ? 0 : AUTO_SPIN * delta);
      d.velocity *= 0.94; // friction
    }
    if (!reduced) {
      // the whole ring leans a little towards the mouse
      const tilt = tiltRef.current!;
      tilt.rotation.x = THREE.MathUtils.lerp(tilt.rotation.x, -state.pointer.y * 0.12 + 0.08, 0.05);
      tilt.rotation.z = THREE.MathUtils.lerp(tilt.rotation.z, state.pointer.x * 0.06, 0.05);
    }
  });

  return (
    <group ref={tiltRef} position={[0, 0.35, 0]}>
      <group ref={groupRef}>
        {products.map((p, i) => (
          <Card
            key={p.id}
            product={p}
            angle={(i / products.length) * Math.PI * 2}
            radius={radius}
            onOpen={() => {
              if (drag.current.moved < 6) onOpen(p.id); // it was a click, not a drag
            }}
          />
        ))}
      </group>
    </group>
  );
}

type CardProps = {
  product: Product;
  angle: number;
  radius: number;
  onOpen: () => void;
};

function Card({ product, angle, radius, onOpen }: CardProps) {
  const ref = useRef<THREE.Group>(null);
  const imageRef = useRef<THREE.Mesh>(null);
  const boxMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const [worldPosition] = useState(() => new THREE.Vector3()); // created once, reused every frame

  useFrame(() => {
    const card = ref.current!;
    // grows smoothly when hovered
    const target = hovered ? 1.12 : 1;
    card.scale.setScalar(THREE.MathUtils.lerp(card.scale.x, target, 0.12));

    // cards at the back of the ring get darker: gives depth
    card.getWorldPosition(worldPosition);
    const light = THREE.MathUtils.mapLinear(worldPosition.z, -radius, radius, 0.25, 1);
    boxMaterialRef.current!.color.setScalar(light);
    const imageMaterial = imageRef.current?.material as THREE.ShaderMaterial & { color: THREE.Color };
    imageMaterial?.color?.setScalar(light);
  });

  return (
    <group
      ref={ref}
      position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
      rotation={[0, angle, 0]}
      onPointerOver={(e) => {
        e.stopPropagation(); // only the card in front reacts
        setHovered(true);
        setCursorLabel("View");
      }}
      onPointerOut={() => {
        setHovered(false);
        setCursorLabel(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
    >
      <RoundedBox args={[CARD, CARD, 0.06]} radius={0.03} smoothness={4}>
        <meshStandardMaterial ref={boxMaterialRef} color="#ffffff" roughness={0.6} />
      </RoundedBox>
      <Image
        ref={imageRef}
        url={product.thumbnail}
        scale={CARD * 0.82}
        position={[0, 0, 0.035]}
        transparent
        toneMapped={false}
      />
    </group>
  );
}
