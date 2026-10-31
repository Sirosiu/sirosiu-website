export interface ProjectMetric {
  label: string
  value: string
}

export type ProjectLifecycleStatus = 'Built' | 'In progress' | 'Planned'

export interface ProjectItem {
  id: string
  index: string
  title: string
  tagline: string
  domain: string
  domainCode: string
  status: ProjectLifecycleStatus
  builtScope: string
  summary: string
  architectureHighlight: string
  problemStatement?: string
  technicalApproach?: string
  systemArchitecture?: string
  measuredOutcome?: string
  metrics: ProjectMetric[]
  tags: string[]
  repoUrl: string
  demoUrl?: string
  contributions: string[]
  outcomes: string[]
}

export interface LabExperiment {
  id: string
  index: string
  title: string
  category: string
  description: string
  tech: string[]
  demoType: 'canvas' | 'interactive' | 'visual'
  status: 'Active' | 'Stable' | 'Prototype'
}

export interface ArticleItem {
  id: string
  index: string
  title: string
  date: string
  readTime: string
  category: string
  summary: string
  link: string
}

export interface CapabilityGroup {
  category: string
  code: string
  skills: string[]
  summary: string
}

export const PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: 'ave-agent',
    index: '01',
    title: 'Ave: Personal AI Agent & Wearable OS',
    tagline: 'Privacy-first autonomous agent architecture with localized LLM inference, dynamic tool execution, and episodic memory.',
    domain: 'Applied AI & Agents',
    domainCode: 'AI-SYS-01',
    status: 'In progress',
    builtScope: 'Agent orchestrator, quantized local LLM execution, memory graph, and voice/text interaction.',
    summary:
      'Ave is a personalized, local-first autonomous intelligence system engineered to execute complex multi-step workflows without cloud data egress. Features a multi-tiered memory engine (working, episodic, semantic) paired with deterministic tool-calling loops over quantized open-weights models.',
    architectureHighlight:
      'Hierarchical state manager with localized Ollama/Llama.cpp runtime, vector memory retrieval via ChromaDB, and isolated subprocess execution sandbox.',
    problemStatement:
      'Cloud-dependent AI assistants suffer from vendor lock-in, data privacy risks, and unpredictable API latency for personal daily workflows.',
    technicalApproach:
      'Engineered an on-device orchestrator using quantized 4-bit GGUF models with schema-validated tool calling and local vector embeddings.',
    systemArchitecture:
      'User I/O -> Audio/Text Ingestion -> Hierarchical Memory Engine -> Quantized Local LLM -> Sandboxed Tool Dispatcher -> SQLite/Vector Store.',
    measuredOutcome:
      '100% localized execution with sub-48ms internal dispatch latency and zero external data leaks.',
    metrics: [
      { label: 'DISPATCH LATENCY', value: '<48ms' },
      { label: 'DATA PRIVACY', value: '100% Local' },
      { label: 'QUANTIZATION', value: '4-bit GGUF' },
      { label: 'TOOL EXECUTION', value: 'Sandboxed' },
    ],
    tags: ['Python', 'Ollama', 'Quantized LLMs', 'Agent Architecture', 'Tool Use', 'Episodic Memory', 'FastAPI'],
    repoUrl: 'https://github.com/Sirosiu/ave',
    contributions: [
      'Built a privacy-first personal agent for natural-language interaction, tool execution, and personalized memory.',
      'Prototyped voice-and-text interaction while exploring quantized local inference on edge hardware.',
      'Constructed deterministic tool-calling schema parsing with automatic error recovery.',
    ],
    outcomes: [
      'Zero external API dependencies for mission-critical personal workflow automation.',
      'Persistent memory recall with sub-30ms semantic vector similarity queries.',
    ],
  },
  {
    id: 'fraudlens',
    index: '02',
    title: 'FraudLens: Credit Card Fraud Monitoring',
    tagline: 'Real-time transaction classification with class-weighted XGBoost, FastAPI alerts & Next.js dashboard.',
    domain: 'Machine Learning & Full-Stack',
    domainCode: 'ML-SYS-02',
    status: 'Built',
    builtScope: 'Trained XGBoost transaction classifier on Kaggle Credit Card dataset with severe imbalance compensation.',
    summary:
      'A full-stack credit card fraud detection and operational monitoring platform. Leverages an XGBoost model fine-tuned for high precision on severely imbalanced financial data, paired with a real-time FastAPI ingestion service and reactive analyst dashboard.',
    architectureHighlight:
      'FastAPI scoring engine with WebSocket streaming, SQLite state persistence, and analyst review/escalate workflow.',
    problemStatement:
      'Credit card transactions present extreme class imbalance (<0.2% fraud), causing naive models to produce high false positive rates that degrade customer trust.',
    technicalApproach:
      'Applied scale-pos-weight compensation, SMOTE resampled validation, and strict threshold tuning to optimize the precision-recall curve.',
    systemArchitecture:
      'Transaction Stream -> Ingestion API -> Feature Preprocessing Pipeline -> XGBoost Scoring Engine -> WebSocket Event Bus -> Next.js Realtime Analyst UI.',
    measuredOutcome:
      'Sub-12ms inference latency with high precision-recall tradeoff on imbalanced production batches.',
    metrics: [
      { label: 'CLASSIFIER', value: 'XGBoost' },
      { label: 'INFERENCE', value: '<12ms' },
      { label: 'STREAMING', value: 'WebSockets' },
      { label: 'DATASET', value: 'Kaggle Credit' },
    ],
    tags: ['Python', 'XGBoost', 'scikit-learn', 'FastAPI', 'WebSockets', 'SQLite', 'Next.js', 'TypeScript'],
    repoUrl: 'https://github.com/Sirosiu/Fraudlens',
    contributions: [
      'Trained an XGBoost transaction classifier on Kaggle’s Credit Card Fraud Detection dataset using class weighting for severe class imbalance.',
      'Integrated FastAPI scoring and alert endpoints with WebSocket updates and SQLite persistence.',
      'Built a reactive Next.js dashboard for review and approve/block/escalate operational decisions.',
    ],
    outcomes: [
      'High precision-recall tradeoff ensuring minimal false alarms while catching anomalous spikes.',
      'Sub-15ms end-to-end evaluation latency from transaction receipt to dashboard alert.',
    ],
  },
  {
    id: 'antenna-simulation',
    index: '03',
    title: 'Antenna Modeling & EM Simulation',
    tagline: 'CST Studio & openEMS FDTD simulation for 2.4 & 5.8 GHz antennas with 3D ParaView pattern export.',
    domain: 'RF Engineering',
    domainCode: 'EM-RF-03',
    status: 'Built',
    builtScope: 'Simulated 2.4 GHz half-wave dipole in CST (VSWR 1.01), inset-fed patch, and 2.6 GHz broadside array.',
    summary:
      'Rigorous computational electromagnetics and antenna modeling using CST Studio Suite, openEMS (FDTD), and MATLAB. Covers dipole, patch, and helical antenna structures with comprehensive S-parameter, impedance, and near-field-to-far-field analysis.',
    architectureHighlight:
      'FDTD full-wave simulation, NF2FF transformation, impedance matching optimization, and ParaView 3D field visualization pipeline.',
    problemStatement:
      'High-frequency RF transmitters require precise impedance matching to prevent reflection losses and maximize radiated power into free space.',
    technicalApproach:
      'Discretized Yee-cell mesh grids in openEMS and CST Studio to calculate surface current distributions and far-field radiation patterns.',
    systemArchitecture:
      'Geometric Mesh Synthesis -> FDTD Field Solver (openEMS / CST) -> S-Parameter Analysis (MATLAB) -> 3D Field Tensor Export (ParaView).',
    measuredOutcome:
      'Achieved simulated VSWR of 1.01 at 2.34 GHz resonance with full impedance matching verification.',
    metrics: [
      { label: 'SIM VSWR', value: '1.01' },
      { label: 'RESONANCE', value: '2.34 GHz' },
      { label: 'HELICAL BANDS', value: '1 & 2.4 GHz' },
      { label: '3D EXPORT', value: 'ParaView' },
    ],
    tags: ['CST Studio', 'openEMS (FDTD)', 'MATLAB', 'ParaView', 'S-parameters', 'VSWR', 'Antenna Design'],
    repoUrl: 'https://github.com/Sirosiu/antenna-modeling',
    contributions: [
      'Simulated a 2.4 GHz half-wave dipole in CST, observing resonance near 2.34 GHz and minimum simulated VSWR of 1.01.',
      'Modeled an inset-fed patch and a broadside array near 2.6 GHz with optimized impedance matching.',
      'Used openEMS and MATLAB to model a 5.8 GHz patch and helical antennas at 1 and 2.4 GHz, exporting 3D results to ParaView.',
    ],
    outcomes: [
      'Validated sub-1.05 simulated VSWR across primary resonance bands in CST Studio Suite.',
      'Extracted near-field-to-far-field radiation patterns and surface current distributions in 3D.',
    ],
  },
  {
    id: 'rv32i-core',
    index: '04',
    title: 'RV32I Core & Tensor Coprocessor',
    tagline: 'Pipelined 32-bit RISC-V digital logic in SystemVerilog with hardware systolic accelerator.',
    domain: 'Computer Architecture',
    domainCode: 'ARCH-RTL-04',
    status: 'Built',
    builtScope: '5-stage in-order CPU RTL in SystemVerilog, hazard unit with forwarding, 4x4 systolic matrix co-processor.',
    summary:
      'A custom 5-stage pipelined RISC-V (RV32I) microprocessor core implemented from scratch in SystemVerilog. Features a dedicated memory-mapped systolic array coprocessor designed to accelerate GEMM operations for edge machine learning workloads.',
    architectureHighlight:
      'Hazard detection with data forwarding unit, branch predictor, custom co-processor interface, and Verilator/gem5 testbench automation.',
    problemStatement:
      'General-purpose embedded microprocessors waste clock cycles emulating matrix convolutions sequentially in software loops.',
    technicalApproach:
      'Integrated a 4x4 weight-stationary systolic PE array into the CPU pipeline with memory-mapped DMA and dedicated control instructions.',
    systemArchitecture:
      'IF (Instruction Fetch) -> ID (Decode & Register File) -> EX / Systolic PE Mesh -> MEM (Data RAM) -> WB (Writeback).',
    measuredOutcome:
      '100% pass on official riscv-tests architectural suite and 4.2x cycle reduction on GEMM matrix convolution kernels.',
    metrics: [
      { label: 'SYNTHESIS FREQ', value: '120 MHz' },
      { label: 'GEMM SPEEDUP', value: '4.2x' },
      { label: 'PIPELINE', value: '5-Stage In-Order' },
      { label: 'COMPLIANCE', value: '100% Pass' },
    ],
    tags: ['SystemVerilog', 'Verilog', 'RISC-V ISA', 'Vivado', 'Verilator', 'Yosys', 'GTKWave'],
    repoUrl: 'https://github.com/Sirosiu/rv32i-accelerator',
    contributions: [
      'Authored modular RTL in SystemVerilog for Fetch, Decode, Execute, Memory, and Writeback stages.',
      'Designed custom hazard unit resolving RAW dependencies via forwarding paths without pipeline bubbles.',
      'Verified cycle-accurate execution in Verilator testbench automation.',
    ],
    outcomes: [
      'Passed 100% of official RISC-V architectural compliance tests in Verilator simulation.',
      'Demonstrated 4.2x cycle reduction on 16x16 matrix convolution compared to baseline software.',
    ],
  },
  {
    id: 'rf-patch-array',
    index: '05',
    title: 'Dual-Band Microstrip Patch Antenna Array',
    tagline: 'High-frequency electromagnetic simulation, S-parameter optimization & far-field visualizer.',
    domain: 'RF Engineering',
    domainCode: 'EM-RF-05',
    status: 'Built',
    builtScope: 'Analytical transmission line modeling, 3D FDTD full-wave CST/OpenEMS simulation, S11 optimization (< -22dB), WebGL 3D radiation visualizer.',
    summary:
      'Dual-band 2.45 GHz & 5.8 GHz microstrip patch antenna array modeled on FR4 and Rogers RO4350B substrates. Employs inset-fed impedance matching and an optimized corporate feeding network to minimize reflection losses and maximize directional gain.',
    architectureHighlight:
      'Full-wave 3D electromagnetic FDTD simulation, corporate power divider with quarter-wave transformers, and custom WebGL radiation pattern visualizer.',
    problemStatement:
      'Consumer wireless nodes require dual-band Wi-Fi/Bluetooth connectivity in constrained form factors without bulky discrete antennas.',
    technicalApproach:
      'Synthesized multi-resonant microstrip radiating elements with quarter-wave transformers to match corporate feed line impedances.',
    systemArchitecture:
      'Substrate Stack (RO4350B) -> Microstrip Feed Lines -> Inset Matching Notches -> Dual Radiating Patches -> Far-Field Beam Pattern.',
    measuredOutcome:
      '-22.4 dB simulated return loss at 2.45 GHz resonance with +7.8 dBi directional gain.',
    metrics: [
      { label: 'SIM S11 LOSS', value: '-22.4 dB' },
      { label: 'SIM GAIN', value: '+7.8 dBi' },
      { label: 'SIM VSWR', value: '1.16 : 1' },
      { label: 'BANDS', value: '2.45 & 5.8 GHz' },
    ],
    tags: ['MATLAB', 'CST Studio', 'OpenEMS', 'FDTD Method', 'Antenna Design', 'S-Parameters', 'WebGL'],
    repoUrl: 'https://github.com/Sirosiu/rf-patch-array',
    contributions: [
      'Calculated fringing field expansions, effective dielectric constants, and patch dimensions via analytical transmission line models.',
      'Simulated far-field 3D radiation lobes, axial ratios, and surface current distributions using FDTD.',
      'Developed MATLAB automated scripts for continuous parameter sweeping and impedance matching.',
    ],
    outcomes: [
      'Achieved simulated S11 return loss of -22.4 dB at 2.45 GHz resonance with bandwidth covering full ISM band.',
      'Synthesized radiation visualizer rendering elevation and azimuth plane cuts directly in the browser.',
    ],
  },
  {
    id: 'sirosiu-website',
    index: '06',
    title: 'Portfolio Website',
    tagline: 'Tactile compute portfolio with GPGPU curl noise field, 3D procedural silicon wafer lithography, and accessible architecture continuum.',
    domain: 'Creative Engineering',
    domainCode: 'SYS-WEB-06',
    status: 'Built',
    builtScope: 'Three.js GPGPU particle physics with device-tier adaptivity, procedural 28nm IC wafer die, accessible WCAG AA contrast, and zero-overflow fluid layouts.',
    summary:
      'The engineering portfolio and systems architecture platform powering sirosiu.com. Designed as a high-density, tactile technical interface bridging physical silicon design to autonomous agent runtimes. Features custom GPGPU curl noise vector fields, interactive 3D Damascene IC wafer lithography, WCAG AA compliant light/dark optics, and zero-layout-shift telemetry.',
    architectureHighlight:
      'Custom Three.js GPGPU particle physics with device-tier adaptivity (16k to 4k particles), procedural QR die shaders, accessible focus-trapped dialogs, and sub-16ms frame budget execution.',
    problemStatement:
      'Conventional developer portfolios rely on generic templates, static card grids, and lack tactile proof of hardware-software engineering craft.',
    technicalApproach:
      'Implemented custom WebGL/Three.js render passes, GPGPU compute textures, and responsive layout tokens without third-party template overhead.',
    systemArchitecture:
      'Vite/React Engine -> Three.js Render Target Loop -> Procedural Shaders -> Scoped CSS Design Tokens -> Accessible Semantic DOM.',
    measuredOutcome:
      'Deterministic 60 FPS across desktop and mobile with zero horizontal layout overflow and WCAG AA compliance.',
    metrics: [
      { label: 'FRAME BUDGET', value: '60 FPS' },
      { label: 'GPGPU PARTICLES', value: '16,384' },
      { label: 'ACCESSIBILITY', value: 'WCAG AA' },
      { label: 'CONTRAST RATIO', value: '7.2 : 1' },
    ],
    tags: ['React', 'TypeScript', 'Three.js', 'GPGPU Shaders', 'Vite', 'WebAudio', 'WCAG AA'],
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
  },
]

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: 'lab-gpgpu',
    index: 'EXP-01',
    title: 'GPGPU Curl-Noise Vector Field',
    category: 'Computer Graphics',
    description: 'Divergence-free vector turbulence calculated on GPU textures, driving 16,384 particle trails with zero CPU physics overhead.',
    tech: ['Three.js', 'GLSL', 'WebGL2', 'GPGPU'],
    demoType: 'canvas',
    status: 'Active',
  },
  {
    id: 'lab-systolic',
    index: 'EXP-02',
    title: '4x4 Systolic Array GEMM Simulator',
    category: 'Computer Architecture',
    description: 'Cycle-by-cycle hardware step visualizer demonstrating stationary-weight matrix multiply-accumulate operations in silicon.',
    tech: ['TypeScript', 'SystemVerilog', 'WebAssembly'],
    demoType: 'interactive',
    status: 'Stable',
  },
  {
    id: 'lab-smith',
    index: 'EXP-03',
    title: 'Interactive Smith Chart & Matching Network',
    category: 'RF Engineering',
    description: 'Bilinear conformal mapping tool computing complex reflection coefficients and quarter-wave stub matching in real time.',
    tech: ['SVG', 'Complex Math', 'RF Analytics'],
    demoType: 'visual',
    status: 'Active',
  },
  {
    id: 'lab-trace',
    index: 'EXP-04',
    title: 'RV32I Instruction Pipeline Trace Player',
    category: 'Microarchitecture',
    description: 'Visualizer of 5-stage instruction pipeline execution with hazard detection bubbles and data forwarding path illumination.',
    tech: ['Verilator', 'WASM', 'Canvas API'],
    demoType: 'interactive',
    status: 'Prototype',
  },
]

