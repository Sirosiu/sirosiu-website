import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial, Text } from "@react-three/drei";
import { CatmullRomCurve3, Vector3, type BufferAttribute, type Group, type Mesh } from "three";
import { journeyChapters } from "../content/journey";

export type SceneMode = "gateway" | "world" | "journey";
export type DestinationId = "projects" | "about" | "capabilities" | "journey";

type WorldSceneProps = {
  mode?: SceneMode;
  theme?: "dark" | "light";
  hovered?: boolean;
  onEnter?: () => void;
  onHoverChange?: (hovered: boolean) => void;
  onGatewayToggle?: (active: boolean) => void;
  onDestinationSelect?: (id: DestinationId) => void;
  selectedDestination?: DestinationId | null;
  activeJourneyChapterId?: string;
  onJourneyChapterSelect?: (id: string) => void;
  reducedMotion?: boolean;
};

const destinations: Array<{ id: DestinationId; label: string; position: [number, number, number]; color: string }> = [
  { id: "projects", label: "PROJECTS", position: [-3.7, 1.3, -3.2], color: "#d8f779" },
  { id: "about", label: "ABOUT", position: [3.5, 1.7, -4.7], color: "#b4f3dc" },
  { id: "capabilities", label: "CAPABILITIES", position: [-4.8, 0.9, -7], color: "#d6bd91" },
  { id: "journey", label: "JOURNEY", position: [4.8, 1.2, -8], color: "#8fd1bd" },
];

function Water({ theme }: { theme: "dark" | "light" }) {
  const light = theme === "light";
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    const geometry = ref.current?.geometry;
    if (!geometry) return;
    const positions = geometry.attributes.position as BufferAttribute;
    const time = clock.elapsedTime;
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      positions.setZ(i,
        Math.sin(x * 0.34 + time * 0.72) * 0.055 +
        Math.sin(y * 0.48 - time * 0.46) * 0.038 +
        Math.sin((x + y) * 0.16 + time * 0.3) * 0.025,
      );
    }
    positions.needsUpdate = true;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, -4]} receiveShadow>
      <planeGeometry args={[42, 34, 64, 64]} />
      <MeshReflectorMaterial
        color={light ? "#567d78" : "#241b2a"} metalness={0.72} roughness={light ? 0.3 : 0.28} mirror={0.54}
        blur={[180, 55]} resolution={256} mixBlur={0.8} mixStrength={0.9} depthScale={0.25}
      />
    </mesh>
  );
}

function RippleLight() {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 0.8) * 0.035);
    ref.current.rotation.z = clock.elapsedTime * 0.018;
  });
  return <group ref={ref} position={[0, -0.36, -4]}><mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[2.1, 2.16, 96]} /><meshBasicMaterial color="#67d89a" transparent opacity={0.34} toneMapped={false} /></mesh></group>;
}

function Atmosphere({ theme }: { theme: "dark" | "light" }) {
  const light = theme === "light";
  return <>
    <color attach="background" args={[light ? "#dce6dd" : "#110d15"]} /><fog attach="fog" args={[light ? "#aabeb1" : "#21131a", 10, 34]} />
    <ambientLight intensity={light ? 0.42 : 0.3} /><hemisphereLight args={[light ? "#f4ead6" : "#d4b3b0", light ? "#385b55" : "#0a080c", 0.7]} />
    <directionalLight position={[-5, 8, 5]} intensity={light ? 2.1 : 2.6} color={light ? "#fff1d2" : "#e8d0b1"} />
    <pointLight position={[0, 2.8, -5]} intensity={light ? 10 : 15} distance={11} color={light ? "#9be7c0" : "#b5f2c9"} decay={2} />
    <pointLight position={[-6, 2, -9]} intensity={3} distance={13} color="#427f6d" decay={2} />
    <mesh position={[0, 4.8, -19]}><planeGeometry args={[40, 22]} /><meshBasicMaterial color={light ? "#c7d8ce" : "#160e19"} /></mesh>
    <mesh position={[0, 3.2, -17]}><planeGeometry args={[26, 9]} /><meshBasicMaterial color={light ? "#789b8f" : "#5b303b"} transparent opacity={0.19} depthWrite={false} /></mesh>
    <mesh position={[0, 1.45, -15]}><planeGeometry args={[25, 0.12]} /><meshBasicMaterial color="#78cbb0" transparent opacity={0.28} toneMapped={false} /></mesh>
  </>;
}

