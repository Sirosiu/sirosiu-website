import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import './SpatialStyles.css';

interface SpatialProject {
  id: string;
  code: string;
  title: string;
  category: string;
  coordinates: string;
  mass: string;
  summary: string;
  architecture: string[];
  telemetry: { label: string; value: string }[];
  stack: string[];
  status: string;
}

const PROJECTS: SpatialProject[] = [
  {
    id: 'ave',
    code: 'AI-SYS-01',
    title: 'A.V.E. Autonomous Cognitive Runtime',
    category: 'LOCAL AI // VOICE & PERSISTENT MEMORY',
    coordinates: '31.3260° N, 75.5762° E // ALT 228M',
    mass: '4.20 GB VRAM',
    summary:
      'Low-latency autonomous personal agent architecture combining quantized local LLM inference, vector episodic memory banks, acoustic VAD wake pipelines, and deterministic OS tool execution.',
    architecture: [
      'Zero-copy audio ring buffer feeding local Whisper C++ streaming transcription',
      'Hybrid HNSW vector memory graph + SQLite WAL deterministic state ledger',
      'Sandboxed Rust/Python system syscall bridge for OS & hardware orchestration',
    ],
    telemetry: [
      { label: 'WAKE-TO-TOKEN', value: '184 ms' },
      { label: 'QUANTIZATION', value: 'INT4_K_M' },
      { label: 'MEMORY RECALL', value: '99.2% @ K=5' },
      { label: 'RUNTIME FOOTPRINT', value: '410 MB RAM' },
    ],
    stack: ['Rust', 'C++', 'Python', 'GGUF / llama.cpp', 'Linux ALSA/PipeWire', 'SQLite WAL'],
    status: 'ACTIVE DEPLOYMENT // REV 2.4',
  },
  {
    id: 'fraudlens',
    code: 'ML-SYS-02',
    title: 'FraudLens Real-Time Anomaly Engine',
    category: 'APPLIED ML // GRAPH STREAM SCORING',
    coordinates: 'NODE-02 // TENSOR-PIPELINE',
    mass: '14.8K TPS',
    summary:
      'High-throughput financial transaction scoring engine utilizing temporal graph features, gradient-boosted decision trees, and sub-10ms tail-latency inference pipelines.',
    architecture: [
      'Sliding-window velocity & graph-centrality feature extraction in sub-2ms',
      'Calibrated ensemble combining XGBoost + TabNet residual anomaly scoring',
      'SHAP feature attribution payload generated inline for compliance auditing',
    ],
    telemetry: [
      { label: 'P99 LATENCY', value: '6.4 ms' },
      { label: 'PR-AUC SCORE', value: '0.964' },
      { label: 'FALSE POSITIVE REDUCTION', value: '-41.8%' },
      { label: 'THROUGHPUT', value: '14,800 tx/s' },
    ],
    stack: ['Python', 'PyTorch', 'XGBoost', 'FastAPI', 'Redis Streams', 'ONNX Runtime'],
    status: 'VERIFIED BENCHMARK // REV 1.9',
  },
  {
    id: 'antenna-sim',
    code: 'EM-RF-03',
    title: 'Full-Wave EM Antenna Radiation Solver',
    category: 'RFIC & ELECTROMAGNETICS // FEM-FDTD',
    coordinates: 'FREQ 2.4GHz - 28GHz // IMP 50Ω',
    mass: 'S11 -28.4 dB',
    summary:
      'Parametric electromagnetic field solver and far-field 3D radiation pattern synthesizer for impedance matching, return-loss optimization, and VSWR characterization.',
    architecture: [
      '3D spherical coordinate far-field directivity & gain tensor computation',
      'Automated LC & quarter-wave stub Smith Chart impedance matching solver',
      'Surface current density visualization across conductive copper geometries',
    ],
    telemetry: [
      { label: 'RETURN LOSS (S11)', value: '-28.4 dB' },
      { label: 'PEAK REALIZED GAIN', value: '8.72 dBi' },
      { label: 'VSWR BANDWIDTH', value: '1.14 : 1' },
      { label: 'RADIATION EFFICIENCY', value: '93.6%' },
    ],
    stack: ['Keysight ADS', 'Python', 'NumPy/SciPy', 'MATLAB', 'Smith Chart CAD'],
    status: 'SILICON / EM VERIFIED // REV 3.1',
  },
  {
    id: 'rv32i-core',
    code: 'ARCH-RTL-04',
    title: '5-Stage Pipelined RV32I RISC-V Core',
    category: 'COMPUTER ARCHITECTURE // VERILOG RTL',
    coordinates: 'ISA RV32I // 5-STAGE HAZARD UNIT',
    mass: '1.42 DMIPS/MHz',
    summary:
      'Synthesizable 32-bit RISC-V processor core written from scratch in Verilog HDL featuring full data-forwarding paths, load-use hazard stall logic, and branch target prediction.',
    architecture: [
      'IF-ID-EX-MEM-WB 5-stage pipeline with register-file bypass muxes',
      'Hardware hazard detection unit resolving RAW dependencies with single-cycle bubble',
      'Cycle-accurate Verilator C++ testbench & GTKWave automated waveform assertion suite',
    ],
    telemetry: [
      { label: 'PIPELINE STAGES', value: '5 STAGE' },
      { label: 'CPI (TYPICAL)', value: '1.18 CYCLES' },
      { label: 'MAX SYNTH CLOCK', value: '185 MHz (Artix-7)' },
      { label: 'LUT UTILIZATION', value: '1,840 LUTs' },
    ],
    stack: ['Verilog HDL', 'Verilator', 'Icarus Verilog', 'Yosys', 'GTKWave', 'Vivado'],
    status: 'RTL SYNTHESIZED // REV 4.0',
  },
  {
    id: 'patch-array',
    code: 'EM-RF-05',
    title: 'mmWave Phased Microstrip Patch Array',
    category: 'RF FRONTEND // BEAMFORMING TOPOLOGY',
    coordinates: '28.0 GHz // 4x4 CORPORATE FEED',
    mass: '16.4 dBi ARRAY',
    summary:
      'High-frequency microstrip patch antenna array engineered with corporate Wilkinson power-divider feed networks and phase-steered main-lobe beamforming control.',
    architecture: [
      'Inset-fed rectangular microstrip geometry optimized on Rogers RO4003C substrate',
      'Corporate quarter-wave transformer corporate feed minimizing phase skew',
      'Mutual coupling suppression via defected ground structure (DGS) isolation slots',
    ],
    telemetry: [
      { label: 'ARRAY GAIN', value: '16.4 dBi' },
      { label: 'SIDE-LOBE LEVEL', value: '-19.2 dB' },
      { label: 'STEERING RANGE', value: '±42° AZIMUTH' },
      { label: 'SUBSTRATE TAN δ', value: '0.0027' },
    ],
    stack: ['Keysight ADS', 'HFSS / EM Pro', 'Rogers RO4003C', 'RF PCB Layout'],
    status: 'EM CHARACTERIZED // REV 2.0',
  },
  {
    id: 'portfolio-sys',
    code: 'SYS-WEB-06',
    title: 'SIROSIU Multi-Paradigm Spatial Engine',
    category: 'DESIGN ENGINEERING // WEBGL & TELEMETRY',
    coordinates: 'SIROSIU.COM // SHINO KERNEL',
    mass: '60 FPS LOCKED',
    summary:
      'Four-world architectural portfolio system fusing PBR Three.js physical monoliths, Swiss editorial typography, curl-noise fluid advection, and EDA schematic instrumentation.',
    architecture: [
      'Zero-dependency custom WebGL / Canvas physics loop with inertial spring damping',
      'Sub-pixel CSS grid registration architecture resilient down to 320px viewports',
      'Live hardware telemetry state machine and instant multi-concept hot-swapping',
    ],
    telemetry: [
      { label: 'FRAME BUDGET', value: 'less than 6.2 ms' },
      { label: 'VIEWPORT RANGE', value: '320px - 3840px' },
      { label: 'CONCEPT ENGINES', value: '04 PARADIGMS' },
      { label: 'BUNDLE OVERHEAD', value: 'ZERO BLOAT' },
    ],
    stack: ['TypeScript', 'React', 'Three.js / WebGL', 'GLSL / Canvas 2D', 'CSS Grid Architecture'],
    status: 'PRODUCTION LIVE // REV 3.0',
  },
];

