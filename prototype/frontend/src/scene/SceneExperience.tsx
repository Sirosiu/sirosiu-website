import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { journeyChapters, journeyIntroduction } from "../content/journey";
import WorldScene, { type DestinationId, type SceneMode } from "./WorldScene";

type PortalPhase = "idle" | "entering" | "destination" | "exiting";
const destinationCopy: Record<DestinationId, { title: string; description: string }> = {
  projects: { title: "Selected work", description: "A landing point for verified projects, experiments, and the evidence behind them." },
  about: { title: "About the maker", description: "A clear, honest account of the person, questions, and ways of working behind SIROSIU." },
  capabilities: { title: "Capabilities", description: "Technical tools and creative practices are mapped here to real, demonstrated work." },
  journey: { title: "The journey", description: "Learning milestones and experience, distinguished carefully between current, complete, and planned." },
};

function CameraRig({ phase, reducedMotion, mode, theme, hovered, onEnter, onHoverChange, onGatewayToggle, onArrival, onExitComplete, selectedDestination, onDestinationSelect, activeJourneyChapterId, onJourneyChapterSelect }: { phase: PortalPhase; reducedMotion: boolean; mode: SceneMode; theme: "dark" | "light"; hovered: boolean; onEnter: () => void; onHoverChange: (value: boolean) => void; onGatewayToggle: (active: boolean) => void; onArrival: () => void; onExitComplete: () => void; selectedDestination: DestinationId | null; onDestinationSelect: (id: DestinationId) => void; activeJourneyChapterId: string; onJourneyChapterSelect: (id: string) => void }) {
  const rig = useRef<Group>(null);
  const transition = useRef({ phase, startedAt: 0, fromScale: 1, fromZ: 0, completed: false });
  useEffect(() => {
    if (!rig.current) return;
    transition.current = {
      phase,
      startedAt: performance.now(),
      fromScale: rig.current.scale.x,
      fromZ: rig.current.position.z,
      completed: false,
    };
  }, [phase]);
  useFrame(({ pointer }, delta) => {
    if (!rig.current) return;
    const ease = Math.min(delta * 2.8, 1);
    if (phase === "entering" || phase === "exiting") {
      const entering = phase === "entering";
      const target = entering ? 1.28 : 1;
      const targetZ = entering ? 1.3 : 0;
      const duration = entering ? 920 : 620;
      const rawProgress = reducedMotion ? 1 : Math.min((performance.now() - transition.current.startedAt) / duration, 1);
      const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);
      const scale = transition.current.fromScale + (target - transition.current.fromScale) * progress;
      rig.current.scale.setScalar(scale);
      rig.current.position.z = transition.current.fromZ + (targetZ - transition.current.fromZ) * progress;
      rig.current.position.x += (0 - rig.current.position.x) * Math.min(delta * 5, 1);
      rig.current.position.y += (0 - rig.current.position.y) * Math.min(delta * 5, 1);
      if (rawProgress >= 1 && !transition.current.completed) {
        transition.current.completed = true;
        if (entering) onArrival();
        else onExitComplete();
      }
      return;
    }
    if (reducedMotion) { rig.current.position.set(0, 0, 0); rig.current.scale.setScalar(1); return; }
    const motion = mode === "gateway" ? 0.14 : 0.09;
    rig.current.position.x += ((pointer.x * motion * (hovered ? 1.25 : 1)) - rig.current.position.x) * ease;
    rig.current.position.y += ((pointer.y * motion * 0.52) - rig.current.position.y) * ease;
    rig.current.scale.x += (1 - rig.current.scale.x) * ease; rig.current.scale.y = rig.current.scale.x; rig.current.scale.z = rig.current.scale.x;
  });
  return <group ref={rig}><WorldScene mode={mode} theme={theme} hovered={hovered} onEnter={onEnter} onHoverChange={onHoverChange} onGatewayToggle={onGatewayToggle} onDestinationSelect={onDestinationSelect} selectedDestination={selectedDestination} activeJourneyChapterId={activeJourneyChapterId} onJourneyChapterSelect={onJourneyChapterSelect} reducedMotion={reducedMotion} /></group>;
}

