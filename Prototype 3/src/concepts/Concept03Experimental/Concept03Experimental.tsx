import React, { useEffect, useRef, useState } from 'react';
import './ExperimentalStyles.css';

interface ExperimentalProject {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  energySignature: string;
  harmonicFreq: number;
  vorticityGain: number;
  chromaticSplit: number;
  summary: string;
  pipeline: string[];
  telemetry: { k: string; v: string; state: 'cobalt' | 'lime' | 'coral' }[];
  stack: string[];
}

const EXPERIMENTAL_PROJECTS: ExperimentalProject[] = [
  {
    id: 'ave',
    code: 'AI-SYS-01',
    title: 'A.V.E. // Autonomous Cognitive Attractor',
    subtitle: 'Sovereign Voice, Episodic Vector Memory & Local Transformer Runtime',
    energySignature: '4.20 GB VRAM // 184ms WAKE-TO-TOKEN',
    harmonicFreq: 0.0034,
    vorticityGain: 1.45,
    chromaticSplit: 2.2,
    summary:
      'Low-latency local cognitive runtime coupling real-time acoustic wake detection, HNSW episodic memory graphs, and quantized GGUF inference with deterministic OS syscall execution.',
    pipeline: [
      '[ALSA/PIPEWIRE] → Lock-free PCM ring buffer streaming into C++ Whisper VAD',
      '[HNSW + SQLITE WAL] → Hybrid semantic-episodic memory recall in less than 12ms',
      '[LLAMA.CPP INT4] → Speculative token decoding & typed Rust/Python tool dispatch',
    ],
    telemetry: [
      { k: 'WAKE LATENCY', v: '184 ms', state: 'lime' },
      { k: 'MEMORY RECALL', v: '99.2% @ K=5', state: 'cobalt' },
      { k: 'QUANTIZATION', v: 'INT4_K_M', state: 'coral' },
      { k: 'CLOUD DEPENDENCY', v: '0.00% (ZERO)', state: 'lime' },
    ],
    stack: ['Rust', 'C++20', 'Python', 'llama.cpp', 'SQLite WAL', 'PipeWire'],
  },
  {
    id: 'fraudlens',
    code: 'ML-SYS-02',
    title: 'FraudLens // Temporal Graph Vortex Engine',
    subtitle: 'High-Frequency Financial Stream Anomaly Scoring & SHAP Attribution',
    energySignature: '14,800 TPS // 6.4ms P99 TAIL',
    harmonicFreq: 0.0052,
    vorticityGain: 1.85,
    chromaticSplit: 2.8,
    summary:
      'Real-time transaction graph anomaly detector fusing sliding-window velocity tensors, XGBoost + TabNet ensembles, and inline SHAP compliance telemetry.',
    pipeline: [
      '[REDIS STREAMS] → Sub-2ms temporal velocity & graph centrality extraction',
      '[HYBRID ENSEMBLE] → Calibrated GBDT + residual neural probability scoring',
      '[SHAP AUDITOR] → Real-time feature attribution vector emitted per transaction',
    ],
    telemetry: [
      { k: 'P99 TAIL LATENCY', v: '6.4 ms', state: 'lime' },
      { k: 'PR-AUC SCORE', v: '0.964', state: 'cobalt' },
      { k: 'FP SUPPRESSION', v: '-41.8%', state: 'coral' },
      { k: 'STREAM RATE', v: '14.8K tx/s', state: 'lime' },
    ],
    stack: ['PyTorch', 'XGBoost', 'ONNX Runtime', 'FastAPI', 'Redis Streams', 'SHAP'],
  },
  {
    id: 'antenna-sim',
    code: 'EM-RF-03',
    title: 'Maxwell // 3D Electromagnetic Field Solver',
    subtitle: 'Full-Wave Radiation Synthesis & Automated Smith Impedance Matching',
    energySignature: '2.4GHz–28GHz // S11 -28.4 dB',
    harmonicFreq: 0.0068,
    vorticityGain: 1.25,
    chromaticSplit: 1.9,
    summary:
      'Computational electromagnetics engine resolving 3D far-field directivity tensors, surface current densities, and quarter-wave stub matching networks.',
    pipeline: [
      '[MAXWELL CURL] → Spherical coordinate far-field E/H radiation tensor integration',
      '[SMITH SYNTHESIS] → Automated complex conjugate impedance transformation (50Ω)',
      '[SURFACE CURRENT] → Conductive skin-depth & dielectric loss tangent profiling',
    ],
    telemetry: [
      { k: 'RETURN LOSS (S11)', v: '-28.4 dB', state: 'lime' },
      { k: 'PEAK GAIN', v: '8.72 dBi', state: 'cobalt' },
      { k: 'VSWR ENVELOPE', v: '1.14 : 1', state: 'lime' },
      { k: 'EFFICIENCY', v: '93.6%', state: 'coral' },
    ],
    stack: ['Keysight ADS', 'Python', 'NumPy / SciPy', 'Smith CAD', 'MATLAB'],
  },
  {
    id: 'rv32i-core',
    code: 'ARCH-RTL-04',
    title: 'RV32I // 5-Stage Pipelined Silicon Core',
    subtitle: 'Synthesizable RISC-V Processor with Hazard Forwarding & Branch Logic',
    energySignature: '185 MHz SYNTH // 1.18 CPI',
    harmonicFreq: 0.0026,
    vorticityGain: 1.6,
    chromaticSplit: 2.4,
    summary:
      'Deterministic 32-bit RISC-V microarchitecture written in pure Verilog HDL with EX/MEM & MEM/WB bypass multiplexers and Verilator cycle verification.',
    pipeline: [
      '[IF → ID → EX] → Instruction decode with single-cycle load-use stall interlock',
      '[FORWARDING UNIT] → Zero-stall register bypass across EX/MEM and MEM/WB stages',
      '[VERILATOR + YOSYS] → Cycle-accurate C++ waveform assertions & FPGA synthesis',
    ],
    telemetry: [
      { k: 'MAX CLOCK (ARTIX-7)', v: '185 MHz', state: 'lime' },
      { k: 'PIPELINE CPI', v: '1.18 Cycles', state: 'cobalt' },
      { k: 'LOGIC FOOTPRINT', v: '1,840 LUTs', state: 'coral' },
      { k: 'ISA COMPLIANCE', v: 'RV32I Base', state: 'lime' },
    ],
    stack: ['Verilog HDL', 'Verilator', 'Yosys', 'GTKWave', 'Xilinx Vivado', 'C++'],
  },
  {
    id: 'patch-array',
    code: 'EM-RF-05',
    title: 'Helios // 28GHz Phased Microstrip Array',
    subtitle: '4x4 Corporate Wilkinson Feed & Defected Ground Beamforming',
    energySignature: '16.4 dBi GAIN // ±42° STEERING',
    harmonicFreq: 0.0074,
    vorticityGain: 1.95,
    chromaticSplit: 3.1,
    summary:
      'Millimeter-wave phased patch array on Rogers RO4003C laminate engineered with corporate phase distribution and mutual-coupling isolation slots.',
    pipeline: [
      '[RO4003C LAMINATE] → Inset-fed microstrip patch synthesis @ 28.0 GHz carrier',
      '[WILKINSON FEED] → Corporate quarter-wave power divider with phase-taper control',
      '[DGS ISOLATION] → Defected ground slots suppressing surface-wave coupling below -24dB',
    ],
    telemetry: [
      { k: 'REALIZED GAIN', v: '16.4 dBi', state: 'lime' },
      { k: 'SIDE-LOBE LEVEL', v: '-19.2 dB', state: 'cobalt' },
      { k: 'SCAN SECTOR', v: '±42° Azimuth', state: 'coral' },
      { k: 'SUBSTRATE TAN δ', v: '0.0027', state: 'lime' },
    ],
    stack: ['Keysight ADS', 'HFSS / EM Pro', 'Rogers RO4003C', 'mmWave Layout'],
  },
  {
    id: 'portfolio-sys',
    code: 'SYS-WEB-06',
    title: 'SIROSIU // Multi-Paradigm Generative Kernel',
    subtitle: 'Real-Time Curl Advection, PBR Monoliths & EDA Instrumentation',
    energySignature: '60 FPS LOCK // SUB-6ms FRAME',
    harmonicFreq: 0.0042,
    vorticityGain: 1.55,
    chromaticSplit: 2.5,
    summary:
      'Bespoke four-world engineering showcase integrating divergence-free fluid advection, Three.js physical artifacts, Swiss print grids, and interactive schematics.',
    pipeline: [
      '[CURL ADVECTION] → Analytical simplex potential derivatives (∇ · v = 0)',
      '[CHROMATIC SPLIT] → Velocity-mapped RGB sub-stroke dispersion on HTML5 Canvas',
      '[ZERO OVERFLOW] → Fluid CSS Grid mathematics resilient from 320px to 4K',
    ],
    telemetry: [
      { k: 'FRAME TIME', v: '5.8 ms', state: 'lime' },
      { k: 'PARTICLE NODES', v: '1,800 Active', state: 'cobalt' },
      { k: 'DIVERGENCE', v: '0.000 (Exact)', state: 'coral' },
      { k: 'SIGNATURE KERNEL', v: 'SHINO v3.0', state: 'lime' },
    ],
    stack: ['TypeScript', 'React', 'WebGL / Three.js', 'Canvas 2D', 'Simplex Math'],
  },
];