const CAPABILITIES = [
  {
    index: '01',
    domain: 'COMPUTER ARCHITECTURE & RTL',
    spec: 'ISA DESIGN // PIPELINE HAZARDS // FPGA SYNTHESIS',
    detail:
      'Designing deterministic digital logic from register-transfer level up to synthesized bitstreams. Pipelined RISC-V datapaths, AXI4 stream interconnects, hardware accelerators, and cycle-accurate Verilator verification.',
    metrics: ['Verilog / SystemVerilog', 'Vivado / Yosys', 'Verilator / GTKWave', 'RISC-V RV32I/M'],
  },
  {
    index: '02',
    domain: 'RFIC & ELECTROMAGNETIC SYSTEMS',
    spec: 'IMPEDANCE MATCHING // MICROSTRIP ARRAYS // S-PARAMETERS',
    detail:
      'High-frequency electromagnetic simulation, microstrip phased array synthesis, LNA/mixer frontend topology, and Smith Chart impedance networks engineered for minimal insertion loss and tight VSWR bounds.',
    metrics: ['Keysight ADS', 'Cadence IC Suite', '2.4GHz - 28GHz EM', 'Smith Match Networks'],
  },
  {
    index: '03',
    domain: 'APPLIED AI & BCI SIGNAL PIPELINES',
    spec: 'LOCAL LLM INFERENCE // NEURAL DSP // GRAPH ML',
    detail:
      'Building sovereign machine learning systems that run on bare metal. Quantized transformer runtimes, non-invasive EEG/BCI spectral filtering, and ultra-low-latency anomaly detection engines.',
    metrics: ['PyTorch / ONNX', 'llama.cpp / GGUF', 'EEG Spectral DSP', 'Sub-10ms Scoring'],
  },
  {
    index: '04',
    domain: 'SYSTEMS PROGRAMMING & LINUX KERNEL',
    spec: 'MEMORY ARENAS // ZERO-COPY IPC // MULTIBOOT HYPRLAND',
    detail:
      'Low-level systems craftsmanship in C++, Rust, and Arch Linux. Lock-free ring buffers, custom hardware telemetry daemons, SIMD vectorized compute kernels, and tactile spatial interfaces.',
    metrics: ['Rust / Modern C++', 'Arch Linux / Hyprland', 'POSIX / DMA Buffers', 'Three.js / WebGL'],
  },
];