export default function SceneExperience({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const [phase, setPhase] = useState<PortalPhase>("idle");
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<DestinationId | null>(null);
  const [activeJourneyChapterId, setActiveJourneyChapterId] = useState(journeyChapters[0].id);
  const [transitioningTo, setTransitioningTo] = useState<DestinationId | null>(null);
  const destinationTimer = useRef<number | null>(null);
  // Keep the chooser anchored to the artifact rather than opening an interim scene panel.
  // A full world is only needed once a destination has actually been selected.
  const mode: SceneMode = phase === "destination" && selectedDestination === "journey" ? "journey" : phase === "destination" && selectedDestination ? "world" : "gateway";
  useEffect(() => { const media = window.matchMedia("(prefers-reduced-motion: reduce)"); const update = () => setReducedMotion(media.matches); update(); media.addEventListener("change", update); return () => media.removeEventListener("change", update); }, []);
  useEffect(() => { const immersive = phase === "destination" && selectedDestination !== null; const previousOverflow = document.body.style.overflow; if (immersive) document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = previousOverflow; }; }, [phase, selectedDestination]);
  useEffect(() => {
    const syncJourneyHash = () => {
      const id = window.location.hash.replace("#journey-", "");
      if (journeyChapters.some((chapter) => chapter.id === id)) setActiveJourneyChapterId(id);
    };
    syncJourneyHash();
    window.addEventListener("hashchange", syncJourneyHash);
    return () => window.removeEventListener("hashchange", syncJourneyHash);
  }, []);
  const beginEntry = useCallback(() => { if (phase !== "idle") return; setHovered(false); setPhase("entering"); }, [phase]);
  const arrive = useCallback(() => setPhase((value) => value === "entering" ? "destination" : value), []);
  useEffect(() => () => { if (destinationTimer.current !== null) window.clearTimeout(destinationTimer.current); }, []);
  const returnToGateway = useCallback(() => { if (destinationTimer.current !== null) window.clearTimeout(destinationTimer.current); setTransitioningTo(null); setSelectedDestination(null); setHovered(false); setPhase("exiting"); }, []);
  const toggleGatewayField = useCallback((active: boolean) => {
    setHovered(active);
    if (active && phase === "idle") setPhase("destination");
    if (!active && phase === "destination" && selectedDestination === null) setPhase("idle");
  }, [phase, selectedDestination]);
  const selectDestination = useCallback((id: DestinationId) => { if (destinationTimer.current !== null || selectedDestination === id) return; setTransitioningTo(id); destinationTimer.current = window.setTimeout(() => { setSelectedDestination(id); setTransitioningTo(null); destinationTimer.current = null; }, reducedMotion ? 20 : 620); }, [reducedMotion, selectedDestination]);
  const selected = selectedDestination ? destinationCopy[selectedDestination] : null;
  return <div className={`scene-shell phase-${phase} theme-${theme}${hovered ? " is-hovered" : ""}${phase === "destination" && selectedDestination === "projects" ? " project-mode" : ""}${phase === "destination" && selectedDestination === "about" ? " about-mode" : ""}${phase === "destination" && selectedDestination === "capabilities" ? " capabilities-mode" : ""}${phase === "destination" && selectedDestination === "journey" ? " journey-mode" : ""}`}>
    <div className="scene-experience">
      <Canvas camera={{ position: [0, 3.35, 8.6], fov: 43, near: 0.1, far: 60 }} onCreated={({ camera }) => camera.lookAt(0, 1.6, -5)} dpr={[1, 1.4]} gl={{ antialias: true, alpha: true, powerPreference: "default" }} fallback={<div className="scene-fallback" />}>
        <CameraRig phase={phase} reducedMotion={reducedMotion} mode={mode} theme={theme} hovered={hovered} onEnter={beginEntry} onHoverChange={setHovered} onGatewayToggle={toggleGatewayField} onArrival={arrive} onExitComplete={() => setPhase((value) => value === "exiting" ? "idle" : value)} selectedDestination={selectedDestination} onDestinationSelect={selectDestination} activeJourneyChapterId={activeJourneyChapterId} onJourneyChapterSelect={setActiveJourneyChapterId} />
      </Canvas>
      {phase === "destination" && selectedDestination ? <div className="scene-destination-overlay" key={selectedDestination}>
        {selectedDestination === "projects" ? <ProjectWorld onBack={() => setSelectedDestination(null)} onReturn={returnToGateway} /> : selectedDestination === "about" ? <AboutWorld onBack={() => setSelectedDestination(null)} onReturn={returnToGateway} /> : selectedDestination === "capabilities" ? <CapabilitiesWorld onBack={() => setSelectedDestination(null)} onReturn={returnToGateway} /> : <JourneyWorld activeId={activeJourneyChapterId} onChapterSelect={(id) => { setActiveJourneyChapterId(id); window.history.replaceState(null, "", `#journey-${id}`); }} onBack={() => setSelectedDestination(null)} onReturn={returnToGateway} onProjects={() => selectDestination("projects")} />}
      </div> : phase === "destination" && <div className="direction-orbit" aria-live="polite">
        <div className="direction-orbit-core" aria-hidden="true"><i /><i /><b>+</b></div>
        <p className="direction-orbit-label">SIROSIU / INNER COORDINATES</p>
        <div role="list" aria-label="Portfolio destinations">
          {(Object.keys(destinationCopy) as DestinationId[]).map((id, index) => <button key={id} type="button" className={`direction-node direction-node-${index}${selectedDestination === id ? " is-selected" : ""}`} onClick={() => selectDestination(id)}><span>{id}</span><i>↗</i></button>)}
        </div>
        <p className="direction-orbit-instruction">Select a coordinate to continue.</p>
      </div>}
      {transitioningTo && <div className="destination-transition" role="status" aria-live="polite"><span>CALIBRATING COORDINATE</span><strong>{transitioningTo}</strong><i /></div>}
    </div>
    <button type="button" className="portal-enter" onClick={phase === "destination" ? returnToGateway : beginEntry} disabled={phase === "entering" || phase === "exiting"}>{phase === "entering" ? "Crossing the threshold…" : phase === "exiting" ? "Returning…" : phase === "destination" ? "← Return to gateway" : "Enter the gateway ↗"}</button>
    <p className="portal-status" aria-live="polite">{phase === "entering" ? "Passing through the ring." : phase === "exiting" ? "The horizon is re-forming." : phase === "destination" ? selected ? `Selected: ${selected.title}.` : "Select a coordinate in the world." : "Hover the gateway or use the accessible control to enter."}</p>
  </div>;
}

