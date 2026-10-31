export interface ProjectMetric {
  label: string
  value: string
}

export type ProjectLifecycleStatus = 'Built' | 'In progress' | 'Planned'

export type ProjectDomain =
  | 'Applied AI & Agents'
  | 'Computer Architecture'
  | 'RF Engineering'
  | 'Machine Learning & Full-Stack'
  | 'Creative Engineering'

export type ProjectRepoStatus = 'public' | 'private' | 'in-progress' | 'lab-archive'

export interface ProjectItem {
  id: string
  index: string
  title: string
  tagline: string
  domain: ProjectDomain
  domainCode: string
  status: ProjectLifecycleStatus
  repoStatus: ProjectRepoStatus
  builtScope: string
  plannedScope: string
  summary: string
  architectureHighlight: string
  metrics: ProjectMetric[]
  tags: string[]
  repoUrl: string
  demoUrl: string
  contributions: string[]
  outcomes: string[]
  coverGradient: string
  icon: string
}

export const DEMO_PROJECTS: ProjectItem[] = [
  {
    id: 'ave-agent',
    index: '01',
    title: 'Ave: Personal AI Agent & Wearable OS',
    tagline: 'Privacy-first personal autonomous agent prototype for natural-language interaction, tool execution, and episodic memory.',
    domain: 'Applied AI & Agents',
    domainCode: 'AI-SYS-01',
    status: 'In progress',
    repoStatus: 'in-progress',
    builtScope: 'Agent architecture, local LLM experimentation, tool use, memory graph, and voice/text interaction.',
    plannedScope: 'Wearable hardware integration, quantized local inference, and controlled device actions.',
    summary:
      'Ave is a personalized, local-first autonomous intelligence system engineered to execute complex workflows without cloud data egress. Features a multi-tiered memory engine (working, episodic, semantic) paired with dynamic tool-calling loops over quantized open-weights models.',
    architectureHighlight:
      'Hierarchical state manager with localized Ollama/Llama.cpp runtime, vector memory retrieval via ChromaDB, and isolated subprocess execution sandbox.',
    metrics: [
      { label: 'DISPATCH LATENCY', value: '<48ms' },
      { label: 'DATA PRIVACY', value: '100% Local' },
      { label: 'QUANTIZATION', value: '4-bit GGUF' },
      { label: 'TOOL EXECUTION', value: 'Sandboxed' },
    ],
    tags: ['Python', 'Ollama', 'Quantized LLMs', 'Agent Architecture', 'Tool Use', 'Episodic Memory', 'FastAPI'],
    repoUrl: 'https://github.com/Sirosiu/ave',
    demoUrl: '#demo-ave',
    contributions: [
      'Built a privacy-first personal agent for natural-language interaction, tool execution, and personalized memory.',
      'Prototyped voice-and-text interaction while exploring quantized local inference on edge hardware.',
      'Constructed deterministic tool-calling schema parsing with automatic error recovery.',
    ],
    outcomes: [
      'Zero external API dependencies for mission-critical personal workflow automation.',
      'Persistent memory recall with sub-30ms semantic vector similarity queries.',
    ],
    coverGradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(192, 132, 252, 0.15))',
    icon: '🧠',
  },
  {
    id: 'fraudlens',
    index: '02',
    title: 'FraudLens: Credit Card Fraud Monitoring',
    tagline: 'Real-time transaction classification with class-weighted XGBoost, FastAPI alerts & Next.js dashboard.',
    domain: 'Machine Learning & Full-Stack',
    domainCode: 'ML-SYS-02',
    status: 'Built',
    repoStatus: 'public',
    builtScope: 'Trained XGBoost transaction classifier on Kaggle Credit Card dataset with severe imbalance compensation.',
    plannedScope: 'Online streaming inference with Apache Kafka and automated feedback loop for false positive reduction.',
    summary:
      'A full-stack credit card fraud detection and operational monitoring platform. Leverages an XGBoost model fine-tuned for high precision on severely imbalanced financial data, paired with a real-time FastAPI ingestion service and reactive Next.js analyst dashboard.',
    architectureHighlight:
      'Integrated FastAPI scoring and alert endpoints with WebSocket live updates and SQLite persistence for review, approve, block, and escalate actions.',
    metrics: [
      { label: 'CLASSIFIER', value: 'XGBoost' },
      { label: 'INFERENCE', value: '<12ms' },
      { label: 'STREAMING', value: 'WebSockets' },
      { label: 'DATASET', value: 'Kaggle Credit' },
    ],
    tags: ['Python', 'XGBoost', 'scikit-learn', 'FastAPI', 'WebSockets', 'SQLite', 'Next.js', 'TypeScript'],
    repoUrl: 'https://github.com/Sirosiu/Fraudlens',
    demoUrl: '#demo-fraudlens',
    contributions: [
      'Trained an XGBoost transaction classifier on Kaggle’s Credit Card Fraud Detection dataset using class weighting for severe class imbalance.',
      'Integrated FastAPI scoring and alert endpoints with WebSocket updates and SQLite persistence.',
      'Built a reactive Next.js dashboard for review and approve/block/escalate operational decisions.',
    ],
    outcomes: [
      'High precision-recall tradeoff ensuring minimal false alarms while catching anomalous spikes.',
      'Sub-15ms end-to-end evaluation latency (<12ms model inference) from transaction receipt to dashboard alert.',
    ],
    coverGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(245, 158, 11, 0.15))',
    icon: '🛡️',
  },
  {
    id: 'antenna-simulation',
    index: '03',
    title: 'Antenna Modeling & EM Simulation',
    tagline: 'CST Studio & openEMS FDTD simulation for 2.4 & 5.8 GHz antennas with 3D ParaView pattern export.',
    domain: 'RF Engineering',
    domainCode: 'EM-RF-03',
    status: 'Built',
    repoStatus: 'lab-archive',
    builtScope: 'Simulated 2.4 GHz half-wave dipole in CST (VSWR 1.01), inset-fed patch, and 2.6 GHz broadside array.',
    plannedScope: 'PCB microstrip fabrication and anechoic chamber radiation pattern measurement.',
    summary:
      'Rigorous computational electromagnetics and antenna modeling using CST Studio Suite, openEMS (FDTD), and MATLAB. Covers dipole, patch, and helical antenna structures with comprehensive S-parameter, impedance, and near-field-to-far-field analysis.',
    architectureHighlight:
      'FDTD full-wave simulation, NF2FF transformation, impedance matching optimization, and ParaView 3D field visualization pipeline.',
    metrics: [
      { label: 'SIM VSWR', value: '1.01' },
      { label: 'RESONANCE', value: '2.34 GHz' },
      { label: 'HELICAL BANDS', value: '1 & 2.4 GHz' },
      { label: '3D EXPORT', value: 'ParaView' },
    ],
    tags: ['CST Studio', 'openEMS (FDTD)', 'MATLAB', 'ParaView', 'S-parameters', 'VSWR', 'Antenna Design'],
    repoUrl: 'https://github.com/Sirosiu/antenna-modeling',
    demoUrl: '#demo-antenna',
    contributions: [
      'Simulated a 2.4 GHz half-wave dipole in CST, observing resonance near 2.34 GHz and minimum simulated VSWR of 1.01.',
      'Modeled an inset-fed patch and a broadside array near 2.6 GHz with optimized impedance matching.',
      'Used openEMS and MATLAB to model a 5.8 GHz patch and helical antennas at 1 and 2.4 GHz, exporting 3D results to ParaView.',
    ],
    outcomes: [
      'Validated sub-1.05 simulated VSWR across primary resonance bands in CST Studio Suite.',
      'Extracted near-field-to-far-field radiation patterns and surface current distributions in 3D.',
    ],
    coverGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(56, 189, 248, 0.15))',
    icon: '📡',
  },
  {
    id: 'rv32i-core',
    index: '04',
    title: 'RV32I Core & Tensor Coprocessor',
    tagline: 'Pipelined 32-bit RISC-V digital logic in SystemVerilog with hardware systolic accelerator.',
    domain: 'Computer Architecture',
    domainCode: 'ARCH-RTL-04',
    status: 'Built',
    repoStatus: 'private',
    builtScope: '5-stage in-order CPU RTL in SystemVerilog, hazard unit with forwarding, 4x4 systolic matrix co-processor.',
    plannedScope: 'FPGA hardware board bring-up on Xilinx Artix-7 and open-source ASIC tape-out flow.',
    summary:
      'A custom 5-stage pipelined RISC-V (RV32I) microprocessor core implemented from scratch in SystemVerilog. Features a dedicated memory-mapped systolic array coprocessor designed to accelerate GEMM operations for edge machine learning workloads.',
    architectureHighlight:
      'Hazard detection with data forwarding unit, branch predictor, custom co-processor interface, and Verilator/gem5 testbench automation.',
    metrics: [
      { label: 'SYNTHESIS FREQ', value: '120 MHz' },
      { label: 'GEMM SPEEDUP', value: '4.2x' },
      { label: 'PIPELINE', value: '5-Stage In-Order' },
      { label: 'COMPLIANCE', value: '100% Pass' },
    ],
    tags: ['SystemVerilog', 'Verilog', 'RISC-V ISA', 'Vivado', 'Verilator', 'Yosys', 'GTKWave'],
    repoUrl: 'https://github.com/Sirosiu/rv32i-accelerator',
    demoUrl: '#demo-rv32i',
    contributions: [
      'Authored modular RTL in SystemVerilog for Fetch, Decode, Execute, Memory, and Writeback stages.',
      'Designed custom hazard unit resolving RAW dependencies via forwarding paths without pipeline bubbles.',
      'Verified cycle-accurate execution in Verilator testbench automation.',
    ],
    outcomes: [
      'Passed 100% of official RISC-V architectural compliance tests (riscv-tests suite in simulation).',
      'Demonstrated 4.2x cycle reduction on 16x16 matrix convolution compared to baseline software emulation.',
    ],
    coverGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.15))',
    icon: '⊞',
  },
  {
    id: 'rf-patch-array',
    index: '05',
    title: 'Dual-Band Microstrip Patch Antenna Array',
    tagline: 'High-frequency electromagnetic simulation, S-parameter optimization & far-field visualizer.',
    domain: 'RF Engineering',
    domainCode: 'EM-RF-05',
    status: 'Built',
    repoStatus: 'lab-archive',
    builtScope: 'Analytical transmission line modeling, 3D FDTD full-wave CST/OpenEMS simulation, S11 optimization (< -22dB), WebGL 3D radiation visualizer.',
    plannedScope: 'Physical PCB milling fabrication and vector network analyzer (VNA) anechoic chamber measurements.',
    summary:
      'Dual-band 2.45 GHz & 5.8 GHz microstrip patch antenna array modeled on FR4 and Rogers RO4350B substrates. Employs inset-fed impedance matching and an optimized corporate feeding network to minimize reflection losses and maximize directional gain.',
    architectureHighlight:
      'Full-wave 3D electromagnetic FDTD simulation, corporate power divider with quarter-wave transformers, and custom WebGL radiation pattern visualizer.',
    metrics: [
      { label: 'SIM S11 LOSS', value: '-22.4 dB' },
      { label: 'SIM GAIN', value: '+7.8 dBi' },
      { label: 'SIM VSWR', value: '1.16 : 1' },
      { label: 'BANDS', value: '2.45 & 5.8 GHz' },
    ],
    tags: ['MATLAB', 'CST Studio', 'OpenEMS', 'FDTD Method', 'Antenna Design', 'S-Parameters', 'WebGL'],
    repoUrl: 'https://github.com/Sirosiu/rf-patch-array',
    demoUrl: '#demo-rf-array',
    contributions: [
      'Calculated fringing field expansions, effective dielectric constants, and patch dimensions via analytical transmission line models.',
      'Simulated far-field 3D radiation lobes, axial ratios, and surface current distributions using FDTD.',
      'Developed MATLAB automated scripts for continuous parameter sweeping and impedance matching.',
    ],
    outcomes: [
      'Achieved simulated S11 return loss of -22.4 dB at 2.45 GHz resonance with bandwidth covering full ISM band.',
      'Synthesized radiation visualizer rendering elevation and azimuth plane cuts directly in the browser.',
    ],
    coverGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(56, 189, 248, 0.15))',
    icon: '📡',
  },
  {
    id: 'sirosiu-website',
    index: '06',
    title: 'Portfolio Website',
    tagline: 'Tactile compute portfolio with GPGPU curl noise field, 3D procedural silicon wafer lithography, and accessible architecture continuum.',
    domain: 'Creative Engineering',
    domainCode: 'SYS-WEB-06',
    status: 'Built',
    repoStatus: 'public',
    builtScope: 'Three.js GPGPU particle physics with device-tier adaptivity, procedural 28nm IC wafer die, Aceternity 3D card tilt, accessible WCAG AA contrast, and zero-overflow fluid layouts.',
    plannedScope: 'Interactive WebAssembly gem5 execution trace player and WebGPU compute pipeline.',
    summary:
      'The engineering portfolio and systems architecture platform powering sirosiu.com. Designed as a high-density, tactile technical interface bridging physical silicon design to autonomous agent runtimes. Features custom GPGPU curl noise vector fields, interactive 3D Damascene IC wafer lithography, WCAG AA compliant light/dark optics, and zero-layout-shift telemetry.',
    architectureHighlight:
      'Custom Three.js GPGPU particle physics with device-tier adaptivity (16k to 4k particles), procedural QR die shaders, accessible focus-trapped dialogs, and sub-16ms frame budget execution.',
    metrics: [
      { label: 'FRAME BUDGET', value: '60 FPS' },
      { label: 'GPGPU PARTICLES', value: '16,384' },
      { label: 'ACCESSIBILITY', value: 'WCAG AA' },
      { label: 'CONTRAST RATIO', value: '7.2 : 1' },
    ],
    tags: ['React', 'TypeScript', 'Three.js', 'GPGPU Shaders', 'Vite', 'WebAudio', 'WCAG AA', 'Aceternity 3D'],
    repoUrl: 'https://github.com/Sirosiu/sirosiu-website',
    demoUrl: 'https://sirosiu.com',
    contributions: [
      'Architected custom Three.js GPGPU vector field simulating Manhattan integrated circuit routing traces behind hero layers.',
      'Designed and rendered procedural 3D silicon wafer die with damascene copper interconnects, bump contacts, and etched QR lithography.',
      'Implemented full WCAG AA accessibility compliance including semantic contrast ratios (up to 7.2:1), focus-trapped dialogs, and keyboard tab navigation.',
      'Engineered fluid responsive layouts with zero horizontal scroll overflow across all viewports from 320px foldables to ultrawide desktop monitors.',
    ],
    outcomes: [
      'Zero layout shift, 60 FPS deterministic render performance, and seamless theme synchronization without canvas flicker.',
      '100% public open-source codebase on GitHub with automated verification testing.',
    ],
    coverGradient: 'linear-gradient(135deg, rgba(215, 166, 110, 0.22), rgba(56, 189, 248, 0.2))',
    icon: '⚡',
  },
]