const LAB_EXPERIMENTS = [
  {
    code: 'LAB-X01',
    title: 'EEG Motor-Imagery Wavelet Classifier',
    datum: 'BCI // MU & BETA BAND (8-30Hz)',
    note: 'Common Spatial Patterns (CSP) filter bank extracting contralateral sensorimotor desynchronization for real-time cursor vector intent.',
  },
  {
    code: 'LAB-X02',
    title: 'SIMD INT8 Matrix-Multiply Microkernel',
    datum: 'C++20 // AVX2 & NEON INTRINSICS',
    note: 'Cache-blocked register tiling achieving 89% theoretical peak FLOPs on Intel i7-13650HX without external BLAS dependencies.',
  },
  {
    code: 'LAB-X03',
    title: 'Topographic Bathymetry Shader Mesh',
    datum: 'GLSL // VERTEX DISPLACEMENT',
    note: 'Procedural isoline elevation contours driven by analytical simplex derivatives and Fresnel rim attenuation.',
  },
  {
    code: 'LAB-X04',
    title: 'Lock-Free SPSC Audio Telemetry Pipe',
    datum: 'RUST // ATOMIC ACQUIRE-RELEASE',
    note: 'Zero-allocation single-producer single-consumer ring buffer transferring 48kHz PCM frames between ALSA hardware threads and inference workers.',
  },
];