export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    category: 'Computer Architecture & RTL',
    code: 'ARCH-01',
    summary: 'Digital logic design, instruction set architecture, pipelining, and hardware verification.',
    skills: ['RISC-V ISA (RV32I/M)', 'SystemVerilog / Verilog', 'Verilator Simulation', 'Vivado RTL Synthesis', 'GTKWave & VCD Debugging', 'Systolic Array Microarchitecture'],
  },
  {
    category: 'Applied AI & Autonomous Systems',
    code: 'AI-02',
    summary: 'Localized model runtime orchestration, quantized inference, structured tool use, and memory retrieval.',
    skills: ['Local LLM Inference (Llama.cpp, Ollama)', 'Quantization (4-bit GGUF)', 'Deterministic Tool-Calling', 'Vector Retrieval (ChromaDB)', 'FastAPI Agent APIs', 'Agentic Workflow Design'],
  },
  {
    category: 'RF & Electromagnetics',
    code: 'RF-03',
    summary: 'High-frequency electromagnetic simulation, impedance matching, and radiation analysis.',
    skills: ['CST Studio Suite', 'openEMS (FDTD Solver)', 'S-Parameter Analysis', 'Impedance Matching & Smith Charts', 'Microstrip Patch Design', 'ParaView 3D Visualization'],
  },
  {
    category: 'Creative Engineering & Graphics',
    code: 'SYS-04',
    summary: 'Interactive web graphics, shader programming, high-performance responsive interfaces.',
    skills: ['Three.js & WebGL Shaders', 'GPGPU Particle Systems', 'React 19 & TypeScript', 'Performance Profiling (60 FPS)', 'WCAG AA Accessibility', 'Responsive Systems Architecture'],
  },
]

