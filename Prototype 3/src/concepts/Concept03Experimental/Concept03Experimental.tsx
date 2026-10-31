// Concept03Experimental.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import './ExperimentalStyles.css';

export type FieldMode = 'CURL_FLUID' | 'CLIFFORD_ATTRACTOR' | 'POYNTING_RF' | 'QUANTUM_WAVE';
export type PaletteId = 'CYBER_ACID' | 'SOLAR_PLASMA' | 'NEON_EMERALD' | 'QUANTUM_SILVER';

interface PaletteSpec {
  id: PaletteId;
  label: string;
  abyss: string;
  abyssRgb: string;
  primary: string;
  primaryRgb: string;
  secondary: string;
  secondaryRgb: string;
  tertiary: string;
  tertiaryRgb: string;
}

const PALETTES: Record<PaletteId, PaletteSpec> = {
  CYBER_ACID: {
    id: 'CYBER_ACID',
    label: 'CYBER_ACID',
    abyss: '#080811',
    abyssRgb: '8, 8, 17',
    primary: '#a3e635',
    primaryRgb: '163, 230, 53',
    secondary: '#3b82f6',
    secondaryRgb: '59, 130, 246',
    tertiary: '#f43f5e',
    tertiaryRgb: '244, 63, 94',
  },
  SOLAR_PLASMA: {
    id: 'SOLAR_PLASMA',
    label: 'SOLAR_PLASMA',
    abyss: '#09080c',
    abyssRgb: '9, 8, 12',
    primary: '#fbbf24',
    primaryRgb: '251, 191, 36',
    secondary: '#f97316',
    secondaryRgb: '249, 115, 22',
    tertiary: '#f43f5e',
    tertiaryRgb: '244, 63, 94',
  },
  NEON_EMERALD: {
    id: 'NEON_EMERALD',
    label: 'NEON_EMERALD',
    abyss: '#040810',
    abyssRgb: '4, 8, 16',
    primary: '#10b981',
    primaryRgb: '16, 185, 129',
    secondary: '#06b6d4',
    secondaryRgb: '6, 182, 212',
    tertiary: '#a855f7',
    tertiaryRgb: '168, 85, 247',
  },
  QUANTUM_SILVER: {
    id: 'QUANTUM_SILVER',
    label: 'QUANTUM_SILVER',
    abyss: '#050508',
    abyssRgb: '5, 5, 8',
    primary: '#e2e8f0',
    primaryRgb: '226, 232, 240',
    secondary: '#93c5fd',
    secondaryRgb: '147, 197, 253',
    tertiary: '#64748b',
    tertiaryRgb: '100, 116, 139',
  },
};

interface ExperimentalProject {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  energySignature: string;
  recommendedMode: FieldMode;
  harmonicFreq: number;
  vorticityGain: number;
  chromaticSplit: number;
  summary: string;
  problem: string;
  architecture: string[];
  telemetry: { k: string; v: string; tier: 'primary' | 'secondary' | 'tertiary' }[];
  codeTitle: string;
  codeSnippet: string;
  stack: string[];
}