const CAPABILITY_CLUSTERS = [
  {
    id: 'CAP-01',
    title: 'DIVERGENCE-FREE COMPUTE & RTL',
    tag: 'SILICON // VERILOG // RISC-V',
    desc: 'Custom 5-stage pipelined processor cores, hazard resolution interlocks, SIMD matrix microkernels, and cycle-accurate Verilator/GTKWave simulation.',
    freq: '850 MHz – 1.8 GHz',
  },
  {
    id: 'CAP-02',
    title: 'ELECTROMAGNETIC WAVE SYNTHESIS',
    tag: 'RFIC // 28GHz // KEYSIGHT ADS',
    desc: 'Full-wave Maxwell field solving, microstrip phased arrays, corporate Wilkinson feeds, and complex Smith Chart impedance transformation.',
    freq: '2.4 GHz – 28.0 GHz',
  },
  {
    id: 'CAP-03',
    title: 'NEURAL & BCI SIGNAL INFERENCE',
    tag: 'LOCAL AI // EEG DSP // PYTORCH',
    desc: 'Quantized local transformer runtimes (A.V.E.), non-invasive EEG motor-imagery wavelet classifiers, and sub-10ms streaming graph anomaly engines.',
    freq: '8 Hz – 40 Hz (Mu/Beta)',
  },
  {
    id: 'CAP-04',
    title: 'SOVEREIGN LINUX & CREATIVE SYSTEMS',
    tag: 'RUST // C++ // ARCH HYPRLAND',
    desc: 'Zero-copy DMA/audio ring buffers, multiboot Linux kernel environments, real-time curl-noise shaders, and high-density telemetry interfaces.',
    freq: '60 FPS // 0-COPY IPC',
  },
];