const WRITINGS = [
  {
    id: 'W-01',
    date: '2026.10',
    readTime: '11 MIN READ',
    title: 'Eliminating Pipeline Stalls: Forwarding Paths in a 5-Stage RV32I Core',
    abstract:
      'A gate-level walkthrough of resolving Read-After-Write (RAW) hazards between EX/MEM and MEM/WB stages without sacrificing critical path slack.',
    tag: 'ARCHITECTURE',
  },
  {
    id: 'W-02',
    date: '2026.09',
    readTime: '14 MIN READ',
    title: 'Corporate Feed Networks & Mutual Coupling in 28GHz Microstrip Patch Arrays',
    abstract:
      'Why naive quarter-wave power dividers fail at millimeter-wave frequencies, and how surface-wave suppression restores side-lobe integrity.',
    tag: 'ELECTROMAGNETICS',
  },
  {
    id: 'W-03',
    date: '2026.08',
    readTime: '09 MIN READ',
    title: 'Memory Bandwidth Is the Only Bottleneck: Local LLM Inference on Consumer Silicon',
    abstract:
      'Profiling KV-cache memory traffic, FlashAttention tiling, and INT4 dequantization overhead across hybrid CPU/GPU memory hierarchies.',
    tag: 'SYSTEMS ML',
  },
];