const EXPERIMENTAL_PROJECTS: ExperimentalProject[] = [
  {
    id: 'ave',
    code: 'AI-SYS-01',
    title: 'A.V.E. // Autonomous Cognitive Runtime',
    subtitle: 'Sovereign Voice, Episodic Vector Memory & Local Transformer Kernel',
    energySignature: '4.20 GB VRAM // 184ms WAKE-TO-TOKEN',
    recommendedMode: 'CURL_FLUID',
    harmonicFreq: 0.0036,
    vorticityGain: 1.5,
    chromaticSplit: 2.2,
    summary:
      'Low-latency local cognitive runtime coupling real-time acoustic wake detection, HNSW episodic memory graphs, and quantized GGUF inference with deterministic OS syscall execution.',
    problem:
      'Cloud LLM APIs enforce high network tail-latency, zero persistent episodic state across reboots, and total loss of hardware/OS execution sovereignty.',
    architecture: [
      '[ALSA / PIPEWIRE RING] → Lock-free SPSC PCM audio stream into C++ Whisper VAD',
      '[HNSW + SQLITE WAL] → Hybrid vector-episodic recall in less than 12ms without external DB daemons',
      '[LLAMA.CPP INT4_K_M] → Speculative token decoding & sandboxed Rust/Python syscall bridge',
    ],
    telemetry: [
      { k: 'WAKE LATENCY', v: '184 ms', tier: 'primary' },
      { k: 'EPISODIC RECALL', v: '99.2% @ K=5', tier: 'secondary' },
      { k: 'QUANTIZATION', v: 'INT4_K_M GGUF', tier: 'tertiary' },
      { k: 'CLOUD DEPENDENCY', v: '0.00% (ZERO)', tier: 'primary' },
    ],
    codeTitle: 'ave_audio_ring_bridge.rs',
    codeSnippet: `pub struct LockFreePcmRing<const N: usize> {
    buffer: UnsafeCell<[f32; N]>,
    head: AtomicUsize,
    tail: AtomicUsize,
}

impl<const N: usize> LockFreePcmRing<N> {
    #[inline(always)]
    pub fn push_sample(&self, sample: f32) -> bool {
        let h = self.head.load(Ordering::Relaxed);
        let next = (h + 1) & (N - 1);
        if next == self.tail.load(Ordering::Acquire) { return false; }
        unsafe { (*self.buffer.get())[h] = sample; }
        self.head.store(next, Ordering::Release);
        true
    }
}`,
    stack: ['Rust', 'C++20', 'Python', 'GGUF / llama.cpp', 'HNSW', 'SQLite WAL', 'PipeWire'],
  },
  {
    id: 'fraudlens',
    code: 'ML-SYS-02',
    title: 'FraudLens // Temporal Graph Anomaly Vortex',
    subtitle: 'High-Frequency Financial Stream Scoring & Inline SHAP Attribution',
    energySignature: '14,800 TPS // 6.4ms P99 TAIL',
    recommendedMode: 'CLIFFORD_ATTRACTOR',
    harmonicFreq: 0.0054,
    vorticityGain: 1.85,
    chromaticSplit: 2.9,
    summary:
      'Real-time transaction graph anomaly detector fusing sliding-window velocity tensors, calibrated XGBoost + TabNet ensembles, and inline SHAP compliance telemetry.',
    problem:
      'Static rule engines miss multi-hop coordinated collusion rings while generating severe false-positive friction during burst traffic.',
    architecture: [
      '[REDIS STREAMS] → Sub-2ms temporal velocity & k-hop degree centrality extraction',
      '[HYBRID ENSEMBLE] → Calibrated GBDT + TabNet neural residual probability fusion',
      '[SHAP AUDITOR] → Real-time feature attribution payload emitted per scored event',
    ],
    telemetry: [
      { k: 'P99 TAIL LATENCY', v: '6.4 ms', tier: 'primary' },
      { k: 'PR-AUC SCORE', v: '0.964', tier: 'secondary' },
      { k: 'FP REDUCTION', v: '-41.8%', tier: 'tertiary' },
      { k: 'STREAM CAPACITY', v: '14,800 TPS', tier: 'primary' },
    ],
    codeTitle: 'fraudlens_velocity_scorer.py',
    codeSnippet: `def score_stream_batch(tx_graph_tensor: torch.Tensor, xgb_booster, tabnet_head):
    with torch.no_grad():
        residual_logits = tabnet_head(tx_graph_tensor)
    dmatrix = xgb.DMatrix(tx_graph_tensor.cpu().numpy())
    gbdt_margin = xgb_booster.predict(dmatrix, output_margin=True)
    fused_prob = expit(0.72 * gbdt_margin + 0.28 * residual_logits.cpu().numpy())
    shap_contrib = xgb_booster.predict(dmatrix, pred_contribs=True)
    return fused_prob, shap_contrib`,
    stack: ['PyTorch', 'XGBoost', 'ONNX Runtime', 'FastAPI', 'Redis Streams', 'SHAP'],
  },
  {
    id: 'antenna-sim',
    code: 'EM-RF-03',
    title: 'Maxwell // 3D Electromagnetic Field Solver',
    subtitle: 'Full-Wave Radiation Synthesis & Automated Smith Impedance Matching',
    energySignature: '2.4GHz–28GHz // S11 -28.4 dB',
    recommendedMode: 'POYNTING_RF',
    harmonicFreq: 0.0066,
    vorticityGain: 1.35,
    chromaticSplit: 2.0,
    summary:
      'Computational electromagnetics engine resolving 3D far-field directivity tensors, surface current densities, and quarter-wave stub matching networks.',
    problem:
      'Complex impedance mismatches between RF frontends and radiating apertures reflect power back into the LNA/PA stage, collapsing link margin.',
    architecture: [
      '[MAXWELL CURL] → Spherical coordinate far-field E/H radiation tensor integration',
      '[SMITH SYNTHESIS] → Automated complex conjugate impedance transformation (50Ω)',
      '[SURFACE CURRENT] → Conductive skin-depth & dielectric loss tangent profiling',
    ],
    telemetry: [
      { k: 'RETURN LOSS (S11)', v: '-28.4 dB', tier: 'primary' },
      { k: 'REALIZED GAIN', v: '8.72 dBi', tier: 'secondary' },
      { k: 'VSWR BANDWIDTH', v: '1.14 : 1', tier: 'primary' },
      { k: 'RAD EFFICIENCY', v: '93.6%', tier: 'tertiary' },
    ],
    codeTitle: 'smith_conjugate_match.py',
    codeSnippet: `def calc_reflection_and_vswr(z_load: complex, z0: float = 50.0):
    gamma = (z_load - z0) / (z_load + z0)
    mag = abs(gamma)
    s11_db = 20.0 * np.log10(max(mag, 1e-9))
    vswr = (1.0 + mag) / max(1.0 - mag, 1e-6)
    return gamma, s11_db, vswr`,
    stack: ['Keysight ADS', 'Python', 'NumPy / SciPy', 'Smith Chart CAD', 'MATLAB'],
  },
  {
    id: 'rv32i-core',
    code: 'ARCH-RTL-04',
    title: 'RV32I // 5-Stage Pipelined RISC-V Core',
    subtitle: 'Synthesizable Verilog Processor with Hazard Forwarding & Branch Logic',
    energySignature: '185 MHz SYNTH // 1.18 CPI',
    recommendedMode: 'QUANTUM_WAVE',
    harmonicFreq: 0.0028,
    vorticityGain: 1.65,
    chromaticSplit: 2.4,
    summary:
      'Deterministic 32-bit RISC-V microarchitecture written from scratch in Verilog HDL featuring full EX/MEM & MEM/WB bypass multiplexers and Verilator cycle verification.',
    problem:
      'Read-After-Write (RAW) data dependencies and load-use hazards stall naive pipelined datapaths, wasting clock cycles.',
    architecture: [
      '[IF → ID → EX] → Instruction decode with single-cycle load-use hazard interlock',
      '[FORWARDING UNIT] → Zero-stall register bypass across EX/MEM and MEM/WB stages',
      '[VERILATOR + YOSYS] → Cycle-accurate C++ waveform assertions & Artix-7 FPGA synthesis',
    ],
    telemetry: [
      { k: 'MAX SYNTH CLOCK', v: '185 MHz', tier: 'primary' },
      { k: 'PIPELINE CPI', v: '1.18 Cycles', tier: 'secondary' },
      { k: 'FPGA FOOTPRINT', v: '1,840 LUTs', tier: 'tertiary' },
      { k: 'ISA COMPLIANCE', v: 'RV32I Base', tier: 'primary' },
    ],
    codeTitle: 'rv32i_hazard_forwarding.v',
    codeSnippet: `always @(*) begin
    // EX/MEM & MEM/WB Register Bypass Multiplexer Control
    if (ex_mem_regwrite && (ex_mem_rd != 5'b0) && (ex_mem_rd == id_ex_rs1))
        forward_a = 2'b10; // Bypass ALU result from EX/MEM
    else if (mem_wb_regwrite && (mem_wb_rd != 5'b0) && (mem_wb_rd == id_ex_rs1))
        forward_a = 2'b01; // Bypass writeback data from MEM/WB
    else
        forward_a = 2'b00; // Default ID/EX register file read
end`,
    stack: ['Verilog HDL', 'Verilator', 'Icarus Verilog', 'Yosys', 'GTKWave', 'Vivado'],
  },
  {
    id: 'patch-array',
    code: 'EM-RF-05',
    title: 'Helios // 28GHz Phased Microstrip Array',
    subtitle: '4x4 Corporate Wilkinson Feed & Defected Ground Beamforming',
    energySignature: '16.4 dBi GAIN // ±42° STEERING',
    recommendedMode: 'POYNTING_RF',
    harmonicFreq: 0.0072,
    vorticityGain: 1.95,
    chromaticSplit: 3.1,
    summary:
      'Millimeter-wave phased patch array on Rogers RO4003C laminate engineered with corporate phase distribution and mutual-coupling isolation slots.',
    problem:
      'At 28GHz, substrate surface waves induce severe mutual coupling between adjacent patches, distorting side-lobe levels during wide-angle beam steering.',
    architecture: [
      '[RO4003C LAMINATE] → Inset-fed microstrip patch synthesis @ 28.0 GHz carrier',
      '[WILKINSON FEED] → Corporate quarter-wave power divider with phase-taper control',
      '[DGS ISOLATION] → Defected ground slots suppressing surface-wave coupling below -24dB',
    ],
    telemetry: [
      { k: 'ARRAY GAIN', v: '16.4 dBi', tier: 'primary' },
      { k: 'SIDE-LOBE LEVEL', v: '-19.2 dB', tier: 'secondary' },
      { k: 'STEERING RANGE', v: '±42° Azimuth', tier: 'tertiary' },
      { k: 'SUBSTRATE TAN δ', v: '0.0027', tier: 'primary' },
    ],
    codeTitle: 'planar_array_factor.m',
    codeSnippet: `% 4x4 Planar Phased Array Factor @ 28.0 GHz
lambda = 3e8 / 28e9;
d = 0.5 * lambda;
k = 2 * pi / lambda;
beta_x = -k * d * sin(theta_steer) * cos(phi_steer);
AF = sum(exp(1j * (0:3)' * (k * d * sin(Theta) .* cos(Phi) + beta_x)));`,
    stack: ['Keysight ADS', 'HFSS / EM Pro', 'Rogers RO4003C', 'mmWave Layout'],
  },
  {
    id: 'portfolio-sys',
    code: 'SYS-WEB-06',
    title: 'SIROSIU // Multi-Paradigm Generative Kernel',
    subtitle: '4-Mode Physics Engine, WebAudio Synth & Zero-Overflow Architecture',
    energySignature: '60 FPS LOCK // SUB-6ms FRAME',
    recommendedMode: 'QUANTUM_WAVE',
    harmonicFreq: 0.0042,
    vorticityGain: 1.55,
    chromaticSplit: 2.5,
    summary:
      'Flagship creative engineering platform uniting 4 procedural vector field solvers, reactive Web Audio synthesis, and executable hardware/ML sandboxes.',
    problem:
      'Standard engineering portfolios rely on static templates rather than demonstrating live mathematical, acoustic, and systems execution in the browser.',
    architecture: [
      '[4-MODE SOLVER] → Real-time Curl Fluid, Clifford Attractor, Poynting RF & Quantum Wave fields',
      '[WEBAUDIO DRONE] → Biquad-filtered harmonic oscillators modulated by particle vorticity',
      '[EXECUTABLE LABS] → Interactive Smith Chart, RV32I Clock Stepper, VAD & Fraud Radar',
    ],
    telemetry: [
      { k: 'FRAME BUDGET', v: '< 6.0 ms', tier: 'primary' },
      { k: 'PHYSICS MODES', v: '04 Engines', tier: 'secondary' },
      { k: 'MIN VIEWPORT', v: '320px Locked', tier: 'tertiary' },
      { k: 'SIGNATURE MARK', v: 'SHINO v3.5', tier: 'primary' },
    ],
    codeTitle: 'curl_advection_kernel.ts',
    codeSnippet: `function stepCurlParticle(x: number, y: number, t: number, eps = 1.5) {
  const dPsiDy = (potential(x, y + eps, t) - potential(x, y - eps, t)) / (2 * eps);
  const dPsiDx = (potential(x + eps, y, t) - potential(x - eps, y, t)) / (2 * eps);
  return { vx: dPsiDy * GAIN, vy: -dPsiDx * GAIN }; // Divergence ∇·v === 0
}`,
    stack: ['TypeScript', 'React', 'Canvas 2D', 'Web Audio API', 'CSS Grid Math'],
  },
];