function CapabilitiesWorld({ onBack, onReturn }: { onBack: () => void; onReturn: () => void }) {
  const [active, setActive] = useState("software");
  const capabilitySets = [
    { id: "software", label: "Software & web", level: "CURRENT TOOLKIT", detail: "React · TypeScript · Vite · JavaScript · Git & GitHub · Supabase · Linux" },
    { id: "hardware", label: "Digital design & RTL", level: "HARDWARE EXPLORATION", detail: "Verilog · Icarus Verilog · Verilator · Yosys · GTKWave · AMD Vivado · FPGA design" },
    { id: "systems", label: "Systems direction", level: "CURRENTLY LEARNING", detail: "Computer architecture · AI accelerators · RTL verification · Python & NumPy · C++ · Applied AI/ML · Performance optimization" },
  ];
  const selected = capabilitySets.find((item) => item.id === active) ?? capabilitySets[0];
  return <section className="destination-world capabilities-world" aria-labelledby="capabilities-world-title">
    <header><p className="world-kicker">SIROSIU / CAPABILITY FIELD</p><h2 id="capabilities-world-title">Tools for<br/><em>what’s next.</em></h2><p>Technologies I use, study, and explore.</p></header>
    <div className="capability-world-layout"><nav aria-label="Capability groups">{capabilitySets.map((item) => <button key={item.id} type="button" className={active === item.id ? "is-active" : ""} onClick={() => setActive(item.id)}>{item.label}<span>↗</span></button>)}</nav><article aria-live="polite"><small>{selected.level}</small><h3>{selected.label}</h3><p>{selected.detail}</p><i aria-hidden="true">{selected.id === "software" ? "01" : selected.id === "hardware" ? "02" : "03"}</i></article></div>
    <footer className="destination-world-controls"><button type="button" onClick={onBack}>← Back to coordinates</button><button type="button" onClick={onReturn}>Return to gateway ↗</button></footer>
  </section>;
}