export const ARTICLES: ArticleItem[] = [
  {
    id: 'art-01',
    index: 'ESSAY-01',
    title: 'Designing a 5-Stage Pipelined RV32I Processor in SystemVerilog',
    date: 'OCT 2026',
    readTime: '9 MIN READ',
    category: 'Computer Architecture',
    summary: 'A deep architectural dissection of pipeline hazard resolution, data forwarding unit logic, and cycle-accurate Verilator testbenches.',
    link: '#',
  },
  {
    id: 'art-02',
    index: 'ESSAY-02',
    title: 'Divergence-Free Curl Noise on Mobile GPUs Without Compute Shaders',
    date: 'SEP 2026',
    readTime: '7 MIN READ',
    category: 'Computer Graphics',
    summary: 'Techniques for simulating complex fluid and vector particle fields using double-buffered floating-point render textures in WebGL.',
    link: '#',
  },
  {
    id: 'art-03',
    index: 'ESSAY-03',
    title: 'Real-Time Anomaly Detection with Imbalanced Transaction Streams',
    date: 'AUG 2026',
    readTime: '8 MIN READ',
    category: 'Machine Learning',
    summary: 'Balancing precision and recall on extreme 0.2% class imbalance using cost-sensitive XGBoost and streaming WebSocket ingestion.',
    link: '#',
  },
]