const PIPELINE_CYCLES = [
  {
    cycle: 'CYCLE 01',
    ifStage: 'LW x5, 0(x2)',
    idStage: 'ADD x4, x1, x3',
    exStage: 'SUB x1, x8, x9',
    memStage: 'ORI x7, x7, 4',
    wbStage: 'ADDI x2, x0, 16',
    hazard: 'NONE // NORMAL PIPELINE FLOW',
    forwardPath: 'REGFILE READ [00]',
    regX1: '0x0000_004A',
  },
  {
    cycle: 'CYCLE 02',
    ifStage: 'XOR x6, x5, x4',
    idStage: 'LW x5, 0(x2)',
    exStage: 'ADD x4, x1, x3',
    memStage: 'SUB x1, x8, x9',
    wbStage: 'ORI x7, x7, 4',
    hazard: 'RAW HAZARD ON x1 (SUB → ADD)',
    forwardPath: 'EX/MEM → EX ALU_A [10]',
    regX1: '0x0000_01F0 (BYPASSED)',
  },
  {
    cycle: 'CYCLE 03',
    ifStage: 'SW x6, 4(x2)',
    idStage: 'XOR x6, x5, x4',
    exStage: 'LW x5, 0(x2)',
    memStage: 'ADD x4, x1, x3',
    wbStage: 'SUB x1, x8, x9',
    hazard: 'LOAD-USE INTERLOCK ARMED (x5)',
    forwardPath: 'HAZARD UNIT STALL PENDING',
    regX1: '0x0000_01F0 (COMMITTED)',
  },
  {
    cycle: 'CYCLE 04',
    ifStage: 'STALL (HOLD PC)',
    idStage: 'STALL (HOLD XOR)',
    exStage: 'NOP (BUBBLE)',
    memStage: 'LW x5, 0(x2)',
    wbStage: 'ADD x4, x1, x3',
    hazard: 'SINGLE-CYCLE BUBBLE INSERTED',
    forwardPath: 'MEM STAGE DATA FETCH',
    regX1: '0x0000_01F0',
  },
  {
    cycle: 'CYCLE 05',
    ifStage: 'BEQ x6, x0, +8',
    idStage: 'SW x6, 4(x2)',
    exStage: 'XOR x6, x5, x4',
    memStage: 'NOP (BUBBLE)',
    wbStage: 'LW x5, 0(x2)',
    hazard: 'MEM/WB FORWARDING ON x5',
    forwardPath: 'MEM/WB → EX ALU_A [01]',
    regX1: '0x0000_01F0',
  },
];