const SHADER_LAB_EXPERIMENTS = [
  {
    id: 'EXP // 01',
    name: 'Curl-Noise Potential Advection',
    equation: 'v(x,y) = (∂Ψ/∂y, -∂Ψ/∂x)',
    status: 'LIVE IN VIEWPORT',
    detail: 'Incompressible 2D velocity field preventing particle clustering while generating infinite laminar-to-turbulent filaments.',
  },
  {
    id: 'EXP // 02',
    name: 'BCI Sensorimotor Phase-Locking',
    equation: 'PLV = |N⁻¹ Σ exp(i(φ₁ - φ₂))|',
    status: 'EEG LAB KERNEL',
    detail: 'Instantaneous Hilbert phase synchronization across C3/C4 cortical channels during imagined hand kinematics.',
  },
  {
    id: 'EXP // 03',
    name: 'AVX2 INT8 GEMM Tile Kernel',
    equation: 'C[i,j] += Σ A_int8[i,k] · B_int8[k,j]',
    status: 'BENCHMARKED',
    detail: 'Register-blocked matrix multiplication saturating L1d cache bandwidth on Intel Raptor Lake HX silicon.',
  },
  {
    id: 'EXP // 04',
    name: 'Chromatic Velocity Dispersion',
    equation: 'Δx_rgb = ±κ · ||v(t)||₂ · n̂',
    status: 'OPTICAL PASS',
    detail: 'Splitting particle trajectories into offset Cobalt (#3b82f6), Acid Lime (#a3e635), and Coral (#f43f5e) vectors under high acceleration.',
  },
];

const DISPATCH_LOGS = [
  {
    stamp: 'LOG_2026.10.28',
    topic: 'ARCHITECTURE',
    title: 'Inside the Forwarding Mux: Why Naive RISC-V Pipelines Bleed Cycles',
    summary: 'Tracing RAW data hazards across EX/MEM and MEM/WB boundaries and proving minimal critical-path delay in Verilog.',
  },
  {
    stamp: 'LOG_2026.09.19',
    topic: 'ELECTROMAGNETICS',
    title: 'Suppressing Surface Waves in 28GHz Phased Arrays via Defected Ground Slots',
    summary: 'How periodic ground-plane apertures eliminate mutual coupling degradation during wide-angle beam steering.',
  },
  {
    stamp: 'LOG_2026.08.04',
    topic: 'LOCAL AI SYSTEMS',
    title: 'Engineering A.V.E.: Episodic Memory Graphs & Zero-Copy Voice Pipelines on Arch Linux',
    summary: 'Replacing cloud APIs with local GGUF quantization, HNSW vector indexing, and deterministic Rust tool execution.',
  },
];