function Monument({ position, size, rotation = 0, theme }: { position: [number, number, number]; size: [number, number, number]; rotation?: number; theme: "dark" | "light" }) {
  const light = theme === "light";
  return <group position={position} rotation={[0, rotation, 0]}>
    <mesh castShadow><boxGeometry args={size} /><meshStandardMaterial color={light ? "#7e6256" : "#302631"} metalness={0.58} roughness={0.5} /></mesh>
    <mesh position={[0, size[1] / 2 + 0.012, 0]}><boxGeometry args={[size[0] * 0.55, 0.025, size[2] * 0.55]} /><meshBasicMaterial color={light ? "#8c493a" : "#b88a69"} toneMapped={false} /></mesh>
  </group>;
}

function Gateway({ theme, hovered, onHoverChange, onGatewayToggle }: { theme: "dark" | "light"; hovered: boolean; onHoverChange?: (value: boolean) => void; onGatewayToggle?: (active: boolean) => void }) {
  const light = theme === "light";
  const [activated, setActivated] = useState(false);
  const artifact = useRef<Group>(null);
  const targetRotation = useRef({ x: 0, z: 0 });
  const pointerDrag = useRef({ active: false, x: 0, y: 0 });
  const didDrag = useRef(false);
  useFrame(({ clock }) => {
    if (artifact.current) {
      artifact.current.rotation.y += 0.006;
      artifact.current.rotation.x += (targetRotation.current.x - artifact.current.rotation.x) * 0.07;
      artifact.current.rotation.z += (targetRotation.current.z - artifact.current.rotation.z) * 0.07;
      artifact.current.position.y = Math.sin(clock.elapsedTime * 0.72) * 0.2;
      const scale = hovered || activated ? 1.62 : 1.48;
      artifact.current.scale.x += (scale - artifact.current.scale.x) * 0.08;
      artifact.current.scale.y = artifact.current.scale.x;
      artifact.current.scale.z = artifact.current.scale.x;
    }
  });
  return <group position={[0, 2.65, -5.7]}>
    <group ref={artifact} onPointerOver={(event) => { event.stopPropagation(); onHoverChange?.(true); }} onPointerOut={() => { if (!pointerDrag.current.active && !activated) onHoverChange?.(false); }} onPointerDown={(event) => { event.stopPropagation(); pointerDrag.current = { active: true, x: event.clientX, y: event.clientY }; didDrag.current = false; const target = event.nativeEvent.target; if (target instanceof Element) target.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { event.stopPropagation(); if (!pointerDrag.current.active || !artifact.current) return; const dx = event.clientX - pointerDrag.current.x; const dy = event.clientY - pointerDrag.current.y; if (Math.abs(dx) + Math.abs(dy) > 2) didDrag.current = true; artifact.current.rotation.y += dx * 0.012; artifact.current.rotation.x += dy * 0.012; targetRotation.current.x = artifact.current.rotation.x; targetRotation.current.z = artifact.current.rotation.z; pointerDrag.current.x = event.clientX; pointerDrag.current.y = event.clientY; }} onPointerUp={(event) => { event.stopPropagation(); pointerDrag.current.active = false; }} onPointerCancel={() => { pointerDrag.current.active = false; }} onClick={(event) => { event.stopPropagation(); if (didDrag.current) { didDrag.current = false; return; } const next = !activated; setActivated(next); onHoverChange?.(next); onGatewayToggle?.(next); }}>
      <mesh castShadow rotation={[0.15, 0.25, 0]}><dodecahedronGeometry args={[1.08, 0]} /><meshStandardMaterial color={light ? "#a98c79" : "#886653"} metalness={0.58} roughness={0.42} emissive={light ? "#4b2922" : "#321a25"} emissiveIntensity={0.26} /></mesh>
      <mesh rotation={[0.3, 0.8, 0.2]}><dodecahedronGeometry args={[0.74, 0]} /><meshStandardMaterial color={light ? "#c18b66" : "#b27a5a"} metalness={0.68} roughness={0.24} emissive={light ? "#8d5140" : "#6c3a37"} emissiveIntensity={0.48} /></mesh>
      <mesh position={[0, 0, 0.76]}><icosahedronGeometry args={[0.38, 1]} /><meshPhysicalMaterial color={light ? "#e4fff1" : "#a8f5d2"} emissive={light ? "#4ebf99" : "#287f70"} emissiveIntensity={hovered || activated ? 2.4 : 1.35} metalness={0.12} roughness={0.1} transmission={0.3} thickness={0.8} transparent opacity={0.92} /></mesh>
      {[-1, 1].map((side) => <mesh key={side} position={[side * 0.9, side * 0.25, -0.28]} rotation={[0.4, side * 0.35, 0.2]}><octahedronGeometry args={[0.24, 0]} /><meshStandardMaterial color={light ? "#7e6256" : "#493441"} metalness={0.72} roughness={0.34} /></mesh>)}
      <mesh rotation={[0.4, 0.8, 0.2]}><torusGeometry args={[1.48, 0.025, 10, 72]} /><meshStandardMaterial color={light ? "#b77a5b" : "#9d6b54"} metalness={0.74} roughness={0.22} emissive={light ? "#6c342a" : "#5a2b34"} emissiveIntensity={0.38} /></mesh>
      <mesh rotation={[Math.PI / 2, 0.5, 0]}><torusGeometry args={[1.72, 0.012, 8, 72]} /><meshBasicMaterial color={light ? "#087f73" : "#baffd0"} toneMapped={false} /></mesh>
      <mesh rotation={[0.15, -0.6, 1.1]}><torusGeometry args={[1.95, 0.01, 8, 72]} /><meshBasicMaterial color={light ? "#8c861d" : "#d8f779"} toneMapped={false} /></mesh>
      <mesh><sphereGeometry args={[1.85, 24, 16]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
    </group>
  </group>;
}

function DestinationBeacon({ id, label, position, color, active, onSelect }: { id: DestinationId; label: string; position: [number, number, number]; color: string; active: boolean; onSelect?: (id: DestinationId) => void }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => { if (ref.current) { ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.55 + position[0]) * 0.09; ref.current.rotation.y += 0.002; } });
  return <group ref={ref} name={label} position={position} onClick={(event) => { event.stopPropagation(); onSelect?.(id); }}>
    <mesh><octahedronGeometry args={[active ? 0.52 : 0.38, 0]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 1.8 : 0.65} metalness={0.34} roughness={0.24} /></mesh>
    <mesh position={[0, -0.72, 0]}><cylinderGeometry args={[0.018, 0.018, 1.2, 8]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
    <mesh position={[0, -1.33, 0]}><torusGeometry args={[0.24, 0.012, 8, 32]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
  </group>;
}

const journeyStops = journeyChapters.map((chapter, index) => ({
  id: chapter.id,
  number: chapter.number,
  title: chapter.title,
  visual: chapter.visual,
  position: [Math.sin(index * 0.68) * 6.4, 0, -index * 5.5] as [number, number, number],
  tint: ["#b8f0d1", "#b6d6ff", "#d9c59f", "#a7e5cf", "#edbd8d", "#a9e4c1", "#c6ed91", "#f0d8a5"][index],
}));

function JourneyLandmark({ stop, active, onSelect, light, reducedMotion }: { stop: typeof journeyStops[number]; active: boolean; onSelect: (id: string) => void; light: boolean; reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    if (!reducedMotion) {
      group.current.rotation.y += active ? 0.003 : 0.0012;
      group.current.position.y = 0.08 + Math.sin(clock.elapsedTime * 0.7 + Number(stop.number)) * 0.055;
    }
  });
  return <group ref={group} position={stop.position} onClick={(event) => { event.stopPropagation(); onSelect(stop.id); }}>
    <Text visible={active} position={[0, 2.15, 0]} fontSize={0.12} maxWidth={2.2} lineHeight={1.1} textAlign="center" anchorX="center" anchorY="bottom" color={light ? "#17332e" : "#e8f1e9"} outlineWidth={0.008} outlineColor={light ? "#b8d5d4" : "#07141a"}>{stop.number}</Text>
    <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}><cylinderGeometry args={[active ? 0.9 : 0.72, active ? 0.9 : 0.72, 0.12, 8]} /><meshStandardMaterial color={active ? "#496a5d" : "#1a2828"} metalness={0.62} roughness={0.34} /></mesh>
    <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[active ? 0.82 : 0.65, active ? 0.025 : 0.016, 8, 48]} /><meshBasicMaterial color={stop.tint} toneMapped={false} /></mesh>
    <group position={[0, active ? 1.45 : 1.05, 0]}>
      {stop.visual === "cosmos" ? <><mesh><sphereGeometry args={[0.43, 24, 18]} /><meshStandardMaterial color={stop.tint} emissive={stop.tint} emissiveIntensity={active ? 1.25 : 0.38} metalness={0.22} roughness={0.22} /></mesh><mesh rotation={[0.7, 0.25, 0]}><torusGeometry args={[0.66, 0.018, 8, 48]} /><meshBasicMaterial color={stop.tint} toneMapped={false} /></mesh></>
        : stop.visual === "inward" ? <mesh><torusKnotGeometry args={[0.34, 0.075, 72, 10, 2, 3]} /><meshStandardMaterial color={stop.tint} emissive={stop.tint} emissiveIntensity={active ? 1.15 : 0.3} metalness={0.58} roughness={0.2} /></mesh>
        : stop.visual === "direction" ? <mesh rotation={[0.3, 0.4, 0]}><tetrahedronGeometry args={[0.5, 0]} /><meshStandardMaterial color={stop.tint} emissive={stop.tint} emissiveIntensity={active ? 1.4 : 0.35} metalness={0.42} roughness={0.28} /></mesh>
        : stop.visual === "resilience" ? <mesh rotation={[0.2, 0.45, 0.18]}><boxGeometry args={[0.52, 0.7, 0.38]} /><meshStandardMaterial color={stop.tint} emissive={stop.tint} emissiveIntensity={active ? 1.05 : 0.25} metalness={0.5} roughness={0.38} /></mesh>
        : stop.visual === "creation" ? <mesh rotation={[0.4, 0.5, 0.2]}><dodecahedronGeometry args={[0.47, 0]} /><meshStandardMaterial color={stop.tint} emissive={stop.tint} emissiveIntensity={active ? 1.25 : 0.35} metalness={0.48} roughness={0.24} /></mesh>
        : stop.visual === "systems" ? <><mesh rotation={[0.15, 0.3, 0.2]}><octahedronGeometry args={[0.45, 0]} /><meshStandardMaterial color={stop.tint} emissive={stop.tint} emissiveIntensity={active ? 1.35 : 0.38} metalness={0.5} roughness={0.2} /></mesh><mesh rotation={[Math.PI / 2, 0.35, 0]}><torusGeometry args={[0.63, 0.017, 8, 48]} /><meshBasicMaterial color={stop.tint} toneMapped={false} /></mesh></>
        : stop.visual === "horizon" ? <mesh rotation={[0.25, 0.6, 0]}><coneGeometry args={[0.4, 0.8, 6]} /><meshStandardMaterial color={stop.tint} emissive={stop.tint} emissiveIntensity={active ? 1.35 : 0.36} metalness={0.45} roughness={0.22} /></mesh>
        : <mesh rotation={[0.3, 0.5, 0.2]}><icosahedronGeometry args={[0.44, 0]} /><meshStandardMaterial color={stop.tint} emissive={stop.tint} emissiveIntensity={active ? 1.45 : 0.38} metalness={0.45} roughness={0.25} /></mesh>}
    </group>
    <mesh position={[0, active ? 1.45 : 1.05, 0]}><sphereGeometry args={[active ? 0.54 : 0.38, 14, 12]} /><meshBasicMaterial color={stop.tint} transparent opacity={active ? 0.06 : 0.025} depthWrite={false} /></mesh>
    <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.012, 0.026, active ? 1.35 : 0.8, 8]} /><meshBasicMaterial color={stop.tint} transparent opacity={0.7} toneMapped={false} /></mesh>
  </group>;
}

