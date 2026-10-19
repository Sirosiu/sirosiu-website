import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { EquirectangularReflectionMapping, Path, Shape, type Group } from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const environment = "/assets/sunset_forest_1k.hdr";

function makeThresholdShape() {
  const shape = new Shape();
  shape.moveTo(-2.45, -2.8);
  shape.lineTo(-2.45, 0.35);
  shape.quadraticCurveTo(-2.35, 1.56, -1.2, 1.92);
  shape.quadraticCurveTo(-0.4, 2.2, 0, 2.95);
  shape.quadraticCurveTo(0.42, 2.15, 1.24, 1.9);
  shape.quadraticCurveTo(2.4, 1.48, 2.48, 0.35);
  shape.lineTo(2.48, -2.8);
  shape.lineTo(-2.45, -2.8);

  const opening = new Path();
  opening.moveTo(-1.55, -2.8);
  opening.lineTo(-1.55, 0.28);
  opening.quadraticCurveTo(-1.48, 1.02, -0.78, 1.28);
  opening.quadraticCurveTo(-0.18, 1.48, 0, 2.02);
  opening.quadraticCurveTo(0.2, 1.46, 0.82, 1.26);
  opening.quadraticCurveTo(1.52, 1.0, 1.57, 0.28);
  opening.lineTo(1.57, -2.8);
  opening.lineTo(-1.55, -2.8);
  shape.holes.push(opening);
  return shape;
}

function Threshold({ reducedMotion }: { reducedMotion: boolean }) {
  const shape = useMemo(makeThresholdShape, []);
  const frame = useRef<Group>(null);
  const { camera, scene } = useThree();
  const environmentTexture = useLoader(RGBELoader, environment);
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useEffect(() => {
    environmentTexture.mapping = EquirectangularReflectionMapping;
    scene.background = environmentTexture;
    scene.environment = environmentTexture;
    scene.backgroundBlurriness = 0.02;
    return () => {
      scene.background = null;
      scene.environment = null;
    };
  }, [environmentTexture, scene]);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => {
      scroll.current = Math.min(window.scrollY / Math.max(window.innerHeight * 0.9, 1), 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame((_, delta) => {
    const ease = 1 - Math.exp(-Math.min(delta, 0.05) * 2.8);
    const progress = reducedMotion ? 0 : scroll.current;
    const px = reducedMotion ? 0 : pointer.current.x;
    const py = reducedMotion ? 0 : pointer.current.y;

    camera.position.x += (px * 0.18 - camera.position.x) * ease;
    camera.position.y += (1.4 - py * 0.1 - progress * 0.32 - camera.position.y) * ease;
    camera.position.z += (8.6 - progress * 1.1 - camera.position.z) * ease;
    camera.lookAt(px * 0.16, 0.55 - progress * 0.08, -4.2);

    if (frame.current) {
      frame.current.rotation.y += ((px * -0.045) - frame.current.rotation.y) * ease;
      frame.current.rotation.x += ((py * 0.018) - frame.current.rotation.x) * ease;
      frame.current.position.y = -0.2 + Math.sin(performance.now() * 0.00026) * (reducedMotion ? 0 : 0.018);
    }
  });

  return (
    <>
      <fog attach="fog" args={["#272c2a", 9, 29]} />
      <ambientLight intensity={0.48} color="#d8d3c6" />
      <directionalLight position={[-4, 7, 5]} intensity={1.65} color="#f0d3ad" />
      <pointLight position={[1.2, 0.75, -4.4]} intensity={20} distance={10} decay={2} color="#efd1a9" />
      <group ref={frame} position={[2.6, -0.2, -4.8]} rotation={[0, -0.08, 0]}>
        <mesh castShadow receiveShadow>
          <extrudeGeometry args={[shape, { depth: 0.62, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.075, bevelThickness: 0.09, curveSegments: 28 }]} />
          <meshPhysicalMaterial color="#71675b" roughness={0.82} metalness={0.08} clearcoat={0.08} clearcoatRoughness={0.68} />
        </mesh>
        <mesh position={[0, 0, -0.12]}>
          <extrudeGeometry args={[shape, { depth: 0.08, bevelEnabled: false, steps: 1, curveSegments: 28 }]} />
          <meshStandardMaterial color="#252927" roughness={0.92} />
        </mesh>
      </group>
    </>
  );
}

export default function LandscapeHero() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const element = stage.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.01 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hero-world" ref={stage} aria-hidden="true">
      <Canvas frameloop={reducedMotion || !isVisible ? "demand" : "always"} camera={{ position: [0, 1.4, 8.6], fov: 42, near: 0.1, far: 70 }} dpr={[1, 1.25]} gl={{ antialias: true, alpha: false, powerPreference: "low-power" }} fallback={<div className="hero-world-fallback" />}>
        <Threshold reducedMotion={reducedMotion} />
      </Canvas>
      <div className="hero-world-grade" />
    </div>
  );
}