export const Concept03Experimental: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeProject, setActiveProject] = useState<ExperimentalProject>(EXPERIMENTAL_PROJECTS[0]);

  // Live Interactive Field Controls
  const [curlScale, setCurlScale] = useState<number>(0.0038);
  const [turbulenceGain, setTurbulenceGain] = useState<number>(1.5);
  const [dispersionOffset, setDispersionOffset] = useState<number>(2.2);
  const [trailPersistence, setTrailPersistence] = useState<number>(0.91);
  const [gravityWellActive, setGravityWellActive] = useState<boolean>(false);

  const [hudMetrics, setHudMetrics] = useState({
    meanSpeed: '2.84',
    peakVorticity: '1.92',
    reynolds: '4,120',
    cursorVec: '(0.0, 0.0)',
  });

  // Keep refs synced for 60fps animation loop without re-binding canvas
  const paramsRef = useRef({
    curlScale,
    turbulenceGain,
    dispersionOffset,
    trailPersistence,
    gravityWellActive,
  });

  useEffect(() => {
    paramsRef.current = {
      curlScale,
      turbulenceGain,
      dispersionOffset,
      trailPersistence,
      gravityWellActive,
    };
  }, [curlScale, turbulenceGain, dispersionOffset, trailPersistence, gravityWellActive]);

  // Sync field harmonics when user selects a different project attractor
  const handleSelectProject = (proj: ExperimentalProject) => {
    setActiveProject(proj);
    setCurlScale(proj.harmonicFreq);
    setTurbulenceGain(proj.vorticityGain);
    setDispersionOffset(proj.chromaticSplit);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 640);

    const PARTICLE_COUNT = 1650;
    const particles: {
      x: number;
      y: number;
      px: number;
      py: number;
      vx: number;
      vy: number;
      speed: number;
    }[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({ x, y, px: x, py: y, vx: 0, vy: 0, speed: 0 });
    }

    const pointer = {
      x: width * 0.5,
      y: height * 0.5,
      vx: 0,
      vy: 0,
      active: false,
      down: false,
    };

    // Multi-octave trigonometric harmonic scalar potential field Ψ(x, y, t)
    const scalarPotential = (x: number, y: number, t: number, scale: number) => {
      const s1 = scale;
      const s2 = scale * 2.15;
      const s3 = scale * 4.3;
      return (
        Math.sin(x * s1 + t * 0.65) * Math.cos(y * s1 - t * 0.48) +
        0.55 * Math.sin(x * s2 - y * s2 + t * 1.15) +
        0.25 * Math.cos(x * s3 + y * s2 - t * 1.7)
      );
    };

    // Divergence-free Curl: v = (∂Ψ/∂y, -∂Ψ/∂x)
    const computeCurl = (x: number, y: number, t: number, scale: number, gain: number) => {
      const eps = 1.6;
      const dPsiDy =
        (scalarPotential(x, y + eps, t, scale) - scalarPotential(x, y - eps, t, scale)) /
        (2 * eps);
      const dPsiDx =
        (scalarPotential(x + eps, y, t, scale) - scalarPotential(x - eps, y, t, scale)) /
        (2 * eps);
      const amp = 340 * gain;
      return { vx: dPsiDy * amp, vy: -dPsiDx * amp };
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      pointer.vx = nx - pointer.x;
      pointer.vy = ny - pointer.y;
      pointer.x = nx;
      pointer.y = ny;
      pointer.active = true;
    };

    const onPointerDown = () => {
      pointer.down = true;
    };
    const onPointerUp = () => {
      pointer.down = false;
    };

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 320;
      height = canvas.height = canvas.parentElement.clientHeight || 560;
      ctx.fillStyle = '#080811';
      ctx.fillRect(0, 0, width, height);
    };

    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('resize', onResize);

    ctx.fillStyle = '#080811';
    ctx.fillRect(0, 0, width, height);

    let time = 0;
    let frameCount = 0;
    let rafId = 0;

    const renderLoop = () => {
      rafId = requestAnimationFrame(renderLoop);
      time += 0.011;
      frameCount++;

      const {
        curlScale: cScale,
        turbulenceGain: tGain,
        dispersionOffset: disp,
        trailPersistence: persist,
        gravityWellActive: wellMode,
      } = paramsRef.current;

      // Frame accumulation decay in deep midnight abyss (#080811)
      ctx.globalCompositeOperation = 'source-over';
      const alphaDecay = Math.max(0.03, Math.min(0.25, 1 - persist));
      ctx.fillStyle = `rgba(8, 8, 17, ${alphaDecay.toFixed(3)})`;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = 1.15;

      let speedSum = 0;
      let maxSpeed = 0;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        p.px = p.x;
        p.py = p.y;

        const curl = computeCurl(p.x, p.y, time, cScale, tGain);
        let vx = curl.vx;
        let vy = curl.vy;

        // Cursor Vortex & Singularity Interaction
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distSq = dx * dx + dy * dy + 120;
          const radiusSq = 54000;

          if (distSq < radiusSq) {
            const falloff = 1 - distSq / radiusSq;
            if (pointer.down || wellMode) {
              // Gravitational Attractor + Tangential Swirl
              vx += (-dx * 0.035 - dy * 0.045) * falloff * 3.2;
              vy += (-dy * 0.035 + dx * 0.045) * falloff * 3.2;
            } else {
              // Kinetic Cursor Wake Injection
              vx += (-dy * 0.03 + pointer.vx * 0.32) * falloff * 2.6;
              vy += (dx * 0.03 + pointer.vy * 0.32) * falloff * 2.6;
            }
          }
        }

        p.vx = p.vx * 0.45 + vx * 0.55;
        p.vy = p.vy * 0.45 + vy * 0.55;
        p.x += p.vx;
        p.y += p.vy;

        const spd = Math.hypot(p.vx, p.vy);
        p.speed = spd;
        speedSum += spd;
        if (spd > maxSpeed) maxSpeed = spd;

        // Toroidal Boundary Wrap
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          p.px = p.x;
          p.py = p.y;
        }

        // Velocity-Mapped Chromatic Dispersion
        if (spd > 3.6) {
          // Peak kinetic energy: Acid Lime (#a3e635) core + Coral (#f43f5e) & Cobalt (#3b82f6) chromatic split
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.58)';
          ctx.beginPath();
          ctx.moveTo(p.px - disp, p.py - disp * 0.5);
          ctx.lineTo(p.x - disp, p.y - disp * 0.5);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(59, 130, 246, 0.52)';
          ctx.beginPath();
          ctx.moveTo(p.px + disp, p.py + disp * 0.5);
          ctx.lineTo(p.x + disp, p.y + disp * 0.5);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(163, 230, 53, 0.92)';
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else if (spd > 2.1) {
          // Mid acceleration: Coral (#f43f5e) + Cobalt (#3b82f6)
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.52)';
          ctx.beginPath();
          ctx.moveTo(p.px - disp * 0.5, p.py);
          ctx.lineTo(p.x - disp * 0.5, p.y);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(59, 130, 246, 0.65)';
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else {
          // Laminar flow: Electric Cobalt (#3b82f6)
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.38)';
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }

      pointer.vx *= 0.88;
      pointer.vy *= 0.88;

      if (frameCount % 14 === 0) {
        const mean = speedSum / PARTICLE_COUNT;
        setHudMetrics({
          meanSpeed: mean.toFixed(2),
          peakVorticity: (maxSpeed * 0.42).toFixed(2),
          reynolds: Math.round(mean * 1450 * tGain).toLocaleString(),
          cursorVec: `(${pointer.vx.toFixed(1)}, ${pointer.vy.toFixed(1)})`,
        });
      }
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="c3-exp-root">
      {/* Floating HUD Navigation Bar */}
      <header className="c3-hud-header">
        <div className="c3-hud-brand">
          <span className="c3-pulse-beacon" />
          <span className="c3-mono-lime">SIROSIU // SHINO</span>
          <span className="c3-mono-cobalt">CONCEPT 03 — LIVING CURL FIELD</span>
        </div>

        <nav className="c3-hud-nav" aria-label="Experimental Navigation">
          <a href="#c3-field">00.FIELD</a>
          <a href="#c3-attractors">01.ATTRACTORS</a>
          <a href="#c3-capabilities">02.SPECTRA</a>
          <a href="#c3-lab">03.LAB_KERNELS</a>
          <a href="#c3-manifesto">04.THEORY</a>
          <a href="#c3-logs">05.LOGS</a>
          <a href="#c3-uplink">06.UPLINK</a>
        </nav>

        <div className="c3-hud-telemetry-pill">
          <span>Re: {hudMetrics.reynolds}</span>
          <span className="c3-coral-text">ω: {hudMetrics.peakVorticity} rad/s</span>
        </div>
      </header>

      {/* SECTION 01: HERO GENERATIVE VECTOR FIELD */}
      <section id="c3-field" className="c3-hero-stage">
        <canvas
          ref={canvasRef}
          className="c3-curl-canvas"
          aria-label="Interactive divergence-free curl noise particle field"
        />

        <div className="c3-hero-overlay-grid">
          {/* Left Hero Manifesto Glass Card */}
          <div className="c3-glass-card c3-hero-card">
            <div className="c3-kicker-row">
              <span className="c3-badge-lime">DIVERGENCE-FREE // ∇ · v = 0</span>
              <span className="c3-mono-muted">ANKUSH MALOTHIA (SIROSIU)</span>
            </div>

            <h1 className="c3-hero-display">
              EMERGENT
              <br />
              <span className="c3-gradient-text">COMPUTATIONAL</span>
              <br />
              DYNAMICS.
            </h1>

            <p className="c3-hero-lead">
              Digital experimentation studio and deep-tech engineering lab exploring the boundary
              where <strong>silicon microarchitecture</strong>,{' '}
              <strong>electromagnetic wave propagation</strong>, and{' '}
              <strong>autonomous neural systems</strong> converge into living mathematical systems.
            </p>

            <div className="c3-chromatic-legend">
              <div className="c3-legend-item">
                <span className="c3-dot-cobalt" />
                <span>LAMINAR FLOW (#3b82f6)</span>
              </div>
              <div className="c3-legend-item">
                <span className="c3-dot-coral" />
                <span>SHEAR VORTICITY (#f43f5e)</span>
              </div>
              <div className="c3-legend-item">
                <span className="c3-dot-lime" />
                <span>SINGULARITY PEAK (#a3e635)</span>
              </div>
            </div>

            <div className="c3-hero-actions">
              <a href="#c3-attractors" className="c3-btn-lime">
                MODULATE PROJECT ATTRACTORS [06]
              </a>
              <button
                type="button"
                className={`c3-btn-singularity ${gravityWellActive ? 'is-active' : ''}`}
                onClick={() => setGravityWellActive((v) => !v)}
              >
                {gravityWellActive ? 'SINGULARITY WELL: LOCKED' : 'INJECT GRAVITY SINGULARITY'}
              </button>
            </div>
          </div>

          {/* Right Live Physics Synthesizer HUD */}
          <aside className="c3-glass-card c3-synth-console">
            <div className="c3-console-header">
              <span className="c3-mono-lime">CURL FIELD SYNTHESIZER // HUD v3.0</span>
              <span className="c3-mono-cobalt">1,650 PARTICLES</span>
            </div>

            <div className="c3-control-stack">
              <div className="c3-control-row">
                <div className="c3-control-label">
                  <span>HARMONIC FREQUENCY (Ψ)</span>
                  <strong className="c3-mono-lime">{(curlScale * 1000).toFixed(2)} mHz</strong>
                </div>
                <input
                  type="range"
                  min="0.0015"
                  max="0.0085"
                  step="0.0002"
                  value={curlScale}
                  onChange={(e) => setCurlScale(parseFloat(e.target.value))}
                />
              </div>

              <div className="c3-control-row">
                <div className="c3-control-label">
                  <span>VORTICITY GAIN (ω)</span>
                  <strong className="c3-mono-cobalt">{turbulenceGain.toFixed(2)}x</strong>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="2.6"
                  step="0.05"
                  value={turbulenceGain}
                  onChange={(e) => setTurbulenceGain(parseFloat(e.target.value))}
                />
              </div>

              <div className="c3-control-row">
                <div className="c3-control-label">
                  <span>CHROMATIC DISPERSION (ΔRGB)</span>
                  <strong className="c3-coral-text">{dispersionOffset.toFixed(1)} px</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4.5"
                  step="0.1"
                  value={dispersionOffset}
                  onChange={(e) => setDispersionOffset(parseFloat(e.target.value))}
                />
              </div>

              <div className="c3-control-row">
                <div className="c3-control-label">
                  <span>FRAME PERSISTENCE (τ)</span>
                  <strong className="c3-mono-lime">{(trailPersistence * 100).toFixed(0)}%</strong>
                </div>
                <input
                  type="range"
                  min="0.78"
                  max="0.97"
                  step="0.01"
                  value={trailPersistence}
                  onChange={(e) => setTrailPersistence(parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className="c3-live-readout-grid">
              <div className="c3-readout-cell">
                <span>MEAN VELOCITY</span>
                <strong>{hudMetrics.meanSpeed} px/f</strong>
              </div>
              <div className="c3-readout-cell">
                <span>PEAK VORTICITY</span>
                <strong className="c3-coral-text">{hudMetrics.peakVorticity} rad/s</strong>
              </div>
              <div className="c3-readout-cell">
                <span>REYNOLDS EST.</span>
                <strong className="c3-mono-lime">{hudMetrics.reynolds}</strong>
              </div>
              <div className="c3-readout-cell">
                <span>CURSOR IMPULSE</span>
                <strong className="c3-mono-cobalt">{hudMetrics.cursorVec}</strong>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* SECTION 02: SELECTED WORK — ATTRACTOR NODES */}
      <section id="c3-attractors" className="c3-section">
        <div className="c3-section-head">
          <div>
            <span className="c3-eyebrow-lime">01 // KINETIC SYSTEM ARCHIVE</span>
            <h2 className="c3-section-title">SIX PRODUCTION ATTRACTOR NODES</h2>
          </div>
          <p className="c3-section-desc">
            Selecting any node below re-tunes the live harmonic curl field above to match that
            system’s frequency, vorticity, and chromatic signature.
          </p>
        </div>

        <div className="c3-attractor-layout">
          {/* Left 6-Node Selector Matrix */}
          <div className="c3-node-Selector-grid">
            {EXPERIMENTAL_PROJECTS.map((proj) => {
              const isSelected = proj.id === activeProject.id;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => handleSelectProject(proj)}
                  className={`c3-node-card ${isSelected ? 'is-selected' : ''}`}
                >
                  <div className="c3-node-top">
                    <span className="c3-mono-lime">{proj.code}</span>
                    <span className="c3-mono-coral">
                      Ψ {(proj.harmonicFreq * 1000).toFixed(1)} mHz
                    </span>
                  </div>
                  <h3 className="c3-node-title">{proj.title}</h3>
                  <div className="c3-node-energy">{proj.energySignature}</div>
                </button>
              );
            })}
          </div>

          {/* Right Active Attractor Telemetry Inspector */}
          <div className="c3-glass-card c3-inspector-stage">
            <div className="c3-inspector-top">
              <div>
                <span className="c3-badge-cobalt">{activeProject.code}</span>
                <span className="c3-mono-lime">{activeProject.energySignature}</span>
              </div>
              <span className="c3-mono-coral">
                FIELD LOCKED // GAIN {activeProject.vorticityGain}x
              </span>
            </div>

            <h3 className="c3-inspector-title">{activeProject.title}</h3>
            <p className="c3-inspector-sub">{activeProject.subtitle}</p>
            <p className="c3-inspector-body">{activeProject.summary}</p>

            <div className="c3-inspector-metrics">
              {activeProject.telemetry.map((m) => (
                <div key={m.k} className={`c3-metric-box is-${m.state}`}>
                  <span>{m.k}</span>
                  <strong>{m.v}</strong>
                </div>
              ))}
            </div>

            <div className="c3-pipeline-terminal">
              <div className="c3-terminal-bar">SIGNAL FLOW &amp; EXECUTION TOPOLOGY</div>
              {activeProject.pipeline.map((line, idx) => (
                <div key={idx} className="c3-terminal-line">
                  <span className="c3-mono-lime">0{idx + 1}</span>
                  <code>{line}</code>
                </div>
              ))}
            </div>

            <div className="c3-stack-row">
              {activeProject.stack.map((tech) => (
                <span key={tech} className="c3-stack-chip">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: CAPABILITIES — SPECTRAL DOMAINS */}
      <section id="c3-capabilities" className="c3-section">
        <div className="c3-section-head">
          <div>
            <span className="c3-eyebrow-lime">02 // SPECTRAL CAPABILITIES</span>
            <h2 className="c3-section-title">CROSS-DOMAIN FREQUENCY RESPONSE</h2>
          </div>
        </div>

        <div className="c3-spectra-grid">
          {CAPABILITY_CLUSTERS.map((cap) => (
            <article key={cap.id} className="c3-glass-card c3-spectrum-card">
              <div className="c3-spectrum-top">
                <span className="c3-mono-cobalt">{cap.id}</span>
                <span className="c3-mono-lime">{cap.freq}</span>
              </div>
              <div className="c3-mono-coral c3-spectrum-tag">{cap.tag}</div>
              <h3>{cap.title}</h3>
              <p>{cap.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 04: PROCEDURAL & MATHEMATICAL LAB */}
      <section id="c3-lab" className="c3-section">
        <div className="c3-section-head">
          <div>
            <span className="c3-eyebrow-lime">03 // MATHEMATICAL SANDBOX</span>
            <h2 className="c3-section-title">PROCEDURAL &amp; NEURAL KERNELS</h2>
          </div>
        </div>

        <div className="c3-lab-matrix">
          {SHADER_LAB_EXPERIMENTS.map((exp) => (
            <div key={exp.id} className="c3-glass-card c3-lab-cell">
              <div className="c3-lab-cell-head">
                <span className="c3-mono-lime">{exp.id}</span>
                <span className="c3-badge-cobalt">{exp.status}</span>
              </div>
              <h3>{exp.name}</h3>
              <div className="c3-equation-box">{exp.equation}</div>
              <p>{exp.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 05: ABOUT & PHILOSOPHY */}
      <section id="c3-manifesto" className="c3-section">
        <div className="c3-glass-card c3-manifesto-slab">
          <div className="c3-manifesto-left">
            <span className="c3-eyebrow-lime">04 // STUDIO THESIS</span>
            <h2>
              NATURE DOES NOT SEPARATE <span>HARDWARE</span> FROM <span>SOFTWARE</span>.
            </h2>
            <div className="c3-identity-stamp">
              <span>PRINCIPAL ARCHITECT: ANKUSH MALOTHIA (SIROSIU)</span>
              <span>SIGNATURE KERNEL: SHINO // NIT JALANDHAR ECE</span>
            </div>
          </div>
          <div className="c3-manifesto-right">
            <p>
              Whether you are routing a 28GHz microstrip phased array, resolving pipeline hazards in
              a RISC-V processor core, decoding motor-imagery EEG waves, or advecting 1,650
              particles through a divergence-free curl field, the governing truth is identical:
              <strong> information is physical</strong>.
            </p>
            <p>
              SIROSIU operates as an independent creative engineering laboratory where low-level
              systems discipline (C++, Rust, Verilog, Arch Linux) collides with high-craft visual
              instrumentation. No templates, no black boxes—only raw mathematical execution.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 06: WRITING / RESEARCH LOGS */}
      <section id="c3-logs" className="c3-section">
        <div className="c3-section-head">
          <div>
            <span className="c3-eyebrow-lime">05 // RESEARCH TRANSMISSIONS</span>
            <h2 className="c3-section-title">FIELD LOGS &amp; TECHNICAL PAPERS</h2>
          </div>
        </div>

        <div className="c3-logs-list">
          {DISPATCH_LOGS.map((log) => (
            <article key={log.stamp} className="c3-glass-card c3-log-row">
              <div className="c3-log-meta">
                <span className="c3-mono-lime">{log.stamp}</span>
                <span className="c3-badge-cobalt">{log.topic}</span>
              </div>
              <div className="c3-log-content">
                <h3>{log.title}</h3>
                <p>{log.summary}</p>
              </div>
              <div className="c3-log-cta">
                <span className="c3-mono-coral">DECODE LOG →</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 07 & 08: NOW TELEMETRY + UPLINK CONTACT */}
      <section id="c3-uplink" className="c3-section">
        <div className="c3-uplink-grid">
          <div className="c3-glass-card c3-now-box">
            <span className="c3-eyebrow-lime">06 // REAL-TIME STATE (NOW — NOV 2026)</span>
            <h3>ACTIVE RUNTIME VECTORS</h3>
            <ul className="c3-now-stream">
              <li>
                <span className="c3-mono-cobalt">[VECTOR_01]</span>
                <span>
                  Scaling <strong>A.V.E.</strong> autonomous voice &amp; episodic memory engine on
                  local Linux silicon.
                </span>
              </li>
              <li>
                <span className="c3-mono-lime">[VECTOR_02]</span>
                <span>
                  Investigating non-invasive <strong>Brain-Computer Interfaces (BCI)</strong> &amp;
                  neural spectral decoding alongside applied AI accelerators.
                </span>
              </li>
              <li>
                <span className="c3-mono-coral">[VECTOR_03]</span>
                <span>
                  B.Tech ECE (3rd Year / 5th Sem) at <strong>NIT Jalandhar</strong> // Multi-boot
                  Arch Linux + Hyprland workstation.
                </span>
              </li>
              <li>
                <span className="c3-mono-lime">[VECTOR_04]</span>
                <span>
                  Physical conditioning: 6-day resistance split, 18:32 5.2km pace, strict pull-up
                  to muscle-up progression.
                </span>
              </li>
            </ul>
          </div>

          <div className="c3-glass-card c3-contact-box">
            <span className="c3-eyebrow-lime">07 // OPEN COMMUNICATION CHANNEL</span>
            <h3>ESTABLISH DIRECT UPLINK</h3>
            <p>
              Open for deep-tech engineering collaborations, AI/hardware research, and bespoke
              computational systems.
            </p>
            <div className="c3-uplink-buttons">
              <a href="mailto:ankush@sirosiu.com" className="c3-uplink-row">
                <span>PRIMARY SIGNAL</span>
                <strong className="c3-mono-lime">ankush@sirosiu.com ↗</strong>
              </a>
              <a
                href="https://github.com/sirosiu"
                target="_blank"
                rel="noreferrer"
                className="c3-uplink-row"
              >
                <span>CODE REPOSITORIES</span>
                <strong className="c3-mono-cobalt">github.com/sirosiu ↗</strong>
              </a>
              <a
                href="https://sirosiu.com"
                target="_blank"
                rel="noreferrer"
                className="c3-uplink-row"
              >
                <span>MASTER NODE</span>
                <strong className="c3-mono-coral">sirosiu.com // SHINO ↗</strong>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 09: FOOTER */}
      <footer className="c3-footer">
        <div className="c3-footer-wrap">
          <span>© 2026 SIROSIU // ANKUSH MALOTHIA — EXPERIMENTAL GENERATIVE SYSTEMS</span>
          <span className="c3-mono-lime">KERNEL: SHINO // CONCEPT 03 LIVE</span>
        </div>
      </footer>
    </div>
  );
};

export default Concept03Experimental;