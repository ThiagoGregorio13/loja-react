// The 3D ring of the hero, drawn with WebGL (Three.js + React Three Fiber).
// This file is loaded with React.lazy(), so Three.js only downloads
// when the hero appears — the rest of the store does not wait for it.
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image, Text } from "@react-three/drei";
import * as THREE from "three";
import type { Product } from "../types";
import { setCursorLabel } from "../animations/cursor";
import { prefersReducedMotion } from "../animations/gsap";
import { formatPrice } from "../utils/format";

type HeroSceneProps = {
  products: Product[];
  onOpen: (id: number) => void;
};

const CARD = 1.3; // card width, in 3D units
const CARD_HEIGHT = 1.62; // a bit taller than wide: room for the name and price
const CARD_RADIUS = 0.14;
const GAP = 0.4;
const AUTO_SPIN = 0.12; // radians per second

// neutral palette for the cards (graphite body, light photo panel)
const BODY_COLOR = new THREE.Color("#1c1c1e");
const PANEL_COLOR = new THREE.Color("#f2f2f4");

const INSET = 0.08; // space between the card border and its content
const PANEL = CARD - INSET * 2; // the photo panel is square

// a 2D rectangle with round corners, centered on (0, 0)
function roundedRect(width: number, height: number, r: number) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

// geometries are created once and shared by all the cards.
// The body is the rounded shape "extruded" (given thickness), with soft beveled edges
const BODY_GEOMETRY = new THREE.ExtrudeGeometry(roundedRect(CARD, CARD_HEIGHT, CARD_RADIUS), {
  depth: 0.04,
  bevelEnabled: true,
  bevelThickness: 0.01,
  bevelSize: 0.01,
  bevelSegments: 4,
  curveSegments: 16,
}).center(); // front face ends up at z = 0.03
const PANEL_GEOMETRY = new THREE.ShapeGeometry(roundedRect(PANEL, PANEL, CARD_RADIUS - INSET), 16);

export default function HeroScene({ products, onOpen }: HeroSceneProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);

  // stop drawing frames when the hero is out of the screen (saves battery/GPU)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(wrapperRef.current!);
    return () => observer.disconnect();
  }, []);

  // clicking a card changes the page and removes this scene before "onPointerOut" can run,
  // so the "View" label would get stuck on the cursor: clear it when the scene goes away
  useEffect(() => {
    return () => setCursorLabel(null);
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
  const hovering = useRef(false);
  const spin = useRef(AUTO_SPIN);

  // runs on EVERY frame (~60x per second). delta = seconds since the last frame
  useFrame((state, delta) => {
    // the narrower the screen, the further back the camera goes, so the whole ring fits
    const distance = THREE.MathUtils.clamp(6.2 / (0.63 * state.viewport.aspect), 6.5, 10);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, distance, 0.1);

    const d = drag.current;
    // the ring slows to a stop while a card is hovered, so it can be read
    spin.current = THREE.MathUtils.lerp(spin.current, hovering.current ? 0 : AUTO_SPIN, 0.05);
    if (!d.active) {
      groupRef.current!.rotation.y += d.velocity + (reduced ? 0 : spin.current * delta);
      d.velocity *= 0.94; // friction
    }
  });

  // a small fixed tilt, so the ring is seen slightly from above. It does NOT follow the mouse:
  // the ring only spins (by itself, or when dragged)
  return (
    <group position={[0, 0.35, 0]} rotation={[0.08, 0, 0]}>
      <group ref={groupRef}>
        {products.map((p, i) => (
          <Card
            key={p.id}
            product={p}
            angle={(i / products.length) * Math.PI * 2}
            radius={radius}
            onHover={(value) => (hovering.current = value)}
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
  onHover: (hovering: boolean) => void;
  onOpen: () => void;
};

// long names would overflow the card
function shorten(text: string, max = 20) {
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}

function Card({ product, angle, radius, onHover, onOpen }: CardProps) {
  const ref = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const imageRef = useRef<THREE.Mesh>(null);
  const bodyMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const panelMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const [worldPosition] = useState(() => new THREE.Vector3()); // created once, reused every frame
  const time = useRef(0);
  const reduced = prefersReducedMotion();

  useFrame((_, delta) => {
    const body = bodyRef.current!;
    // when hovered, the card grows and slides out of the ring, towards the camera
    body.scale.setScalar(THREE.MathUtils.lerp(body.scale.x, hovered ? 1.06 : 1, 0.12));
    body.position.z = THREE.MathUtils.lerp(body.position.z, hovered ? 0.3 : 0, 0.12);

    // each card floats gently, out of step with its neighbours
    if (!reduced) {
      time.current += delta;
      body.position.y = Math.sin(time.current * 1.2 + angle * 3) * 0.04;
    }

    // cards at the back of the ring get darker: gives depth
    ref.current!.getWorldPosition(worldPosition);
    const light = THREE.MathUtils.mapLinear(worldPosition.z, -radius, radius, 0.35, 1);
    bodyMaterialRef.current!.color.copy(BODY_COLOR).multiplyScalar(light);
    panelMaterialRef.current!.color.copy(PANEL_COLOR).multiplyScalar(light);
    const imageMaterial = imageRef.current?.material as THREE.ShaderMaterial & { color: THREE.Color };
    imageMaterial?.color?.setScalar(light);
  });

  const top = CARD_HEIGHT / 2;
  const panelY = top - INSET - PANEL / 2;
  const textY = -top + 0.2;

  return (
    <group
      ref={ref}
      position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
      rotation={[0, angle, 0]}
      onPointerOver={(e) => {
        e.stopPropagation(); // only the card in front reacts
        setHovered(true);
        onHover(true);
        setCursorLabel("View");
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(false);
        setCursorLabel(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
    >
      <group ref={bodyRef}>
        {/* card body: graphite, very rounded */}
        <mesh geometry={BODY_GEOMETRY}>
          <meshStandardMaterial ref={bodyMaterialRef} roughness={0.55} />
        </mesh>

        {/* light panel behind the photo, with the same rounded language */}
        <mesh geometry={PANEL_GEOMETRY} position={[0, panelY, 0.031]}>
          <meshBasicMaterial ref={panelMaterialRef} />
        </mesh>
        <Image
          ref={imageRef}
          url={product.thumbnail}
          scale={PANEL * 0.86}
          position={[0, panelY, 0.04]}
          transparent
          toneMapped={false}
        />

        {/* name on the left, price on the right */}
        <Text
          position={[-PANEL / 2, textY, 0.04]}
          fontSize={0.075}
          anchorX="left"
          anchorY="middle"
          color="#f5f5f7"
        >
          {shorten(product.title)}
        </Text>
        <Text
          position={[PANEL / 2, textY, 0.04]}
          fontSize={0.075}
          anchorX="right"
          anchorY="middle"
          color="#f472b6"
        >
          {formatPrice(product.price)}
        </Text>
      </group>
    </group>
  );
}