function JourneyEnvironment({ theme, activeJourneyChapterId = journeyStops[0].id, onJourneyChapterSelect = () => undefined, reducedMotion = false }: WorldSceneProps) {
  const light = theme === "light";
  const camera = useThree((state) => state.camera);
  const first = useRef(true);
  const cameraTarget = useRef(new Vector3());
  const lookTarget = useRef(new Vector3());
  const currentDirection = useRef(new Vector3());
  const desiredDirection = useRef(new Vector3());
  const selectedIndex = Math.max(0, journeyStops.findIndex((stop) => stop.id === activeJourneyChapterId));
  const selectedStop = journeyStops[selectedIndex];
  useEffect(() => {
    const [x, , z] = selectedStop.position;
    cameraTarget.current.set(x + (selectedIndex > 0 ? 3.2 : -1.7), 5.2, z + 12.5);
    lookTarget.current.set(x, 1.05, z - 0.4);
    if (first.current || reducedMotion) {
      camera.position.copy(cameraTarget.current);
      camera.lookAt(lookTarget.current);
      first.current = false;
    }
  }, [camera, reducedMotion, selectedIndex, selectedStop.position]);
  useFrame((_, delta) => {
    const speed = reducedMotion ? 1 : Math.min(delta * 2.1, 1);
    camera.position.lerp(cameraTarget.current, speed);
    camera.getWorldDirection(currentDirection.current);
    desiredDirection.current.copy(lookTarget.current).sub(camera.position).normalize();
    currentDirection.current.lerp(desiredDirection.current, speed).normalize();
    camera.lookAt(camera.position.x + currentDirection.current.x, camera.position.y + currentDirection.current.y, camera.position.z + currentDirection.current.z);
  });
  const pathPoints = journeyStops.map((stop) => new Vector3(stop.position[0], -0.12, stop.position[2]));
  const path = new CatmullRomCurve3(pathPoints);
  return <>
    <color attach="background" args={[light ? "#bfd8d4" : "#27464c"]} />
    <fog attach="fog" args={[light ? "#bfd8d4" : "#27464c", 36, 115]} />
    <ambientLight intensity={light ? 1.35 : 1.15} />
    <hemisphereLight args={[light ? "#f1f1d9" : "#c6e9dc", light ? "#426c65" : "#1a322f", 1.65]} />
    <directionalLight position={[-7, 12, 7]} intensity={light ? 3.2 : 3.4} color={light ? "#fff0d0" : "#e2eddd"} />
    <pointLight position={[selectedStop.position[0], 4, selectedStop.position[2]]} intensity={light ? 90 : 56} distance={17} color={selectedStop.tint} decay={2} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, -70]} receiveShadow><planeGeometry args={[150, 180]} /><meshStandardMaterial color={light ? "#6d9890" : "#203b35"} emissive={light ? "#000000" : "#0a1716"} emissiveIntensity={0.45} metalness={0.38} roughness={0.46} /></mesh>
    <mesh position={[0, 24, -82]}><planeGeometry args={[150, 56]} /><meshBasicMaterial color={light ? "#d3e2d7" : "#24454a"} transparent opacity={0.35} depthWrite={false} /></mesh>
    <mesh><tubeGeometry args={[path, 180, 0.018, 6, false]} /><meshBasicMaterial color={light ? "#dce5ba" : "#baffd0"} toneMapped={false} /></mesh>
    {journeyStops.map((stop, index) => <group key={stop.id}>
      <JourneyLandmark stop={stop} active={stop.id === activeJourneyChapterId} onSelect={onJourneyChapterSelect} light={light} reducedMotion={reducedMotion} />
      <mesh position={[stop.position[0] * 1.45, 0.1 + (index % 2) * 0.25, stop.position[2] - 1.8]} rotation={[0.1, index * 0.2, 0.18]}><boxGeometry args={[0.22, 1.8 + (index % 3) * 0.7, 0.22]} /><meshStandardMaterial color={light ? "#82968a" : "#3a5148"} metalness={0.48} roughness={0.5} /></mesh>
    </group>)}
    {journeyStops.map((stop, index) => <mesh key={`horizon-${stop.id}`} position={[Math.sin(index * 1.13) * 12, 2 + (index % 2), stop.position[2] - 4]}><dodecahedronGeometry args={[0.8 + (index % 3) * 0.35, 0]} /><meshStandardMaterial color={light ? "#829b8e" : "#304740"} metalness={0.3} roughness={0.84} /></mesh>)}
  </>;
}