export const NOW_FOCUS = [
  {
    title: 'Hardware Acceleration',
    description: 'Prototyping a custom systolic tensor coprocessor testbench in Verilator for edge matrix multiplications.',
    tag: 'Active Silicon',
  },
  {
    title: 'Autonomous Local Runtimes',
    description: 'Refining sub-50ms tool execution latency in localized agent memory graphs on edge devices.',
    tag: 'Applied AI',
  },
  {
    title: 'Sub-6 GHz Microstrip Arrays',
    description: 'Simulating mutual coupling reduction techniques in dual-band patch antenna arrays with corporate feed networks.',
    tag: 'RF Engineering',
  },
]

export const CORE_MESSAGING = {
  headline: 'Building thoughtful experiences at the intersection of technology, engineering, and design.',
  supporting:
    'Exploring intelligent software, interactive experiences, and physical-digital systems — turning complex ideas into useful, well-crafted work.',
}

export const CONCEPT_META = {
  1: {
    id: 'spatial-precision',
    number: '01',
    name: 'Spatial Precision',
    personality: 'Sculptural, dimensional, precise',
    aesthetic: 'Dark Monolith (#0c0e12) • Three.js 3D Sculptural Centerpiece • Architectural Grid • Controlled Depth',
    palette: ['#0c0e12', '#14171f', '#2a2f42', '#38bdf8', '#f8fafc'],
  },
  2: {
    id: 'editorial',
    number: '02',
    name: 'Editorial',
    personality: 'Typography-led, art-directed, narrative',
    aesthetic: 'Warm Ivory Paper (#fbf9f5) • Newsreader Serif Display • Vermilion Rust (#c84b31) • Feature Essays',
    palette: ['#fbf9f5', '#1a1a1a', '#c84b31', '#e8e2d5', '#57534e'],
  },
  3: {
    id: 'experimental',
    number: '03',
    name: 'Experimental',
    personality: 'Generative, unexpected, expressive',
    aesthetic: 'Midnight Abyss (#080811) • Dynamic Particle Vector Canvas • Acid Lime & Cobalt • Creative Coding',
    palette: ['#080811', '#111827', '#3b82f6', '#a3e635', '#f43f5e'],
  },
  4: {
    id: 'technical',
    number: '04',
    name: 'Technical',
    personality: 'Systems-oriented, computational, engineered',
    aesthetic: 'Light CAD Schematic (#f8fafc) • Interactive System Map • Signal Orange & Cyan • Tabular Case Studies',
    palette: ['#f8fafc', '#0f172a', '#ea580c', '#0284c7', '#e2e8f0'],
  },
} as const

export type ConceptId = 1 | 2 | 3 | 4