export const Concept01Spatial: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedProject, setSelectedProject] = useState<SpatialProject>(PROJECTS[0]);
  const [telemetryAzimuth, setTelemetryAzimuth] = useState({ x: '0.00', y: '0.00', rpm: '1.34' });
  const [explosionFactor, setExplosionFactor] = useState<number>(0);
  const explosionRef = useRef<number>(0);

  useEffect(() => {
    explosionRef.current = explosionFactor;
  }, [explosionFactor]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 6.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // PBR Materials
    const obsidianTitanium = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#10141f'),
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 0.45,
      clearcoatRoughness: 0.12,
      reflectivity: 0.95,
    });

    const machinedTungsten = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#1d2436'),
      metalness: 0.82,
      roughness: 0.28,
      clearcoat: 0.2,
    });

    const copperCoreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#d97706'),
      metalness: 0.96,
      roughness: 0.1,
      clearcoat: 0.6,
    });

    const wireframeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#38bdf8'),
      transparent: true,
      opacity: 0.22,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Outer Brutalist Frame Slabs
    const outerFrame = new THREE.Group();
    const pillarGeo = new RoundedBoxGeometry(0.34, 2.75, 0.34, 6, 0.035);
    const crossGeo = new RoundedBoxGeometry(2.75, 0.34, 0.34, 6, 0.035);

    const leftSlab = new THREE.Mesh(pillarGeo, obsidianTitanium);
    leftSlab.position.set(-1.18, 0, 0);
    const rightSlab = new THREE.Mesh(pillarGeo, obsidianTitanium);
    rightSlab.position.set(1.18, 0, 0);
    const topSlab = new THREE.Mesh(crossGeo, obsidianTitanium);
    topSlab.position.set(0, 1.18, 0);
    const bottomSlab = new THREE.Mesh(crossGeo, obsidianTitanium);
    bottomSlab.position.set(0, -1.18, 0);

    outerFrame.add(leftSlab, rightSlab, topSlab, bottomSlab);
    rootGroup.add(outerFrame);

    // Middle Gimbal Ring
    const midGimbal = new THREE.Group();
    const midSlabGeo = new RoundedBoxGeometry(1.72, 1.72, 0.44, 6, 0.04);
    const midMesh = new THREE.Mesh(midSlabGeo, machinedTungsten);
    midMesh.rotation.z = Math.PI / 4;
    midGimbal.add(midMesh);

    const cageEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.88, 1.88, 0.56));
    const cageLines = new THREE.LineSegments(cageEdges, wireframeMat);
    cageLines.rotation.z = Math.PI / 4;
    midGimbal.add(cageLines);
    rootGroup.add(midGimbal);

    // Inner Precision Core + Satellites
    const innerCoreGroup = new THREE.Group();
    const coreGeo = new THREE.OctahedronGeometry(0.58, 0);
    const coreMesh = new THREE.Mesh(coreGeo, copperCoreMat);
    innerCoreGroup.add(coreMesh);

    const ringGeo = new THREE.TorusGeometry(0.84, 0.035, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeo, obsidianTitanium);
    ringMesh.rotation.x = Math.PI / 2;
    innerCoreGroup.add(ringMesh);
    rootGroup.add(innerCoreGroup);

    // 3-Point Studio Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.6);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const cyanRim = new THREE.SpotLight(0x38bdf8, 5.5, 25, Math.PI / 3, 0.5);
    cyanRim.position.set(-7, 4, -5);
    scene.add(cyanRim);

    const amberBounce = new THREE.PointLight(0xf59e0b, 2.4, 15);
    amberBounce.position.set(4, -6, 3);
    scene.add(amberBounce);

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let tick = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      tick++;

      // Heavy 400kg inertial damping
      pointer.x += (pointer.targetX - pointer.x) * 0.035;
      pointer.y += (pointer.targetY - pointer.y) * 0.035;

      const exp = explosionRef.current;
      leftSlab.position.x = -1.18 - exp * 0.55;
      rightSlab.position.x = 1.18 + exp * 0.55;
      topSlab.position.y = 1.18 + exp * 0.55;
      bottomSlab.position.y = -1.18 - exp * 0.55;
      midGimbal.position.z = exp * 0.65;
      innerCoreGroup.position.z = exp * 1.25;

      rootGroup.rotation.y = elapsed * 0.14 + pointer.x * 0.72;
      rootGroup.rotation.x = Math.sin(elapsed * 0.25) * 0.14 - pointer.y * 0.48;

      midGimbal.rotation.y = -elapsed * 0.26;
      midGimbal.rotation.x = Math.cos(elapsed * 0.35) * 0.22;

      coreMesh.rotation.y = elapsed * 0.65;
      coreMesh.rotation.z = elapsed * 0.42;
      ringMesh.rotation.y = -elapsed * 0.5;

      renderer.render(scene, camera);

      if (tick % 12 === 0) {
        setTelemetryAzimuth({
          x: (rootGroup.rotation.x * (180 / Math.PI)).toFixed(1),
          y: ((rootGroup.rotation.y * (180 / Math.PI)) % 360).toFixed(1),
          rpm: (1.34 + Math.hypot(pointer.x, pointer.y) * 0.8).toFixed(2),
        });
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      pmremGenerator.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="c1-spatial-root">
      {/* Top Architectural Telemetry Bar */}
      <header className="c1-topbar">
        <div className="c1-topbar-cell c1-brand-lockup">
          <span className="c1-status-dot" />
          <span className="c1-mono-strong">SIROSIU // SHINO</span>
          <span className="c1-mono-dim">CONCEPT 01 — SPATIAL PRECISION</span>
        </div>
        <nav className="c1-topbar-nav" aria-label="Spatial Navigation">
          <a href="#c1-work">01.WORK</a>
          <a href="#c1-capabilities">02.CAPABILITIES</a>
          <a href="#c1-lab">03.LAB</a>
          <a href="#c1-philosophy">04.PHILOSOPHY</a>
          <a href="#c1-writing">05.WRITING</a>
          <a href="#c1-contact">06.CONTACT</a>
        </nav>
        <div className="c1-topbar-cell c1-coord-readout">
          <span>AZIMUTH: {telemetryAzimuth.y}°</span>
          <span>PITCH: {telemetryAzimuth.x}°</span>
        </div>
      </header>

      {/* SECTION 01: HERO MONOLITH */}
      <section className="c1-hero-section">
        <div className="c1-hero-grid">
          <div className="c1-hero-copy c1-crosshair-box">
            <div className="c1-eyebrow-row">
              <span className="c1-tag-chip">SYS.ARCH // NITJ ECE &apos;27</span>
              <span className="c1-mono-dim">ANKUSH MALOTHIA (SIROSIU)</span>
            </div>

            <h1 className="c1-hero-title">
              SCULPTING
              <br />
              <span>DETERMINISTIC</span>
              <br />
              SILICON &amp; INTELLIGENCE.
            </h1>

            <p className="c1-hero-lead">
              Cross-stack engineering practice operating across bare-metal computer architecture,
              RFIC electromagnetic design, applied machine learning, and sovereign Linux systems.
              Built with zero abstraction bloat and sub-millimeter tolerances.
            </p>

            <div className="c1-hero-cta-row">
              <a href="#c1-work" className="c1-btn-primary">
                INSPECT ARTIFACTS [06]
              </a>
              <button
                type="button"
                className="c1-btn-ghost"
                onClick={() => setExplosionFactor((prev) => (prev === 0 ? 1 : 0))}
              >
                {explosionFactor === 0 ? 'EXPLODE GIMBAL ASSEMBLY [+] ' : 'COLLAPSE ASSEMBLY [-]'}
              </button>
            </div>

            <div className="c1-hero-metrics-strip">
              <div className="c1-metric-block">
                <span className="c1-metric-label">CORE TARGET</span>
                <strong className="c1-metric-val">AI HW // RFIC // RTL</strong>
              </div>
              <div className="c1-metric-block">
                <span className="c1-metric-label">VERIFIED NODES</span>
                <strong className="c1-metric-val">06 PRODUCTION SYSTEMS</strong>
              </div>
              <div className="c1-metric-block">
                <span className="c1-metric-label">SIGNATURE MARK</span>
                <strong className="c1-metric-val">SHINO // REV 3.0</strong>
              </div>
            </div>
          </div>

          {/* 3D Monolith Viewport */}
          <div className="c1-hero-stage-wrap c1-crosshair-box">
            <div className="c1-stage-hud-top">
              <span>ARTIFACT: INTERLOCKING TITANIUM GIMBAL</span>
              <span>PBR // ACES FILMIC</span>
            </div>
            <div ref={mountRef} className="c1-webgl-stage" aria-label="Interactive 3D Monolith" />
            <div className="c1-stage-hud-bottom">
              <div className="c1-slider-control">
                <label htmlFor="c1-explode-range">AXIS SEPARATION</label>
                <input
                  id="c1-explode-range"
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={explosionFactor}
                  onChange={(e) => setExplosionFactor(parseFloat(e.target.value))}
                />
              </div>
              <span className="c1-mono-dim">OMEGA: {telemetryAzimuth.rpm} RAD/S</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02: SELECTED WORK (ARCHITECTURAL MONOLITH INSPECTOR) */}
      <section id="c1-work" className="c1-section">
        <div className="c1-section-header">
          <div>
            <span className="c1-section-index">01 // SELECTED WORK</span>
            <h2 className="c1-section-title">ENGINEERED ARTIFACT REGISTRY</h2>
          </div>
          <p className="c1-section-sub">
            Select any structural slab below to inspect its hardware/software topology, verified
            telemetry benchmarks, and execution stack.
          </p>
        </div>

        <div className="c1-work-split">
          {/* Left Matrix Selector */}
          <div className="c1-project-list">
            {PROJECTS.map((proj) => {
              const active = proj.id === selectedProject.id;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => setSelectedProject(proj)}
                  className={`c1-project-slab ${active ? 'is-active' : ''}`}
                >
                  <div className="c1-slab-top">
                    <span className="c1-slab-code">{proj.code}</span>
                    <span className="c1-slab-mass">{proj.mass}</span>
                  </div>
                  <h3 className="c1-slab-title">{proj.title}</h3>
                  <div className="c1-slab-cat">{proj.category}</div>
                </button>
              );
            })}
          </div>

          {/* Right Deep Architectural Dossier */}
          <div className="c1-project-dossier c1-crosshair-box">
            <div className="c1-dossier-header">
              <div>
                <span className="c1-dossier-badge">{selectedProject.code}</span>
                <span className="c1-dossier-coords">{selectedProject.coordinates}</span>
              </div>
              <span className="c1-dossier-status">{selectedProject.status}</span>
            </div>

            <h3 className="c1-dossier-title">{selectedProject.title}</h3>
            <p className="c1-dossier-summary">{selectedProject.summary}</p>

            <div className="c1-telemetry-grid">
              {selectedProject.telemetry.map((t) => (
                <div key={t.label} className="c1-telemetry-cell">
                  <span className="c1-tel-label">{t.label}</span>
                  <strong className="c1-tel-val">{t.value}</strong>
                </div>
              ))}
            </div>

            <div className="c1-dossier-block">
              <h4 className="c1-subhead">STRUCTURAL TOPOLOGY &amp; PIPELINE</h4>
              <ul className="c1-arch-list">
                {selectedProject.architecture.map((item, idx) => (
                  <li key={idx}>
                    <span className="c1-arch-idx">0{idx + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="c1-dossier-block">
              <h4 className="c1-subhead">INSTRUMENTATION &amp; TOOLCHAIN</h4>
              <div className="c1-chip-cluster">
                {selectedProject.stack.map((tech) => (
                  <span key={tech} className="c1-tech-pill">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: CAPABILITIES */}
      <section id="c1-capabilities" className="c1-section">
        <div className="c1-section-header">
          <div>
            <span className="c1-section-index">02 // CAPABILITY MATRIX</span>
            <h2 className="c1-section-title">FOUR-TIER COMPUTE &amp; PHYSICS STACK</h2>
          </div>
          <p className="c1-section-sub">
            Vertical integration from electromagnetic waves and transistor gates up to autonomous AI
            inference runtimes.
          </p>
        </div>

        <div className="c1-capabilities-grid">
          {CAPABILITIES.map((cap) => (
            <article key={cap.index} className="c1-cap-card c1-crosshair-box">
              <div className="c1-cap-top">
                <span className="c1-cap-idx">TIER // {cap.index}</span>
                <span className="c1-cap-spec">{cap.spec}</span>
              </div>
              <h3 className="c1-cap-title">{cap.domain}</h3>
              <p className="c1-cap-body">{cap.detail}</p>
              <div className="c1-cap-footer">
                {cap.metrics.map((m) => (
                  <span key={m} className="c1-cap-tag">
                    {m}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 04: R&D LAB */}
      <section id="c1-lab" className="c1-section">
        <div className="c1-section-header">
          <div>
            <span className="c1-section-index">03 // EXPERIMENTAL TELEMETRY</span>
            <h2 className="c1-section-title">SIROSIU R&amp;D LAB</h2>
          </div>
          <p className="c1-section-sub">
            Low-level microkernels, neural signal processing filters, and hardware verification
            probes.
          </p>
        </div>

        <div className="c1-lab-grid">
          {LAB_EXPERIMENTS.map((item) => (
            <div key={item.code} className="c1-lab-slab">
              <div className="c1-lab-meta">
                <span className="c1-mono-accent">{item.code}</span>
                <span className="c1-mono-dim">{item.datum}</span>
              </div>
              <h3 className="c1-lab-title">{item.title}</h3>
              <p className="c1-lab-note">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 05: ABOUT & PHILOSOPHY */}
      <section id="c1-philosophy" className="c1-section">
        <div className="c1-philosophy-monolith c1-crosshair-box">
          <div className="c1-phil-left">
            <span className="c1-section-index">04 // ARCHITECTURAL CREDO</span>
            <h2 className="c1-phil-heading">
              ABSTRACTION WITHOUT MECHANICAL SYMPATHY IS STRUCTURAL DEBT.
            </h2>
            <div className="c1-signature-plate">
              <span>IDENTITY: ANKUSH MALOTHIA // SIROSIU</span>
              <span>MARK: SHINO // NIT JALANDHAR (ECE)</span>
            </div>
          </div>
          <div className="c1-phil-right">
            <p>
              Modern software often treats hardware as an infinitely elastic black box. SIROSIU is
              built on the opposite premise: true performance and elegance emerge only when you
              respect the physical medium—whether that is cache-line alignment on an x86/RISC-V die,
              dielectric loss in an RF substrate, or light transport across an anodized surface.
            </p>
            <p>
              Operating across Arch Linux (Hyprland), Cadence/ADS toolchains, Verilator RTL flows,
              and PyTorch tensor runtimes, every artifact under the <strong>SIROSIU</strong> banner
              is engineered as a self-contained, high-density instrument.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 06: WRITING / MONOGRAPHS */}
      <section id="c1-writing" className="c1-section">
        <div className="c1-section-header">
          <div>
            <span className="c1-section-index">05 // TECHNICAL DISPATCHES</span>
            <h2 className="c1-section-title">ENGINEERING MONOGRAPHS</h2>
          </div>
        </div>

        <div className="c1-writing-stack">
          {WRITINGS.map((post) => (
            <article key={post.id} className="c1-writing-row">
              <div className="c1-writing-meta">
                <span className="c1-mono-accent">{post.id}</span>
                <span className="c1-mono-dim">{post.date}</span>
                <span className="c1-tag-chip">{post.tag}</span>
              </div>
              <div className="c1-writing-main">
                <h3 className="c1-writing-title">{post.title}</h3>
                <p className="c1-writing-abstract">{post.abstract}</p>
              </div>
              <div className="c1-writing-action">
                <span className="c1-mono-dim">{post.readTime}</span>
                <span className="c1-arrow-indicator">READ SPEC →</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 07 & 08: NOW TELEMETRY + CONTACT DISPATCH */}
      <section id="c1-contact" className="c1-section">
        <div className="c1-bottom-split">
          {/* NOW STATUS */}
          <div className="c1-now-panel c1-crosshair-box">
            <span className="c1-section-index">06 // LIVE TELEMETRY (NOW)</span>
            <h3 className="c1-panel-title">NOVEMBER 2026 OPERATIONAL STATE</h3>
            <ul className="c1-now-list">
              <li>
                <span className="c1-now-key">RESEARCH FOCUS</span>
                <span className="c1-now-val">
                  Brain-Computer Interfaces (BCI) + Applied AI Accelerators &amp; RFIC
                </span>
              </li>
              <li>
                <span className="c1-now-key">ACTIVE BUILD</span>
                <span className="c1-now-val">
                  A.V.E. Autonomous Voice &amp; Memory Kernel + RV32I Superscalar Extensions
                </span>
              </li>
              <li>
                <span className="c1-now-key">ENVIRONMENT</span>
                <span className="c1-now-val">
                  Arch Linux // Hyprland // Lenovo LOQ i7-13650HX + RTX 4050
                </span>
              </li>
              <li>
                <span className="c1-now-key">CONDITIONING</span>
                <span className="c1-now-val">
                  6-Day Pull/Legs/Core Split // 5.2km Sub-18:35 Pace // Strict Calisthenics
                </span>
              </li>
            </ul>
          </div>

          {/* CONTACT TERMINAL */}
          <div className="c1-contact-panel c1-crosshair-box">
            <span className="c1-section-index">07 // DIRECT TRANSMISSION</span>
            <h3 className="c1-panel-title">INITIATE ENGINEERING DIALOGUE</h3>
            <p className="c1-contact-desc">
              Available for research collaborations, hardware/ML systems architecture roles, and
              deep-tech builds.
            </p>
            <div className="c1-contact-links">
              <a href="mailto:ankush@sirosiu.com" className="c1-contact-link-row">
                <span>DIRECT CHANNEL</span>
                <strong>ankush@sirosiu.com →</strong>
              </a>
              <a
                href="https://github.com/sirosiu"
                target="_blank"
                rel="noreferrer"
                className="c1-contact-link-row"
              >
                <span>GITHUB REPOSITORIES</span>
                <strong>github.com/sirosiu →</strong>
              </a>
              <a
                href="https://sirosiu.com"
                target="_blank"
                rel="noreferrer"
                className="c1-contact-link-row"
              >
                <span>PRIMARY DOMAIN</span>
                <strong>sirosiu.com // SHINO →</strong>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 09: ARCHITECTURAL FOOTER */}
      <footer className="c1-footer">
        <div className="c1-footer-inner">
          <div>
            <span className="c1-mono-strong">© 2026 SIROSIU // ANKUSH MALOTHIA</span>
            <span className="c1-mono-dim"> — ALL RIGHTS RESERVED.</span>
          </div>
          <div className="c1-mono-dim">SIGNATURE MARK: SHINO // PROTOTYPE 3.0 SPATIAL</div>
        </div>
      </footer>
    </div>
  );
};

export default Concept01Spatial;