function WorldGeometry(props: WorldSceneProps) {
  const { mode = "gateway", theme = "dark", hovered = false, onHoverChange, onGatewayToggle, onDestinationSelect, selectedDestination } = props;
  if (mode === "gateway") return <><ambientLight intensity={theme === "light" ? 0.72 : 0.55} /><hemisphereLight args={["#e9f5ee", "#17151d", 0.8]} /><directionalLight position={[-3, 5, 5]} intensity={theme === "light" ? 2.6 : 2.2} color={theme === "light" ? "#fff2d9" : "#dfd4c5"} /><pointLight position={[0, 2.7, -4.6]} intensity={theme === "light" ? 24 : 18} distance={9} color={theme === "light" ? "#a8ffe0" : "#79f4ca"} decay={2} /><pointLight position={[1.3, 3.6, -5.1]} intensity={8} distance={6} color="#e5bd83" decay={2} /><Gateway theme={theme} hovered={hovered} onHoverChange={onHoverChange} onGatewayToggle={onGatewayToggle} /></>;
  if (mode === "journey") return <JourneyEnvironment {...props} />;
  return <><Atmosphere theme={theme} /><Water theme={theme} /><RippleLight />
    <Monument theme={theme} position={[-7.2, 2.6, -12]} size={[1.2, 5.2, 1.1]} rotation={0.12} /><Monument theme={theme} position={[7.4, 3.1, -15]} size={[1.45, 6.3, 1.2]} rotation={-0.14} />
    <Monument theme={theme} position={[-5.1, 0.45, -10]} size={[2.5, 0.3, 1.8]} rotation={0.04} /><Monument theme={theme} position={[5.2, 0.7, -11]} size={[2.1, 0.32, 1.5]} rotation={-0.06} />
    <>
      <group position={[0, 0.1, -5.2]}><mesh castShadow><boxGeometry args={[4.8, 0.2, 2.2]} /><meshStandardMaterial color="#294445" metalness={0.7} roughness={0.36} /></mesh><mesh position={[0, 0.15, 0]}><boxGeometry args={[3.6, 0.025, 1.4]} /><meshBasicMaterial color="#b5f2c9" toneMapped={false} /></mesh></group>
      {destinations.map((destination) => <DestinationBeacon key={destination.id} {...destination} active={selectedDestination === destination.id} onSelect={onDestinationSelect} />)}
    </>
  </>;
}

export default function WorldScene(props: WorldSceneProps) { return <WorldGeometry {...props} />; }