export const Concept03Experimental: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Core Visual & Physics State
  const [fieldMode, setFieldMode] = useState<FieldMode>('CURL_FLUID');
  const [paletteId, setPaletteId] = useState<PaletteId>('CYBER_ACID');
  const [activeProject, setActiveProject] = useState<ExperimentalProject>(EXPERIMENTAL_PROJECTS[0]);
  const [dossierOpen, setDossierOpen] = useState<boolean>(false);

  // Synthesizer & Simulation Parameters
  const [curlScale, setCurlScale] = useState<number>(0.0036);
  const [turbulenceGain, setTurbulenceGain] = useState<number>(1.5);
  const [dispersionOffset, setDispersionOffset] = useState<number>(2.2);
  const [trailPersistence, setTrailPersistence] = useState<number>(0.91);
  const [gravityWellActive, setGravityWellActive] = useState<boolean>(false);

  // Web Audio API State
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneOsc1Ref = useRef<OscillatorNode | null>(null);
  const droneOsc2Ref = useRef<OscillatorNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // HUD Live Readouts
  const [hudMetrics, setHudMetrics] = useState({
    meanSpeed: '2.84',
    peakVorticity: '1.92',
    reynolds: '4,280',
    cursorVec: '(0.0, 0.0)',
  });

  // --- INTERACTIVE LAB SANDBOX STATES ---
  // Sandbox 1: Smith Chart Tuner
  const [smithR, setSmithR] = useState<number>(52);
  const [smithX, setSmithX] = useState<number>(14);

  // Sandbox 2: RV32I Pipeline Clock Stepper
  const [clockStep, setClockStep] = useState<number>(1);

  // Sandbox 3: VAD Acoustic Streamer
  const [vadThreshold, setVadThreshold] = useState<number>(42);
  const [vadSignalLevel, setVadSignalLevel] = useState<number>(68);

  // Sandbox 4: FraudLens Anomaly Radar
  const [txVelocity, setTxVelocity] = useState<number>(38);
  const [anomalyBurst, setAnomalyBurst] = useState<boolean>(false);

  // Terminal Uplink State
  const [uplinkCommand, setUplinkCommand] = useState<string>('ping sirosiu.com --ack');
  const [uplinkResponse, setUplinkResponse] = useState<string>(
    '64 bytes from sirosiu.com (SHINO_KERNEL_v3.5): icmp_seq=1 ttl=64 time=0.42 ms [STATUS: READY]'
  );

  // Keep simulation refs synced for 60fps loop
  const simRef = useRef({
    fieldMode,
    palette: PALETTES[paletteId],
    curlScale,
    turbulenceGain,
    dispersionOffset,
    trailPersistence,
    gravityWellActive,
    audioEnabled,
  });

  useEffect(() => {
    simRef.current = {
      fieldMode,
      palette: PALETTES[paletteId],
      curlScale,
      turbulenceGain,
      dispersionOffset,
      trailPersistence,
      gravityWellActive,
      audioEnabled,
    };
  }, [
    fieldMode,
    paletteId,
    curlScale,
    turbulenceGain,
    dispersionOffset,
    trailPersistence,
    gravityWellActive,
    audioEnabled,
  ]);

  // Close modal on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDossierOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Toggle Web Audio Synthesizer cleanly with linear ramps
  const toggleWebAudio = useCallback(() => {
    if (!audioEnabled) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        const ctx = new AudioCtx();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 fundamental
        osc2.frequency.setValueAtTime(82.41, ctx.currentTime); // E2 fifth harmonic

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(240, ctx.currentTime);
        filter.Q.setValueAtTime(4.5, ctx.currentTime);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.055, ctx.currentTime + 0.4);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        audioCtxRef.current = ctx;
        droneOsc1Ref.current = osc1;
        droneOsc2Ref.current = osc2;
        filterNodeRef.current = filter;
        masterGainRef.current = gain;
      } else if (audioCtxRef.current && masterGainRef.current) {
        audioCtxRef.current.resume();
        const now = audioCtxRef.current.currentTime;
        masterGainRef.current.gain.cancelScheduledValues(now);
        masterGainRef.current.gain.setValueAtTime(0.001, now);
        masterGainRef.current.gain.linearRampToValueAtTime(0.055, now + 0.35);
      }
      setAudioEnabled(true);
    } else {
      if (audioCtxRef.current && masterGainRef.current) {
        const now = audioCtxRef.current.currentTime;
        masterGainRef.current.gain.cancelScheduledValues(now);
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, now);
        masterGainRef.current.gain.linearRampToValueAtTime(0.0001, now + 0.25);
      }
      setAudioEnabled(false);
    }
  }, [audioEnabled]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // High-Resolution Canvas PNG Frame Snapshot Export
  const handleExportSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `SIROSIU_${fieldMode}_${paletteId}_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Select Project Attractor & Synchronize Field Physics
  const handleSelectProject = (proj: ExperimentalProject, openModal = false) => {
    setActiveProject(proj);
    setFieldMode(proj.recommendedMode);
    setCurlScale(proj.harmonicFreq);
    setTurbulenceGain(proj.vorticityGain);
    setDispersionOffset(proj.chromaticSplit);
    if (openModal) setDossierOpen(true);
  };

  // Multi-Field Procedural Physics Engine Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 680);

    const PARTICLE_COUNT = 1750;
    const particles: {
      x: number;
      y: number;
      px: number;
      py: number;
      vx: number;
      vy: number;
      speed: number;
      phase: number;
    }[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        px: x,
        py: y,
        vx: 0,
        vy: 0,
        speed: 0,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const pointer = {
      x: width * 0.5,
      y: height * 0.5,
      vx: 0,
      vy: 0,
      active: false,
      down: false,
    };

    // 1. CURL_FLUID Scalar Potential
    const scalarPotential = (x: number, y: number, t: number, scale: number) => {
      const s1 = scale;
      const s2 = scale * 2.15;
      const s3 = scale * 4.2;
      return (
        Math.sin(x * s1 + t * 0.65) * Math.cos(y * s1 - t * 0.48) +
        0.55 * Math.sin(x * s2 - y * s2 + t * 1.15) +
        0.25 * Math.cos(x * s3 + y * s2 - t * 1.65)
      );
    };

    const computeFieldVelocity = (
      x: number,
      y: number,
      t: number,
      mode: FieldMode,
      scale: number,
      gain: number
    ) => {
      if (mode === 'CURL_FLUID') {
        const eps = 1.6;
        const dPsiDy =
          (scalarPotential(x, y + eps, t, scale) - scalarPotential(x, y - eps, t, scale)) /
          (2 * eps);
        const dPsiDx =
          (scalarPotential(x + eps, y, t, scale) - scalarPotential(x - eps, y, t, scale)) /
          (2 * eps);
        const amp = 340 * gain;
        return { vx: dPsiDy * amp, vy: -dPsiDx * amp };
      }

      if (mode === 'CLIFFORD_ATTRACTOR') {
        // Normalized strange attractor coordinates [-2, 2]
        const nx = ((x - width * 0.5) / (width * 0.35)) * 2.0;
        const ny = ((y - height * 0.5) / (height * 0.35)) * 2.0;
        const a = -1.4 + Math.sin(t * 0.25) * 0.25;
        const b = 1.6 + Math.cos(t * 0.2) * 0.2;
        const c = 1.0 + scale * 80;
        const d = 0.7;
        const tx = Math.sin(a * ny) + c * Math.cos(a * nx);
        const ty = Math.sin(b * nx) + d * Math.cos(b * ny);
        return {
          vx: (tx - nx) * 2.4 * gain,
          vy: (ty - ny) * 2.4 * gain,
        };
      }

      if (mode === 'POYNTING_RF') {
        // 28GHz Phased Dipole Radiation & Poynting Flux S = E x H
        const cx = width * 0.5;
        const cy = height * 0.5;
        const dx = x - cx;
        const dy = y - cy;
        const r = Math.hypot(dx, dy) + 1;
        const theta = Math.atan2(dy, dx);
        const k = scale * 18;
        const wave = Math.cos(k * r - t * 4.2);
        const arrayLobe = Math.cos(4 * theta + Math.sin(t * 0.8));
        const radialVel = (1.6 + wave * 1.35 * Math.abs(arrayLobe)) * gain;
        const tangVel = Math.sin(k * r - t * 4.2) * arrayLobe * 1.4 * gain;
        return {
          vx: (dx / r) * radialVel - (dy / r) * tangVel,
          vy: (dy / r) * radialVel + (dx / r) * tangVel,
        };
      }

      // QUANTUM_WAVE: 2D standing wave packet nodal interference
      const k = scale * 14;
      const wx = Math.sin(x * k + t * 1.4) * Math.cos(y * k - t * 1.1);
      const wy = Math.cos(x * k - t * 1.1) * Math.sin(y * k + t * 1.4);
      const harmonic = Math.sin((x * x + y * y) * 0.000015 - t * 2.0);
      return {
        vx: (wx + harmonic * 0.6) * 2.6 * gain,
        vy: (wy - harmonic * 0.6) * 2.6 * gain,
      };
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

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.down = false;
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
      height = canvas.height = canvas.parentElement.clientHeight || 580;
      ctx.fillStyle = simRef.current.palette.abyss;
      ctx.fillRect(0, 0, width, height);
    };

    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('resize', onResize);

    ctx.fillStyle = simRef.current.palette.abyss;
    ctx.fillRect(0, 0, width, height);

    let time = 0;
    let frameCount = 0;
    let rafId = 0;

    const renderLoop = () => {
      rafId = requestAnimationFrame(renderLoop);
      time += 0.012;
      frameCount++;

      const {
        fieldMode: mode,
        palette: pal,
        curlScale: cScale,
        turbulenceGain: tGain,
        dispersionOffset: disp,
        trailPersistence: persist,
        gravityWellActive: wellMode,
        audioEnabled: soundOn,
      } = simRef.current;

      // Persistence decay in abyss color
      ctx.globalCompositeOperation = 'source-over';
      const alphaDecay = Math.max(0.03, Math.min(0.24, 1 - persist));
      ctx.fillStyle = `rgba(${pal.abyssRgb}, ${alphaDecay.toFixed(3)})`;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = 1.2;

      let speedSum = 0;
      let maxSpeed = 0;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        p.px = p.x;
        p.py = p.y;

        const fieldVel = computeFieldVelocity(p.x, p.y, time, mode, cScale, tGain);
        let vx = fieldVel.vx;
        let vy = fieldVel.vy;

        // Cursor Vortex & Singularity Interaction
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distSq = dx * dx + dy * dy + 120;
          const radiusSq = 56000;

          if (distSq < radiusSq) {
            const falloff = 1 - distSq / radiusSq;
            if (pointer.down || wellMode) {
              vx += (-dx * 0.036 - dy * 0.048) * falloff * 3.3;
              vy += (-dy * 0.036 + dx * 0.048) * falloff * 3.3;
            } else {
              vx += (-dy * 0.032 + pointer.vx * 0.34) * falloff * 2.6;
              vy += (dx * 0.032 + pointer.vy * 0.34) * falloff * 2.6;
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

        // Boundary Wrap
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          if (mode === 'POYNTING_RF') {
            p.x = width * 0.5 + (Math.random() - 0.5) * 40;
            p.y = height * 0.5 + (Math.random() - 0.5) * 40;
          } else {
            p.x = Math.random() * width;
            p.y = Math.random() * height;
          }
          p.px = p.x;
          p.py = p.y;
        }

        // Dynamic Chromatic Dispersion mapped to active Palette
        if (spd > 3.5) {
          ctx.strokeStyle = `rgba(${pal.tertiaryRgb}, 0.58)`;
          ctx.beginPath();
          ctx.moveTo(p.px - disp, p.py - disp * 0.5);
          ctx.lineTo(p.x - disp, p.y - disp * 0.5);
          ctx.stroke();

          ctx.strokeStyle = `rgba(${pal.secondaryRgb}, 0.54)`;
          ctx.beginPath();
          ctx.moveTo(p.px + disp, p.py + disp * 0.5);
          ctx.lineTo(p.x + disp, p.y + disp * 0.5);
          ctx.stroke();

          ctx.strokeStyle = `rgba(${pal.primaryRgb}, 0.92)`;
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else if (spd > 2.0) {
          ctx.strokeStyle = `rgba(${pal.tertiaryRgb}, 0.52)`;
          ctx.beginPath();
          ctx.moveTo(p.px - disp * 0.5, p.py);
          ctx.lineTo(p.x - disp * 0.5, p.y);
          ctx.stroke();

          ctx.strokeStyle = `rgba(${pal.secondaryRgb}, 0.68)`;
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else {
          ctx.strokeStyle = `rgba(${pal.secondaryRgb}, 0.38)`;
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }

      pointer.vx *= 0.88;
      pointer.vy *= 0.88;

      const mean = speedSum / PARTICLE_COUNT;

      // Modulate Web Audio Synthesizer if enabled
      if (
        soundOn &&
        audioCtxRef.current &&
        filterNodeRef.current &&
        droneOsc1Ref.current &&
        droneOsc2Ref.current
      ) {
        const now = audioCtxRef.current.currentTime;
        const targetCutoff = Math.min(1400, 140 + mean * 95 + Math.hypot(pointer.vx, pointer.vy) * 8);
        filterNodeRef.current.frequency.setTargetAtTime(targetCutoff, now, 0.08);
        droneOsc1Ref.current.frequency.setTargetAtTime(55 + cScale * 2200, now, 0.12);
        droneOsc2Ref.current.frequency.setTargetAtTime(82.41 + mean * 3.2, now, 0.12);
      }

      if (frameCount % 14 === 0) {
        setHudMetrics({
          meanSpeed: mean.toFixed(2),
          peakVorticity: (maxSpeed * 0.42).toFixed(2),
          reynolds: Math.round(mean * 1480 * tGain).toLocaleString(),
          cursorVec: `(${pointer.vx.toFixed(1)}, ${pointer.vy.toFixed(1)})`,
        });
      }
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // --- SANDBOX 1 COMPUTATIONS (SMITH CHART) ---
  const z0 = 50;
  const denom = (smithR + z0) ** 2 + smithX ** 2;
  const gammaReal = (smithR ** 2 + smithX ** 2 - z0 ** 2) / denom;
  const gammaImag = (2 * smithX * z0) / denom;
  const gammaMag = Math.min(0.999, Math.hypot(gammaReal, gammaImag));
  const s11Db = 20 * Math.log10(Math.max(gammaMag, 0.0001));
  const vswrVal = (1 + gammaMag) / Math.max(1 - gammaMag, 0.01);

  // --- SANDBOX 2 COMPUTATIONS (RV32I PIPELINE) ---
  const currentCycleSpec = PIPELINE_CYCLES[clockStep % PIPELINE_CYCLES.length];

  // --- SANDBOX 4 COMPUTATIONS (FRAUDLENS RADAR) ---
  const effectiveVelocity = anomalyBurst ? Math.min(100, txVelocity + 48) : txVelocity;
  const fraudProbability = Math.min(0.994, 1 / (1 + Math.exp(-(effectiveVelocity - 58) / 8.5)));

  const handleUplinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = uplinkCommand.trim().toLowerCase();
    if (cmd.includes('ave')) {
      setUplinkResponse('[AVE_DAEMON]: Wake-to-Token 184ms | HNSW Episodic Memory Online | 4.2GB VRAM');
    } else if (cmd.includes('riscv') || cmd.includes('rv32i')) {
      setUplinkResponse('[RV32I_CORE]: 5-Stage Pipeline | 185MHz Artix-7 | CPI 1.18 | Forwarding Active');
    } else if (cmd.includes('rf') || cmd.includes('patch')) {
      setUplinkResponse('[HELIOS_28GHZ]: 4x4 Rogers RO4003C Array | Gain 16.4 dBi | S11 -28.4 dB');
    } else {
      setUplinkResponse(
        `[SHINO_KERNEL_ACK]: Executed "${uplinkCommand}" → Direct channel open at ankush@sirosiu.com`
      );
    }
  };

  const activePalette = PALETTES[paletteId];

  return (
    <div
      className="c3-exp-root"
      style={
        {
          '--c3-abyss': activePalette.abyss,
          '--c3-primary': activePalette.primary,
          '--c3-secondary': activePalette.secondary,
          '--c3-tertiary': activePalette.tertiary,
        } as React.CSSProperties
      }
    >
      {/* FLOATING HUD COMMAND BAR */}
      <header className="c3-hud-header">
        <div className="c3-hud-brand">
          <span className="c3-pulse-beacon" />
          <span className="c3-mono-primary">SIROSIU // SHINO</span>
          <span className="c3-mono-secondary">EXPERIMENTAL STUDIO v3.5</span>
        </div>

        <nav className="c3-hud-nav" aria-label="Experimental Studio Navigation">
          <a href="#c3-field">00.FIELD</a>
          <a href="#c3-attractors">01.ATTRACTORS</a>
          <a href="#c3-spectra">02.SPECTRA</a>
          <a href="#c3-sandboxes">03.LAB_SANDBOXES</a>
          <a href="#c3-manifesto">04.MANIFESTO</a>
          <a href="#c3-logs">05.LOGS</a>
          <a href="#c3-uplink">06.UPLINK</a>
        </nav>

        <div className="c3-hud-toolbar">
          <button
            type="button"
            onClick={toggleWebAudio}
            className={`c3-hud-action-btn ${audioEnabled ? 'is-active' : ''}`}
          >
            AUDIO FX: [{audioEnabled ? 'ON' : 'OFF'}]
          </button>
          <button type="button" onClick={handleExportSnapshot} className="c3-hud-action-btn">
            SNAPSHOT [PNG]
          </button>
        </div>
      </header>

      {/* SECTION 00: HERO & MULTI-FIELD PROCEDURAL CANVAS */}
      <section id="c3-field" className="c3-hero-stage">
        <canvas
          ref={canvasRef}
          className="c3-curl-canvas"
          aria-label="Interactive multi-mode procedural physics field"
        />

        <div className="c3-hero-overlay-grid">
          {/* Left Hero Identity & Mode Switcher */}
          <div className="c3-glass-card c3-hero-card">
            <div className="c3-kicker-row">
              <span className="c3-badge-primary">MODE // {fieldMode}</span>
              <span className="c3-mono-muted">ANKUSH MALOTHIA (SIROSIU)</span>
            </div>

            <h1 className="c3-hero-display">
              LIVING
              <br />
              <span className="c3-gradient-text">COMPUTATIONAL</span>
              <br />
              PHYSICS.
            </h1>

            <p className="c3-hero-lead">
              Creative engineering laboratory and sovereign systems practice operating across{' '}
              <strong>5-stage RISC-V silicon</strong>, <strong>28GHz phased antenna arrays</strong>,{' '}
              <strong>brain-computer interfaces</strong>, and{' '}
              <strong>autonomous local AI runtimes</strong>.
            </p>

            {/* 4-Mode Equation Switcher */}
            <div className="c3-mode-picker-block">
              <span className="c3-picker-label">SELECT PROCEDURAL VECTOR FIELD EQUATION:</span>
              <div className="c3-mode-pills">
                {(
                  [
                    { id: 'CURL_FLUID', label: '01 // CURL_FLUID (∇·v=0)' },
                    { id: 'CLIFFORD_ATTRACTOR', label: '02 // CLIFFORD_CHAOS' },
                    { id: 'POYNTING_RF', label: '03 // POYNTING_28GHZ' },
                    { id: 'QUANTUM_WAVE', label: '04 // QUANTUM_NODAL' },
                  ] as { id: FieldMode; label: string }[]
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setFieldMode(m.id)}
                    className={`c3-mode-pill ${fieldMode === m.id ? 'is-selected' : ''}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Living Color Spectra Palettes */}
            <div className="c3-mode-picker-block">
              <span className="c3-picker-label">CHROMATIC SPECTRUM PALETTE:</span>
              <div className="c3-palette-pills">
                {Object.values(PALETTES).map((pal) => (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => setPaletteId(pal.id)}
                    className={`c3-palette-btn ${paletteId === pal.id ? 'is-selected' : ''}`}
                  >
                    <span
                      className="c3-swatch-dot"
                      style={{ backgroundColor: pal.primary }}
                    />
                    <span>{pal.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="c3-hero-actions">
              <a href="#c3-attractors" className="c3-btn-primary">
                EXPLORE 06 ATTRACTORS ↓
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

          {/* Right Live Physics Synthesizer Console */}
          <aside className="c3-glass-card c3-synth-console">
            <div className="c3-console-header">
              <span className="c3-mono-primary">FIELD MODULATOR // SHINO DSP</span>
              <span className="c3-mono-secondary">1,750 NODES @ 60FPS</span>
            </div>

            <div className="c3-control-stack">
              <div className="c3-control-row">
                <div className="c3-control-label">
                  <span>HARMONIC WAVENUMBER (Ψ)</span>
                  <strong className="c3-mono-primary">{(curlScale * 1000).toFixed(2)} mHz</strong>
                </div>
                <input
                  type="range"
                  min="0.0018"
                  max="0.0085"
                  step="0.0002"
                  value={curlScale}
                  onChange={(e) => setCurlScale(parseFloat(e.target.value))}
                />
              </div>

              <div className="c3-control-row">
                <div className="c3-control-label">
                  <span>VORTICITY / FLUX GAIN (ω)</span>
                  <strong className="c3-mono-secondary">{turbulenceGain.toFixed(2)}x</strong>
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
                  <span>CHROMATIC ABERRATION (ΔRGB)</span>
                  <strong className="c3-mono-tertiary">{dispersionOffset.toFixed(1)} px</strong>
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
                  <span>FRAME ACCUMULATION (τ)</span>
                  <strong className="c3-mono-primary">{(trailPersistence * 100).toFixed(0)}%</strong>
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
                <strong className="c3-mono-tertiary">{hudMetrics.peakVorticity} rad/s</strong>
              </div>
              <div className="c3-readout-cell">
                <span>REYNOLDS NUM</span>
                <strong className="c3-mono-primary">{hudMetrics.reynolds}</strong>
              </div>
              <div className="c3-readout-cell">
                <span>CURSOR WAKE</span>
                <strong className="c3-mono-secondary">{hudMetrics.cursorVec}</strong>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* SECTION 01: SELECTED WORK — SIX PORTFOLIO ATTRACTORS */}
      <section id="c3-attractors" className="c3-section">
        <div className="c3-section-head">
          <div>
            <span className="c3-eyebrow-primary">01 // KINETIC PORTFOLIO ARCHIVE</span>
            <h2 className="c3-section-title">SIX PRODUCTION ATTRACTOR SYSTEMS</h2>
          </div>
          <p className="c3-section-desc">
            Click any project node to synchronize the procedural physics engine with its harmonic
            signature, or open the full architectural dossier modal for RTL/Rust code inspection.
          </p>
        </div>

        <div className="c3-attractor-layout">
          <div className="c3-node-selector-grid">
            {EXPERIMENTAL_PROJECTS.map((proj) => {
              const isSelected = proj.id === activeProject.id;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => handleSelectProject(proj, false)}
                  className={`c3-node-card ${isSelected ? 'is-selected' : ''}`}
                >
                  <div className="c3-node-top">
                    <span className="c3-mono-primary">{proj.code}</span>
                    <span className="c3-mono-tertiary">{proj.recommendedMode}</span>
                  </div>
                  <h3 className="c3-node-title">{proj.title}</h3>
                  <div className="c3-node-energy">{proj.energySignature}</div>
                </button>
              );
            })}
          </div>

          <div className="c3-glass-card c3-inspector-stage">
            <div className="c3-inspector-top">
              <div>
                <span className="c3-badge-secondary">{activeProject.code}</span>
                <span className="c3-mono-primary">{activeProject.energySignature}</span>
              </div>
              <button
                type="button"
                onClick={() => setDossierOpen(true)}
                className="c3-btn-dossier"
              >
                INSPECT FULL DOSSIER [+]
              </button>
            </div>

            <h3 className="c3-inspector-title">{activeProject.title}</h3>
            <p className="c3-inspector-sub">{activeProject.subtitle}</p>
            <p className="c3-inspector-body">{activeProject.summary}</p>

            <div className="c3-inspector-metrics">
              {activeProject.telemetry.map((m) => (
                <div key={m.k} className={`c3-metric-box is-${m.tier}`}>
                  <span>{m.k}</span>
                  <strong>{m.v}</strong>
                </div>
              ))}
            </div>

            <div className="c3-pipeline-terminal">
              <div className="c3-terminal-bar">SIGNAL FLOW &amp; EXECUTION TOPOLOGY</div>
              {activeProject.architecture.map((line, idx) => (
                <div key={idx} className="c3-terminal-line">
                  <span className="c3-mono-primary">0{idx + 1}</span>
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

      {/* SECTION 02: COMPUTATIONAL SPECTRA (CAPABILITIES) */}
      <section id="c3-spectra" className="c3-section">
        <div className="c3-section-head">
          <div>
            <span className="c3-eyebrow-primary">02 // CROSS-STACK CAPABILITIES</span>
            <h2 className="c3-section-title">FOUR-TIER COMPUTATIONAL SPECTRA</h2>
          </div>
        </div>

        <div className="c3-spectra-grid">
          <article className="c3-glass-card c3-spectrum-card">
            <div className="c3-spectrum-top">
              <span className="c3-mono-secondary">TIER 01 // SILICON</span>
              <span className="c3-mono-primary">185 MHz – 1.8 GHz</span>
            </div>
            <h3>Computer Architecture &amp; RTL</h3>
            <p>
              5-stage pipelined RISC-V cores in Verilog HDL, hazard detection &amp; forwarding
              units, AXI4 stream interconnects, Verilator C++ testbenches, and Vivado/Yosys FPGA
              synthesis.
            </p>
          </article>

          <article className="c3-glass-card c3-spectrum-card">
            <div className="c3-spectrum-top">
              <span className="c3-mono-secondary">TIER 02 // ELECTROMAGNETICS</span>
              <span className="c3-mono-primary">2.4 GHz – 28.0 GHz</span>
            </div>
            <h3>RFIC &amp; Phased Antenna Arrays</h3>
            <p>
              Full-wave Maxwell radiation solvers, 28GHz microstrip patch arrays on Rogers RO4003C,
              Wilkinson corporate feeds, DGS mutual-coupling isolation, and Smith Chart matching.
            </p>
          </article>

          <article className="c3-glass-card c3-spectrum-card">
            <div className="c3-spectrum-top">
              <span className="c3-mono-secondary">TIER 03 // NEURAL &amp; BCI</span>
              <span className="c3-mono-primary">8 Hz – 40 Hz (Mu/Beta)</span>
            </div>
            <h3>Applied AI &amp; Brain-Computer Interfaces</h3>
            <p>
              Quantized local LLM inference (A.V.E.), non-invasive EEG motor-imagery spatial
              filtering, and sub-10ms streaming graph anomaly detection with SHAP explainability.
            </p>
          </article>

          <article className="c3-glass-card c3-spectrum-card">
            <div className="c3-spectrum-top">
              <span className="c3-mono-secondary">TIER 04 // KERNEL &amp; GRAPHICS</span>
              <span className="c3-mono-primary">60 FPS // ZERO-COPY</span>
            </div>
            <h3>Systems Programming &amp; Linux</h3>
            <p>
              Lock-free atomic ring buffers in Rust &amp; C++20, AVX2 SIMD matrix microkernels,
              multi-boot Arch Linux (Hyprland) environments, and procedural WebGL/Canvas physics.
            </p>
          </article>
        </div>
      </section>

      {/* SECTION 03: INTERACTIVE EXECUTABLE LAB SANDBOXES */}
      <section id="c3-sandboxes" className="c3-section">
        <div className="c3-section-head">
          <div>
            <span className="c3-eyebrow-primary">03 // EXECUTABLE INSTRUMENTATION</span>
            <h2 className="c3-section-title">FOUR INTERACTIVE ENGINEERING SANDBOXES</h2>
          </div>
          <p className="c3-section-desc">
            Live client-side micro-instruments executing real impedance math, RISC-V pipeline
            forwarding, acoustic wake thresholding, and graph velocity scoring.
          </p>
        </div>

        <div className="c3-sandbox-grid">
          {/* SANDBOX 01: SMITH CHART IMPEDANCE TUNER */}
          <div className="c3-glass-card c3-sandbox-card">
            <div className="c3-sandbox-head">
              <span className="c3-mono-primary">SANDBOX 01 // EM-RF-03</span>
              <span className="c3-badge-secondary">50Ω SMITH TUNER</span>
            </div>
            <h3>Interactive Smith Chart &amp; S11 Solver</h3>

            <div className="c3-smith-visual-row">
              <svg viewBox="0 0 180 180" className="c3-smith-svg" aria-label="Live Smith Chart">
                <circle cx="90" cy="90" r="76" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
                <circle cx="115" cy="90" r="51" fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />
                <circle cx="140" cy="90" r="26" fill="none" stroke="rgba(255,255,255,0.12)" />
                <line x1="14" y1="90" x2="166" y2="90" stroke="rgba(255,255,255,0.2)" />
                <circle
                  cx={90 + gammaReal * 76}
                  cy={90 - gammaImag * 76}
                  r="6"
                  fill="var(--c3-primary)"
                />
                <line
                  x1="90"
                  y1="90"
                  x2={90 + gammaReal * 76}
                  y2={90 - gammaImag * 76}
                  stroke="var(--c3-tertiary)"
                  strokeWidth="1.5"
                />
              </svg>

              <div className="c3-smith-metrics">
                <div>
                  <span>|Γ| REFLECTION</span>
                  <strong>{gammaMag.toFixed(3)}</strong>
                </div>
                <div>
                  <span>RETURN LOSS (S11)</span>
                  <strong className="c3-mono-primary">{s11Db.toFixed(1)} dB</strong>
                </div>
                <div>
                  <span>VSWR RATIO</span>
                  <strong className="c3-mono-tertiary">{vswrVal.toFixed(2)} : 1</strong>
                </div>
              </div>
            </div>

            <div className="c3-sandbox-controls">
              <label>
                <span>LOAD RESISTANCE (R): {smithR} Ω</span>
                <input
                  type="range"
                  min="10"
                  max="150"
                  value={smithR}
                  onChange={(e) => setSmithR(Number(e.target.value))}
                />
              </label>
              <label>
                <span>LOAD REACTANCE (jX): {smithX} Ω</span>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={smithX}
                  onChange={(e) => setSmithX(Number(e.target.value))}
                />
              </label>
            </div>
          </div>

          {/* SANDBOX 02: RV32I 5-STAGE PIPELINE CLOCK STEPPER */}
          <div className="c3-glass-card c3-sandbox-card">
            <div className="c3-sandbox-head">
              <span className="c3-mono-primary">SANDBOX 02 // ARCH-RTL-04</span>
              <span className="c3-badge-secondary">{currentCycleSpec.cycle}</span>
            </div>
            <h3>RV32I 5-Stage Pipeline Hazard Stepper</h3>

            <div className="c3-pipeline-stages">
              <div className="c3-stage-pill">
                <span>IF</span>
                <strong>{currentCycleSpec.ifStage}</strong>
              </div>
              <div className="c3-stage-pill">
                <span>ID</span>
                <strong>{currentCycleSpec.idStage}</strong>
              </div>
              <div className="c3-stage-pill is-highlight">
                <span>EX</span>
                <strong>{currentCycleSpec.exStage}</strong>
              </div>
              <div className="c3-stage-pill">
                <span>MEM</span>
                <strong>{currentCycleSpec.memStage}</strong>
              </div>
              <div className="c3-stage-pill">
                <span>WB</span>
                <strong>{currentCycleSpec.wbStage}</strong>
              </div>
            </div>

            <div className="c3-hazard-readout">
              <div>
                <span>HAZARD UNIT:</span>
                <strong className="c3-mono-tertiary">{currentCycleSpec.hazard}</strong>
              </div>
              <div>
                <span>FORWARD MUX:</span>
                <strong className="c3-mono-primary">{currentCycleSpec.forwardPath}</strong>
              </div>
              <div>
                <span>REG x1 VALUE:</span>
                <strong>{currentCycleSpec.regX1}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setClockStep((s) => s + 1)}
              className="c3-sandbox-btn"
            >
              ADVANCE RISING CLOCK EDGE (CLK ↑)
            </button>
          </div>

          {/* SANDBOX 03: A.V.E. VAD ACOUSTIC STREAMER */}
          <div className="c3-glass-card c3-sandbox-card">
            <div className="c3-sandbox-head">
              <span className="c3-mono-primary">SANDBOX 03 // AI-SYS-01</span>
              <span className="c3-badge-secondary">
                {vadSignalLevel > vadThreshold ? 'WAKE TRIGGERED (184ms)' : 'SILENCE GATED'}
              </span>
            </div>
            <h3>A.V.E. Acoustic VAD &amp; Ring Buffer</h3>

            <div className="c3-vad-bars">
              {[0.55, 0.8, 0.95, 0.7, 1.0, 0.85, 0.6, 0.9, 0.75, 0.5].map((mult, idx) => {
                const barH = Math.min(100, Math.round(vadSignalLevel * mult));
                const active = barH >= vadThreshold;
                return (
                  <div key={idx} className="c3-vad-bar-track">
                    <div
                      className={`c3-vad-bar-fill ${active ? 'is-wake' : ''}`}
                      style={{ height: `${barH}%` }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="c3-sandbox-controls">
              <label>
                <span>INPUT ACOUSTIC ENERGY: {vadSignalLevel} dB</span>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={vadSignalLevel}
                  onChange={(e) => setVadSignalLevel(Number(e.target.value))}
                />
              </label>
              <label>
                <span>VAD WAKE THRESHOLD: {vadThreshold} dB</span>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={vadThreshold}
                  onChange={(e) => setVadThreshold(Number(e.target.value))}
                />
              </label>
            </div>
          </div>

          {/* SANDBOX 04: FRAUDLENS STREAM ANOMALY RADAR */}
          <div className="c3-glass-card c3-sandbox-card">
            <div className="c3-sandbox-head">
              <span className="c3-mono-primary">SANDBOX 04 // ML-SYS-02</span>
              <span className="c3-badge-secondary">
                SCORE: {(fraudProbability * 100).toFixed(1)}%
              </span>
            </div>
            <h3>FraudLens Graph Velocity &amp; SHAP</h3>

            <div className="c3-shap-bars">
              <div className="c3-shap-row">
                <span>2-HOP VELOCITY</span>
                <div className="c3-shap-track">
                  <div
                    className="c3-shap-fill"
                    style={{ width: `${Math.min(100, effectiveVelocity)}%` }}
                  />
                </div>
              </div>
              <div className="c3-shap-row">
                <span>PAGERANK CENTRALITY</span>
                <div className="c3-shap-track">
                  <div
                    className="c3-shap-fill is-secondary"
                    style={{ width: `${Math.min(100, effectiveVelocity * 0.82)}%` }}
                  />
                </div>
              </div>
              <div className="c3-shap-row">
                <span>ENSEMBLE RISK LOGIT</span>
                <div className="c3-shap-track">
                  <div
                    className="c3-shap-fill is-tertiary"
                    style={{ width: `${(fraudProbability * 100).toFixed(0)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="c3-sandbox-controls">
              <label>
                <span>BASE STREAM VELOCITY: {txVelocity}00 TPS</span>
                <input
                  type="range"
                  min="10"
                  max="85"
                  value={txVelocity}
                  onChange={(e) => setTxVelocity(Number(e.target.value))}
                />
              </label>
              <button
                type="button"
                onClick={() => setAnomalyBurst((b) => !b)}
                className="c3-sandbox-btn"
              >
                {anomalyBurst ? 'CLEAR COLLUSION BURST' : 'SIMULATE COLLUSION RING BURST'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04: ENGINEERING MANIFESTO & FIRST PRINCIPLES */}
      <section id="c3-manifesto" className="c3-section">
        <div className="c3-glass-card c3-manifesto-slab">
          <div className="c3-manifesto-left">
            <span className="c3-eyebrow-primary">04 // ARCHITECTURAL MANIFESTO</span>
            <h2>
              FROM <span>MAXWELL’S EQUATIONS</span> TO <span>AUTONOMOUS AGENTS</span>.
            </h2>
            <div className="c3-identity-stamp">
              <span>ANKUSH MALOTHIA // HANDLE: SIROSIU</span>
              <span>SIGNATURE KERNEL: SHINO // NIT JALANDHAR ECE</span>
            </div>
          </div>
          <div className="c3-manifesto-right">
            <p>
              True computational mastery refuses to stop at high-level abstractions. When you trace
              a voice command through an acoustic ring buffer, across a quantized transformer weight
              matrix, down into C++/Rust memory arenas, and finally onto pipelined RISC-V logic
              gates and 28GHz RF carrier waves, you realize every layer is governed by conservation
              laws and signal-to-noise ratios.
            </p>
            <p>
              <strong>SIROSIU</strong> is engineered as a unified research and production foundry
              where hardware physics, low-level Linux systems, and living generative interfaces
              co-evolve without compromise.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 05: RESEARCH LOGS & WRITING */}
      <section id="c3-logs" className="c3-section">
        <div className="c3-section-head">
          <div>
            <span className="c3-eyebrow-primary">05 // TECHNICAL MONOGRAPHS</span>
            <h2 className="c3-section-title">RESEARCH LOGS &amp; DISPATCHES</h2>
          </div>
        </div>

        <div className="c3-logs-list">
          <article className="c3-glass-card c3-log-row">
            <div className="c3-log-meta">
              <span className="c3-mono-primary">LOG // 2026.10</span>
              <span className="c3-badge-secondary">ARCH-RTL</span>
            </div>
            <div className="c3-log-content">
              <h3>Eliminating RAW Pipeline Stalls in 5-Stage RISC-V Processors</h3>
              <p>
                Gate-level walkthrough of EX/MEM and MEM/WB bypass multiplexers and Verilator
                waveform verification at 185 MHz.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSelectProject(EXPERIMENTAL_PROJECTS[3], true)}
              className="c3-log-btn"
            >
              INSPECT RTL →
            </button>
          </article>

          <article className="c3-glass-card c3-log-row">
            <div className="c3-log-meta">
              <span className="c3-mono-primary">LOG // 2026.09</span>
              <span className="c3-badge-secondary">EM-RFIC</span>
            </div>
            <div className="c3-log-content">
              <h3>Suppressing Surface-Wave Coupling in 28GHz Phased Patch Arrays</h3>
              <p>
                Designing corporate Wilkinson power dividers and Defected Ground Structures on
                Rogers RO4003C laminates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSelectProject(EXPERIMENTAL_PROJECTS[4], true)}
              className="c3-log-btn"
            >
              INSPECT ARRAY →
            </button>
          </article>

          <article className="c3-glass-card c3-log-row">
            <div className="c3-log-meta">
              <span className="c3-mono-primary">LOG // 2026.08</span>
              <span className="c3-badge-secondary">LOCAL AI</span>
            </div>
            <div className="c3-log-content">
              <h3>Sovereign Agent Memory: Hybrid HNSW + SQLite WAL in A.V.E.</h3>
              <p>
                Achieving sub-190ms wake-to-token voice inference and persistent episodic memory on
                Arch Linux without cloud APIs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSelectProject(EXPERIMENTAL_PROJECTS[0], true)}
              className="c3-log-btn"
            >
              INSPECT KERNEL →
            </button>
          </article>
        </div>
      </section>

      {/* SECTION 06 & 07: NOW VECTORS + INTERACTIVE TERMINAL UPLINK */}
      <section id="c3-uplink" className="c3-section">
        <div className="c3-uplink-grid">
          <div className="c3-glass-card c3-now-box">
            <span className="c3-eyebrow-primary">06 // ACTIVE TELEMETRY (NOVEMBER 2026)</span>
            <h3>CURRENT OPERATIONAL VECTORS</h3>
            <ul className="c3-now-stream">
              <li>
                <span className="c3-mono-primary">[VEC_01 // R&amp;D]</span>
                <span>
                  Non-invasive <strong>Brain-Computer Interfaces (BCI)</strong>, EEG motor-imagery
                  DSP, and custom AI hardware accelerators.
                </span>
              </li>
              <li>
                <span className="c3-mono-secondary">[VEC_02 // BUILD]</span>
                <span>
                  Expanding <strong>A.V.E.</strong> local autonomous voice/memory kernel and
                  superscalar RISC-V RTL extensions.
                </span>
              </li>
              <li>
                <span className="c3-mono-tertiary">[VEC_03 // RIG]</span>
                <span>
                  B.Tech ECE (3rd Year / 5th Sem) at <strong>NIT Jalandhar</strong> // Lenovo LOQ
                  i7-13650HX + RTX 4050 running multi-boot Arch Linux (Hyprland).
                </span>
              </li>
              <li>
                <span className="c3-mono-primary">[VEC_04 // PHYSICAL]</span>
                <span>
                  6-day pull/legs/core split, 18:32 5.2km run pace, and strict dead-hang pull-up to
                  muscle-up progression.
                </span>
              </li>
            </ul>
          </div>

          <div className="c3-glass-card c3-contact-box">
            <span className="c3-eyebrow-primary">07 // DIRECT TERMINAL UPLINK</span>
            <h3>INITIATE ENGINEERING TRANSMISSION</h3>

            <form onSubmit={handleUplinkSubmit} className="c3-terminal-form">
              <div className="c3-term-prompt">
                <span className="c3-mono-primary">sirosiu@shino:~$</span>
                <input
                  type="text"
                  value={uplinkCommand}
                  onChange={(e) => setUplinkCommand(e.target.value)}
                  aria-label="Terminal Command Input"
                />
                <button type="submit">EXEC</button>
              </div>
              <div className="c3-term-output">{uplinkResponse}</div>
            </form>

            <div className="c3-uplink-buttons">
              <a href="mailto:ankush@sirosiu.com" className="c3-uplink-row">
                <span>DIRECT ELECTRONIC MAIL</span>
                <strong className="c3-mono-primary">ankush@sirosiu.com ↗</strong>
              </a>
              <a
                href="https://github.com/sirosiu"
                target="_blank"
                rel="noreferrer"
                className="c3-uplink-row"
              >
                <span>GITHUB SOURCE ARCHIVE</span>
                <strong className="c3-mono-secondary">github.com/sirosiu ↗</strong>
              </a>
              <a
                href="https://sirosiu.com"
                target="_blank"
                rel="noreferrer"
                className="c3-uplink-row"
              >
                <span>PRIMARY DOMAIN</span>
                <strong className="c3-mono-tertiary">sirosiu.com // SHINO ↗</strong>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 08: PRECISION SILKSCREEN FOOTER */}
      <footer className="c3-footer">
        <div className="c3-footer-wrap">
          <span>© 2026 SIROSIU // ANKUSH MALOTHIA — EXPERIMENTAL GENERATIVE SYSTEMS</span>
          <span className="c3-mono-primary">
            SIGNATURE MARK: SHINO // MODE: {fieldMode} // PALETTE: {paletteId}
          </span>
        </div>
      </footer>

      {/* DEEP ARCHITECTURAL DOSSIER MODAL */}
      {dossierOpen && (
        <div
          className="c3-modal-backdrop"
          onClick={() => setDossierOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={activeProject.title}
        >
          <div className="c3-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="c3-modal-header">
              <div>
                <span className="c3-badge-primary">{activeProject.code}</span>
                <span className="c3-mono-secondary">{activeProject.energySignature}</span>
              </div>
              <button
                type="button"
                onClick={() => setDossierOpen(false)}
                className="c3-modal-close"
              >
                CLOSE [ESC]
              </button>
            </div>

            <h2 className="c3-modal-title">{activeProject.title}</h2>
            <p className="c3-modal-sub">{activeProject.subtitle}</p>

            <div className="c3-modal-grid">
              <div className="c3-modal-col">
                <h4>01 // ENGINEERING PROBLEM STATEMENT</h4>
                <p>{activeProject.problem}</p>

                <h4>02 // ARCHITECTURAL EXECUTION</h4>
                <ul className="c3-modal-list">
                  {activeProject.architecture.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>

              <div className="c3-modal-col">
                <h4>03 // SOURCE IMPLEMENTATION ({activeProject.codeTitle})</h4>
                <pre className="c3-modal-code">
                  <code>{activeProject.codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Concept03Experimental;