function JourneyWorld({ activeId, onChapterSelect, onBack, onReturn, onProjects }: { activeId: string; onChapterSelect: (id: string) => void; onBack: () => void; onReturn: () => void; onProjects: () => void }) {
  const active = journeyChapters.find((chapter) => chapter.id === activeId) ?? journeyChapters[0];
  return <section className="journey-world" aria-labelledby="journey-world-title">
    <header className="journey-world-header"><p className="world-kicker">SIROSIU / GUIDED JOURNEY · {active.number} / 08</p><h2 id="journey-world-title">A journey<br/><em>still unfolding.</em></h2><p>Choose a chapter to travel along the path. Click a landmark or use the index.</p><details className="journey-opening-note"><summary>Read the opening field note</summary><div>{journeyIntroduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></details></header>
    <div className="journey-interface">
      <nav className="journey-index" aria-label="Journey chapters"><p>CHAPTERS <span>{active.number} / 08</span></p><ol>{journeyChapters.map((chapter) => <li key={chapter.id}><a href={`#journey-${chapter.id}`} className={active.id === chapter.id ? "is-active" : ""} aria-current={active.id === chapter.id ? "step" : undefined} onClick={(event) => { event.preventDefault(); onChapterSelect(chapter.id); }}><span>{chapter.number}</span>{chapter.title}</a></li>)}</ol></nav>
      <article className="journey-chapter" id={`journey-${active.id}`} aria-live="polite" aria-labelledby={`journey-title-${active.id}`}>
        <div className="journey-chapter-meta"><span>{active.status}</span><span>{active.subtitle}</span></div>
        <div key={active.id} className="journey-chapter-content"><p className="journey-chapter-number">CHAPTER {active.number}</p><h3 id={`journey-title-${active.id}`}>{active.title}</h3>{active.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<blockquote>“{active.quote}”</blockquote></div>
        <div className="journey-progress" aria-label={`Chapter ${active.number} of 8`}><span style={{ width: `${Number(active.number) / journeyChapters.length * 100}%` }} /></div>
      </article>
    </div>
    <footer className="journey-world-controls"><div><button type="button" onClick={onProjects}>Project archive ↗</button><button type="button" onClick={onBack}>← Coordinates</button><button type="button" onClick={onReturn}>Return to gateway ↗</button></div></footer>
  </section>;
}

export function ProjectWorld({ onBack, onReturn, standalone = false }: { onBack: () => void; onReturn: () => void; standalone?: boolean }) {
  const projects = [
    { number: "01", title: "FraudLens", detail: "A fraud-monitoring prototype that analyzes a simulated transaction stream with an XGBoost classifier and routes flagged activity into an alert-review workflow.", accent: "FRAUD DETECTION / PROTOTYPE", status: "IN DEVELOPMENT", tools: "Next.js · TypeScript · FastAPI · XGBoost · SQLite", repository: "https://github.com/Sirosiu/Fraudlens" },
    { number: "02", title: "SIROSIU Website", detail: "An evolving personal portfolio for engineering, curiosity, and creative technology, including an immersive 3D gateway and project archive.", accent: "PERSONAL PLATFORM / 02", status: "ONGOING", tools: "React · TypeScript · Vite · Three.js", repository: "https://github.com/Sirosiu/sirosiu-website" },
  ];
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [archiveScroll, setArchiveScroll] = useState(0);
  const [dragRotation, setDragRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<number | null>(null);
  const dragMoved = useRef(false);
  const active = activeProject === null ? null : projects[activeProject];
  const beginCardDrag = (event: PointerEvent<HTMLElement>) => {
    dragStart.current = event.clientX;
    dragMoved.current = false;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveCardDrag = (event: PointerEvent<HTMLElement>) => {
    if (dragStart.current === null) return;
    const distance = event.clientX - dragStart.current;
    if (Math.abs(distance) > 4) dragMoved.current = true;
    setDragRotation(Math.max(-18, Math.min(18, distance / 5)));
  };
  const endCardDrag = () => {
    dragStart.current = null;
    setDragging(false);
  };
  return <section className="project-world" data-lenis-prevent aria-labelledby="project-world-title" onScroll={(event) => setArchiveScroll(event.currentTarget.scrollTop)}>
    <div className="project-world-sky" aria-hidden="true"><span/><span/><span/></div>
    <header className="project-world-header"><div><p className="world-kicker">SIROSIU / PROJECT ARCHIVE</p><h2 id="project-world-title">Work in<br/><em>formation.</em></h2><p className="project-world-intro">Two real builds, still taking shape. Drag the forms to explore; select one for its details and source.</p></div><button type="button" className="project-skip" onClick={() => document.getElementById("project-cards")?.scrollIntoView({ behavior: "smooth", block: "center" })}>Skip to project cards ↓</button></header>
    <div className="project-monoliths" id="project-cards" aria-label="Interactive project cards">{projects.map((project, index) => { const tilt = Math.max(-18, Math.min(18, (index - 0.5) * 10 - archiveScroll / 40 + dragRotation)); const openProject = () => { if (dragMoved.current) { dragMoved.current = false; return; } setActiveProject(index); }; return <article className={`project-monolith project-card${dragging ? " is-dragging" : ""}`} key={project.number} tabIndex={0} role="button" aria-label={`Open ${project.title} details`} onPointerDown={beginCardDrag} onPointerMove={moveCardDrag} onPointerUp={endCardDrag} onPointerCancel={endCardDrag} onClick={openProject} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openProject(); } }} style={{ transform: `perspective(900px) rotateY(${tilt}deg) rotateX(${dragRotation / 3}deg)` }}><span>{project.number}</span><b>{project.accent}</b><div className="project-monolith-copy"><strong>{project.title}</strong><small>{project.status}</small><p>{project.detail}</p><em>{project.tools}</em></div><span className="project-card-open" aria-hidden="true">↗</span></article>; })}</div>
    {active && <div className="project-detail" role="dialog" aria-modal="true" aria-labelledby="project-detail-title"><button type="button" className="project-detail-close" onClick={() => setActiveProject(null)}>Close ×</button><p className="world-kicker">{active.accent} · {active.status}</p><h3 id="project-detail-title">{active.title}</h3><p>{active.detail}</p><div className="project-detail-meta"><span>TOOLS</span><b>{active.tools}</b><span>STATUS</span><b>{active.status}</b></div><a className="project-detail-repository" href={active.repository} target="_blank" rel="noreferrer">Open GitHub repository ↗</a></div>}
    <footer className="project-world-controls"><button type="button" onClick={onBack}>{standalone ? "Close archive ×" : "← Back to coordinates"}</button>{!standalone && <button type="button" onClick={onReturn}>Return to gateway ↗</button>}</footer>
  </section>;
}

function AboutWorld({ onBack, onReturn }: { onBack: () => void; onReturn: () => void }) {
  const [activeSignal, setActiveSignal] = useState("WHY?");
  const signalCopy: Record<string, string> = { "WHY?": "The starting point: curiosity before certainty.", NEUROSCIENCE: "The systems behind thought, perception, learning, and behavior.", MEMORY: "How experience is stored, recalled, and reshaped.", "DARK MATTER": "A reminder that the unknown is still part of the map.", "PERSONAL DEVELOPMENT": "The discipline of becoming more capable, aware, and intentional." };
  return <section className="about-world" aria-labelledby="about-world-title">
    <div className="about-world-grid" aria-hidden="true"><span/><span/><span/><span/></div>
    <header className="about-world-header">
      <div><p className="world-kicker">SIROSIU / THE SIGNAL ROOM</p><h2 id="about-world-title">The mind<br/><em>behind it.</em></h2><p className="about-world-intro">A personal field guide to Ankush, the questions that keep moving, and the space called SIROSIU.</p></div>
      <div className="about-world-mark" aria-hidden="true"><span>ANKUSH</span><b>S</b><small>CURIOUS<br/>BY DESIGN</small></div>
    </header>
    <div className="about-world-content">
      <article className="about-signal-card about-signal-card-main"><div className="about-signal-card-top"><span>IDENTITY / 01</span><span>OPEN SIGNAL</span></div><div className="about-portrait-frame"><img src="/sirosiu-portrait-cutout.png" alt="Portrait of Ankush wearing a black shirt" /></div><h3>Curiosity,<br/><em>made tangible.</em></h3><p>I’m an Electronics and Communication Engineering student driven by curiosity, creativity, and the desire to understand how things work.</p></article>
      <article className="about-signal-card about-signal-card-story"><div className="about-signal-card-top"><span>FIELD NOTE / 02</span><span>SIROSIU</span></div><p className="about-signal-lede">I enjoy exploring ideas, learning new skills, and turning concepts into real projects.</p><p>Through SIROSIU, I’m building my own space to experiment, grow, and create things that reflect how I think. It is a place for learning in public, testing ideas, and moving from a question toward something real.</p><p className="about-signal-signature">ANKUSH / ECE STUDENT</p></article>
      <article className="about-signal-card about-signal-card-map"><div className="about-signal-card-top"><span>CURIOSITY MAP / 03</span><span>CLICK A SIGNAL</span></div><div className="curiosity-map"><button type="button" className="curiosity-node curiosity-core" onClick={() => setActiveSignal("WHY?")}>WHY?</button><button type="button" className="curiosity-node curiosity-psychology" onClick={() => setActiveSignal("NEUROSCIENCE")}>NEUROSCIENCE</button><button type="button" className="curiosity-node curiosity-memory" onClick={() => setActiveSignal("MEMORY")}>MEMORY</button><button type="button" className="curiosity-node curiosity-world" onClick={() => setActiveSignal("DARK MATTER")}>DARK MATTER</button><button type="button" className="curiosity-node curiosity-body" onClick={() => setActiveSignal("PERSONAL DEVELOPMENT")}>PERSONAL DEVELOPMENT</button><span className="curiosity-line line-a"/><span className="curiosity-line line-b"/><span className="curiosity-line line-c"/><span className="curiosity-line line-d"/></div><p className="curiosity-detail" aria-live="polite">{signalCopy[activeSignal]}</p></article>
      <article className="about-signal-card about-signal-card-principle"><div className="about-signal-card-top"><span>WORKING PRINCIPLE / 04</span><span>01—∞</span></div><h3>Stay curious.<br/>Build carefully.<br/><em>Keep going.</em></h3><p>I’m drawn to anything that expands my perspective, builds discipline, or helps me understand the world a little better.</p></article>
    </div>
    <footer className="about-world-controls"><button type="button" onClick={onBack}>← Back to coordinates</button><button type="button" onClick={onReturn}>Return to gateway ↗</button></footer>
  </section>;
}
