import React, { useState } from 'react';
import './TechnicalStyles.css';

interface SchematicNode {
  id: string;
  tier: string;
  label: string;
  sublabel: string;
  clockDomain: string;
  busProtocol: string;
  powerEnvelope: string;
  latency: string;
  connectedProjectCode: string;
  rtlSnippet: string;
}

interface TechnicalSpecSheet {
  code: string;
  docId: string;
  title: string;
  tierBinding: string;
  verificationStatus: string;
  problem: string;
  approach: string;
  architecture: string;
  outcome: string;
  metrics: { param: string; spec: string; unit: string }[];
  toolchain: string[];
}

const SCHEMATIC_NODES: SchematicNode[] = [
  {
    id: 'NODE-T1-RF',
    tier: 'TIER 01 // RF & ANALOG FRONTEND',
    label: '28GHz Phased Array & LNA/ADC',
    sublabel: 'Rogers RO4003C // 24-Bit SPI-TDM',
    clockDomain: '28.0 GHz RF / 32 kHz Baseband',
    busProtocol: '50Ω Corporate Wilkinson / SPI-TDM',
    powerEnvelope: '142 mW',
    latency: '14.2 µs Group Delay',
    connectedProjectCode: 'EM-RF-05',
    rtlSnippet: `// SMITH IMPEDANCE & PHASED ARRAY STEERING
Z_in = Z_0 * (Z_L + j*Z_0*tan(beta*l)) / (Z_0 + j*Z_L*tan(beta*l));
AF(theta) = sum_{n=0}^{N-1} I_n * exp(j * n * (k*d*sin(theta) + beta_steer));`,
  },
  {
    id: 'NODE-T2-RTL',
    tier: 'TIER 02 // RTL & MICROARCHITECTURE',
    label: '5-Stage RV32I Core & Hazard Unit',
    sublabel: 'Verilog HDL // Forwarding Muxes',
    clockDomain: '185 MHz Synthesized (Artix-7)',
    busProtocol: 'AXI4-Lite / 32-Bit Register Bypass',
    powerEnvelope: '310 mW Dynamic',
    latency: '1.18 CPI (Single-Cycle Forward)',
    connectedProjectCode: 'ARCH-RTL-04',
    rtlSnippet: `// EX/MEM & MEM/WB DATA FORWARDING LOGIC
always @(*) begin
  if (ex_mem_regwrite && (ex_mem_rd != 5'b0) && (ex_mem_rd == id_ex_rs1))
    forward_a = 2'b10; // Forward from EX/MEM ALU Out
  else if (mem_wb_regwrite && (mem_wb_rd != 5'b0) && (mem_wb_rd == id_ex_rs1))
    forward_a = 2'b01; // Forward from MEM/WB Writeback
  else
    forward_a = 2'b00;
end`,
  },
  {
    id: 'NODE-T3-SYS',
    tier: 'TIER 03 // KERNEL & DMA RUNTIME',
    label: 'Zero-Copy Ring Buffer & Syscall Bridge',
    sublabel: 'Rust / C++20 // Arch Linux Hyprland',
    clockDomain: '4.9 GHz Host Core (i7-13650HX)',
    busProtocol: 'Lock-Free SPSC Atomic Ring / PCIe Gen4',
    powerEnvelope: 'Zero-Allocation Heap',
    latency: '1.1 µs Thread Wakeup',
    connectedProjectCode: 'SYS-WEB-06',
    rtlSnippet: `// LOCK-FREE SPSC RING BUFFER ACQUIRE/RELEASE
pub fn push_frame(&self, sample: AudioFrame) -> bool {
    let head = self.head.load(Ordering::Relaxed);
    let next = (head + 1) & self.mask;
    if next == self.tail.load(Ordering::Acquire) { return false; }
    unsafe { *self.buffer.get_unchecked_mut(head) = sample; }
    self.head.store(next, Ordering::Release);
    true
}`,
  },
  {
    id: 'NODE-T4-AI',
    tier: 'TIER 04 // APPLIED ML & AGENT ENGINE',
    label: 'A.V.E. Runtime & FraudLens Graph Scorer',
    sublabel: 'INT4 GGUF + HNSW + XGBoost/TabNet',
    clockDomain: 'CUDA Tensor Core / SIMD AVX2',
    busProtocol: 'Zero-Copy Shared Memory / Redis Stream',
    powerEnvelope: '4.2 GB VRAM Footprint',
    latency: '6.4 ms P99 Anomaly / 184 ms Voice',
    connectedProjectCode: 'AI-SYS-01',
    rtlSnippet: `// HYBRID HNSW EPISODIC RECALL + QUANTIZED LOGITS
context_vec = hnsw_index.search_knn(query_embedding, k=5, ef=64)
shap_values = explainer.shap_values(graph_velocity_tensor)
tokens = llama_eval_int4(ctx, prompt_tokens, temp=0.15)`,
  },
];

const SPEC_SHEETS: TechnicalSpecSheet[] = [
  {
    code: 'AI-SYS-01',
    docId: 'SPEC-DOC // 2026-A1',
    title: 'A.V.E. — Autonomous Voice & Episodic Memory Kernel',
    tierBinding: 'TIER 03 + TIER 04',
    verificationStatus: 'SILICON & OS VERIFIED',
    problem:
      'Cloud-tethered LLM assistants introduce 800ms+ network round-trip latency, leak private telemetry, and suffer total episodic memory loss across sessions.',
    approach:
      'Architect a sovereign local daemon on Linux combining streaming C++ Whisper VAD, a dual HNSW vector + SQLite WAL deterministic state ledger, and 4-bit quantized local LLM inference.',
    architecture:
      '[ALSA/PipeWire Audio Ring] ──► [Whisper C++ Stream] ──► [HNSW + SQLite Episodic Recall] ──► [INT4 Transformer + Rust Tool Sandbox]',
    outcome:
      'Achieved 184ms wake-to-first-token latency, 99.2% top-5 episodic recall accuracy, and deterministic local OS control inside a 4.2GB VRAM envelope.',
    metrics: [
      { param: 'Wake-to-Token Latency', spec: '184', unit: 'ms' },
      { param: 'Quantization Precision', spec: 'INT4_K_M', unit: 'GGUF' },
      { param: 'Episodic Recall @ K=5', spec: '99.2', unit: '%' },
    ],
    toolchain: ['Rust', 'C++20', 'Python', 'llama.cpp', 'SQLite WAL', 'Arch Linux'],
  },
  {
    code: 'ML-SYS-02',
    docId: 'SPEC-DOC // 2026-M2',
    title: 'FraudLens — High-Frequency Graph Anomaly Engine',
    tierBinding: 'TIER 04 // APPLIED ML',
    verificationStatus: 'BENCHMARK VERIFIED',
    problem:
      'Rule-based payment filters fail to catch coordinated multi-hop velocity fraud while generating excessive false-positive declines under high transaction load.',
    approach:
      'Extract sub-2ms sliding-window graph centrality and velocity features feeding a calibrated XGBoost + TabNet ensemble with inline SHAP attribution.',
    architecture:
      '[Redis Transaction Stream] ──► [Temporal Graph Feature Extractor] ──► [GBDT + TabNet Ensemble] ──► [SHAP Compliance Payload]',
    outcome:
      'Sustained 14,800 transactions/sec at 6.4ms P99 tail latency, achieving 0.964 PR-AUC and reducing false-positive customer lockouts by 41.8%.',
    metrics: [
      { param: 'P99 Tail Latency', spec: '6.4', unit: 'ms' },
      { param: 'Precision-Recall AUC', spec: '0.964', unit: 'Ratio' },
      { param: 'Throughput Capacity', spec: '14,800', unit: 'TPS' },
    ],
    toolchain: ['PyTorch', 'XGBoost', 'ONNX Runtime', 'FastAPI', 'Redis', 'SHAP'],
  },
  {
    code: 'EM-RF-03',
    docId: 'SPEC-DOC // 2026-R3',
    title: 'Full-Wave Electromagnetic Antenna & Smith Solver',
    tierBinding: 'TIER 01 // EM-RF',
    verificationStatus: 'EM FIELD VERIFIED',
    problem:
      'Impedance mismatches between RF power amplifiers and radiating elements cause severe reflected power (VSWR > 2.0) and degraded radiation efficiency.',
    approach:
      'Formulate a 3D spherical far-field radiation solver paired with automated complex Smith Chart conjugate matching network synthesis.',
    architecture:
      '[Geometry Excitation] ──► [3D Far-Field E/H Solver] ──► [S-Parameter Matrix] ──► [Quarter-Wave / LC Smith Match]',
    outcome:
      'Synthesized matching topologies yielding -28.4 dB return loss (S11), 1.14:1 VSWR, and 93.6% radiation efficiency across target bands.',
    metrics: [
      { param: 'Return Loss (S11)', spec: '-28.4', unit: 'dB' },
      { param: 'Realized Peak Gain', spec: '8.72', unit: 'dBi' },
      { param: 'Standing Wave Ratio', spec: '1.14 : 1', unit: 'VSWR' },
    ],
    toolchain: ['Keysight ADS', 'Python', 'NumPy/SciPy', 'MATLAB', 'Smith Chart CAD'],
  },
  {
    code: 'ARCH-RTL-04',
    docId: 'SPEC-DOC // 2026-C4',
    title: 'RV32I — 5-Stage Pipelined RISC-V Processor Core',
    tierBinding: 'TIER 02 // RTL CORE',
    verificationStatus: 'RTL SYNTHESIZED',
    problem:
      'Unmitigated data and control hazards in pipelined processors force multi-cycle NOP stalls that collapse instruction throughput.',
    approach:
      'Design a complete 5-stage (IF-ID-EX-MEM-WB) RV32I core in Verilog HDL with full EX/MEM and MEM/WB bypass multiplexers and load-use interlock logic.',
    architecture:
      '[IF Stage] ──► [ID + Hazard Unit] ──► [EX + Forwarding Mux] ──► [MEM Stage] ──► [WB RegFile]',
    outcome:
      'Verified cycle-accurate execution via Verilator & GTKWave, achieving 1.18 CPI and 185 MHz synthesis on Xilinx Artix-7 FPGA within 1,840 LUTs.',
    metrics: [
      { param: 'Max Synthesized Clock', spec: '185', unit: 'MHz' },
      { param: 'Cycles Per Instruction', spec: '1.18', unit: 'CPI' },
      { param: 'FPGA Resource Count', spec: '1,840', unit: 'LUTs' },
    ],
    toolchain: ['Verilog HDL', 'Verilator', 'Icarus Verilog', 'Yosys', 'GTKWave', 'Vivado'],
  },
  {
    code: 'EM-RF-05',
    docId: 'SPEC-DOC // 2026-R5',
    title: '28GHz Phased Microstrip Patch Antenna Array',
    tierBinding: 'TIER 01 // mmWAVE RF',
    verificationStatus: 'EM CHARACTERIZED',
    problem:
      'High atmospheric attenuation and surface-wave mutual coupling degrade millimeter-wave 5G beamforming arrays.',
    approach:
      'Engineer a 4x4 inset-fed microstrip patch array on Rogers RO4003C substrate utilizing a corporate Wilkinson feed network and Defected Ground Structures (DGS).',
    architecture:
      '[50Ω Coax Input] ──► [Wilkinson Corporate Divider] ──► [Phase Shifters] ──► [4x4 Patch Aperture + DGS Slots]',
    outcome:
      'Delivered 16.4 dBi broadside gain, -19.2 dB side-lobe suppression, and ±42° phase-steered azimuth scanning.',
    metrics: [
      { param: 'Array Realized Gain', spec: '16.4', unit: 'dBi' },
      { param: 'Side-Lobe Suppression', spec: '-19.2', unit: 'dB' },
      { param: 'Beam Steering Sector', spec: '±42', unit: 'Deg' },
    ],
    toolchain: ['Keysight ADS', 'HFSS / EM Pro', 'Rogers RO4003C', 'RF PCB Layout'],
  },
  {
    code: 'SYS-WEB-06',
    docId: 'SPEC-DOC // 2026-W6',
    title: 'SIROSIU — Multi-Paradigm Engineering Telemetry Engine',
    tierBinding: 'TIER 03 // UI KERNEL',
    verificationStatus: 'PRODUCTION LIVE',
    problem:
      'Conventional developer portfolios rely on bloated templates that fail to communicate deep hardware, RF, and systems architecture rigor.',
    approach:
      'Build a deterministic 4-concept instrumentation platform uniting WebGL PBR monoliths, Swiss print grids, curl-noise physics, and interactive EDA schematics.',
    architecture:
      '[State Router] ──► [WebGL / Canvas Physics Loop] ──► [EDA Schematic State Machine] ──► [320px Zero-Overflow Grid]',
    outcome:
      'Locked 60fps performance (<6ms frame budget) with zero horizontal overflow across all viewport widths from 320px to 3840px.',
    metrics: [
      { param: 'Frame Render Budget', spec: '< 6.2', unit: 'ms' },
      { param: 'Viewport Resilience', spec: '320–3840', unit: 'px' },
      { param: 'Concept Engines', spec: '04', unit: 'Worlds' },
    ],
    toolchain: ['TypeScript', 'React', 'Three.js', 'SVG CAD', 'CSS Grid'],
  },
];

export const Concept04Technical: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<SchematicNode>(SCHEMATIC_NODES[1]);
  const [filterCode, setFilterCode] = useState<string>('ALL');

  const handleNodeSelect = (node: SchematicNode) => {
    setSelectedNode(node);
  };

  const handleInspectSpec = (code: string) => {
    setFilterCode(code);
    const target = document.getElementById('c4-specs');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const displayedSpecs =
    filterCode === 'ALL'
      ? SPEC_SHEETS
      : SPEC_SHEETS.filter((s) => s.code === filterCode);

  return (
    <div className="c4-tech-root">
      {/* TOP EDA INSTRUMENTATION BAR */}
      <header className="c4-eda-topbar">
        <div className="c4-eda-brand">
          <span className="c4-pcb-badge">SIROSIU // SHINO-SILICON</span>
          <span className="c4-mono-slate">CAD/EDA WORKBENCH v3.04</span>
        </div>

        <nav className="c4-eda-nav" aria-label="Technical Workbench Navigation">
          <a href="#c4-schematic">01.SCHEMATIC</a>
          <a href="#c4-specs">02.SPEC_SHEETS</a>
          <a href="#c4-toolchains">03.TOOLCHAINS</a>
          <a href="#c4-verification">04.BENCHMARKS</a>
          <a href="#c4-principles">05.AXIOMS</a>
          <a href="#c4-notes">06.APP_NOTES</a>
          <a href="#c4-io">07.IO_PORTS</a>
        </nav>

        <div className="c4-eda-status">
          <span className="c4-cyan-pill">DRC: 0 ERRORS</span>
          <span className="c4-orange-pill">LVS: MATCHED</span>
        </div>
      </header>

      {/* SECTION 01: HERO & INTERACTIVE 4-TIER SYSTEMS SCHEMATIC */}
      <section id="c4-schematic" className="c4-schematic-section">
        <div className="c4-title-block">
          <div className="c4-title-left">
            <span className="c4-mono-orange">
              DRAWING NO. SIR-2026-ARCH // SCALE: 1:1 // DR. B. R. AMBEDKAR NIT JALANDHAR (ECE)
            </span>
            <h1 className="c4-main-heading">
              CROSS-STACK SYSTEMS ARCHITECTURE &amp; SILICON TELEMETRY
            </h1>
            <p className="c4-main-sub">
              Principal Engineer: <strong>Ankush Malothia (Sirosiu)</strong> — Vertical integration
              spanning 28GHz RF/Analog Frontends, 5-Stage RISC-V RTL Cores, Linux Kernel DMA
              Runtimes, and Sovereign AI Inference.
            </p>
          </div>
          <div className="c4-silkscreen-stamp">
            <div>REV 3.0 // SHINO</div>
            <div>TOLERANCE: ±0.01mm</div>
            <div>STATUS: RELEASED</div>
          </div>
        </div>

        {/* Interactive Schematic Workbench Split */}
        <div className="c4-workbench-grid">
          {/* Left Interactive 4-Tier Diagram + SVG Bus Matrix */}
          <div className="c4-schematic-canvas-box">
            <div className="c4-box-header">
              <span>INTERACTIVE 4-TIER HARDWARE/SOFTWARE SCHEMATIC (CLICK ANY MODULE TO PROBE)</span>
              <span className="c4-mono-cyan">ACTIVE PROBE: {selectedNode.id}</span>
            </div>

            <div className="c4-tiers-stack">
              {SCHEMATIC_NODES.map((node, index) => {
                const isSelected = node.id === selectedNode.id;
                return (
                  <React.Fragment key={node.id}>
                    <button
                      type="button"
                      onClick={() => handleNodeSelect(node)}
                      className={`c4-schematic-node ${isSelected ? 'is-probed' : ''}`}
                    >
                      <div className="c4-node-meta-row">
                        <span className="c4-node-tier">{node.tier}</span>
                        <span className="c4-node-clk">{node.clockDomain}</span>
                      </div>
                      <div className="c4-node-main-row">
                        <div>
                          <h2 className="c4-node-title">{node.label}</h2>
                          <span className="c4-node-sub">{node.sublabel}</span>
                        </div>
                        <span
                          className="c4-node-ref-tag"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInspectSpec(node.connectedProjectCode);
                          }}
                          title="Jump to verified engineering spec sheet"
                        >
                          REF: {node.connectedProjectCode} ↗
                        </span>
                      </div>
                    </button>

                    {/* Orthogonal Animated Bus Interconnect between Tiers */}
                    {index < SCHEMATIC_NODES.length - 1 && (
                      <div className="c4-bus-connector" aria-hidden="true">
                        <svg viewBox="0 0 400 32" className="c4-bus-svg" preserveAspectRatio="none">
                          <line
                            x1="60"
                            y1="0"
                            x2="60"
                            y2="32"
                            stroke="#94a3b8"
                            strokeWidth="2"
                          />
                          <line
                            x1="200"
                            y1="0"
                            x2="200"
                            y2="32"
                            className="c4-bus-trace-active"
                          />
                          <line
                            x1="340"
                            y1="0"
                            x2="340"
                            y2="32"
                            stroke="#0284c7"
                            strokeWidth="1.5"
                            strokeDasharray="4 4"
                          />
                        </svg>
                        <span className="c4-bus-label">
                          AXI4 / DMA / SPI-TDM INTERCONNECT BUS ({node.busProtocol})
                        </span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Right Live Hardware Telemetry & RTL Probe Inspector */}
          <aside className="c4-probe-inspector">
            <div className="c4-box-header">
              <span>OSCILLOSCOPE &amp; RTL NODE INSPECTOR</span>
              <span className="c4-mono-orange">{selectedNode.id}</span>
            </div>

            <div className="c4-probe-body">
              <div className="c4-probe-title-row">
                <h3>{selectedNode.label}</h3>
                <button
                  type="button"
                  onClick={() => handleInspectSpec(selectedNode.connectedProjectCode)}
                  className="c4-cyan-pill c4-probe-link-btn"
                  title="Cross-probe into Verified Spec Sheet"
                >
                  {selectedNode.connectedProjectCode} [VIEW SPEC →]
                </button>
              </div>

              <div className="c4-probe-kv-grid">
                <div className="c4-probe-kv">
                  <span>CLOCK DOMAIN</span>
                  <strong>{selectedNode.clockDomain}</strong>
                </div>
                <div className="c4-probe-kv">
                  <span>BUS PROTOCOL</span>
                  <strong>{selectedNode.busProtocol}</strong>
                </div>
                <div className="c4-probe-kv">
                  <span>POWER ENVELOPE</span>
                  <strong>{selectedNode.powerEnvelope}</strong>
                </div>
                <div className="c4-probe-kv">
                  <span>CRITICAL TIMING</span>
                  <strong className="c4-orange-text">{selectedNode.latency}</strong>
                </div>
              </div>

              {/* Simulated Logic Analyzer Waveform SVG */}
              <div className="c4-waveform-box">
                <div className="c4-waveform-head">
                  <span>GTKWave // LOGIC ANALYZER TRACE</span>
                  <span>TIMEBASE: 5.0 ns/div</span>
                </div>
                <svg viewBox="0 0 420 76" className="c4-waveform-svg">
                  <text x="6" y="18" fontSize="9" fontFamily="JetBrains Mono" fill="#475569">
                    CLK_SYS
                  </text>
                  <path
                    d="M 70 22 L 70 8 L 95 8 L 95 22 L 120 22 L 120 8 L 145 8 L 145 22 L 170 22 L 170 8 L 195 8 L 195 22 L 220 22 L 220 8 L 245 8 L 245 22 L 270 22 L 270 8 L 295 8 L 295 22 L 320 22 L 320 8 L 345 8 L 345 22 L 370 22 L 370 8 L 395 8 L 395 22"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                  />
                  <text x="6" y="46" fontSize="9" fontFamily="JetBrains Mono" fill="#475569">
                    VALID_EN
                  </text>
                  <path
                    d="M 70 48 L 120 48 L 120 34 L 295 34 L 295 48 L 395 48"
                    fill="none"
                    stroke="#ea580c"
                    strokeWidth="1.6"
                  />
                  <text x="6" y="70" fontSize="9" fontFamily="JetBrains Mono" fill="#475569">
                    DATA_BUS
                  </text>
                  <path
                    d="M 70 68 L 120 68 L 126 56 L 240 56 L 246 68 L 395 68 M 120 56 L 126 68 L 240 68 L 246 56"
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="1.3"
                  />
                </svg>
              </div>

              <div className="c4-code-block">
                <div className="c4-code-head">SYNTHESIS / KERNEL IMPLEMENTATION SNIPPET</div>
                <pre>
                  <code>{selectedNode.rtlSnippet}</code>
                </pre>
              </div>

              <button
                type="button"
                className="c4-filter-btn"
                onClick={() => setFilterCode(selectedNode.connectedProjectCode)}
              >
                ISOLATE SPEC SHEET [{selectedNode.connectedProjectCode}] BELOW ↓
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* SECTION 02: SELECTED WORK — IEEE / DARPA 4-QUADRANT SPECIFICATION SHEETS */}
      <section id="c4-specs" className="c4-section">
        <div className="c4-section-header">
          <div>
            <span className="c4-mono-orange">02 // ENGINEERING SPECIFICATION SHEETS</span>
            <h2 className="c4-section-title">
              VERIFIED SYSTEMS REGISTRY (PROBLEM / APPROACH / ARCHITECTURE / OUTCOME)
            </h2>
          </div>

          <div className="c4-filter-bar">
            <button
              type="button"
              onClick={() => setFilterCode('ALL')}
              className={`c4-chip-btn ${filterCode === 'ALL' ? 'is-active' : ''}`}
            >
              ALL SPECS [06]
            </button>
            {SPEC_SHEETS.map((s) => (
              <button
                key={s.code}
                type="button"
                onClick={() => setFilterCode(s.code)}
                className={`c4-chip-btn ${filterCode === s.code ? 'is-active' : ''}`}
              >
                {s.code}
              </button>
            ))}
          </div>
        </div>

        <div className="c4-specs-stack">
          {displayedSpecs.map((sheet) => (
            <article key={sheet.code} className="c4-spec-sheet">
              <div className="c4-spec-topbar">
                <div className="c4-spec-id-group">
                  <span className="c4-spec-code">{sheet.code}</span>
                  <span className="c4-mono-slate">{sheet.docId}</span>
                  <span className="c4-cyan-pill">{sheet.tierBinding}</span>
                </div>
                <span className="c4-status-stamp">{sheet.verificationStatus}</span>
              </div>

              <h3 className="c4-spec-title">{sheet.title}</h3>

              {/* 4-Quadrant Engineering Spec Grid */}
              <div className="c4-quadrant-grid">
                <div className="c4-quadrant">
                  <div className="c4-quad-label">01 // PROBLEM STATEMENT &amp; BOTTLENECK</div>
                  <p>{sheet.problem}</p>
                </div>
                <div className="c4-quadrant">
                  <div className="c4-quad-label">02 // FIRST-PRINCIPLES APPROACH</div>
                  <p>{sheet.approach}</p>
                </div>
                <div className="c4-quadrant">
                  <div className="c4-quad-label">03 // SYSTEM ARCHITECTURE TOPOLOGY</div>
                  <code className="c4-topology-pipe">{sheet.architecture}</code>
                </div>
                <div className="c4-quadrant">
                  <div className="c4-quad-label">04 // VERIFIED SILICON / RUNTIME OUTCOME</div>
                  <p>{sheet.outcome}</p>
                </div>
              </div>

              {/* Bottom Parametric Table & Toolchain */}
              <div className="c4-spec-footer">
                <div className="c4-param-row">
                  {sheet.metrics.map((m) => (
                    <div key={m.param} className="c4-param-cell">
                      <span className="c4-param-name">{m.param}</span>
                      <strong className="c4-param-val">
                        {m.spec} <small>{m.unit}</small>
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="c4-toolchain-list">
                  {sheet.toolchain.map((t) => (
                    <span key={t} className="c4-tool-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 03: CAPABILITIES — EDA & SYSTEMS TOOLCHAIN MATRIX */}
      <section id="c4-toolchains" className="c4-section">
        <div className="c4-section-header">
          <div>
            <span className="c4-mono-orange">03 // PRODUCTION TOOLCHAINS</span>
            <h2 className="c4-section-title">HARDWARE, RFIC &amp; KERNEL CAPABILITY MATRIX</h2>
          </div>
        </div>

        <div className="c4-cap-table-wrap">
          <table className="c4-cap-table">
            <thead>
              <tr>
                <th>TIER ID</th>
                <th>ENGINEERING DOMAIN</th>
                <th>PRIMARY EDA / COMPILER SUITE</th>
                <th>VERIFICATION PROTOCOL</th>
                <th>TARGET ARTIFACT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="c4-mono-orange">T1 // EM-RF</td>
                <td>RFIC &amp; Phased Antenna Arrays</td>
                <td>Keysight ADS, Cadence IC, HFSS</td>
                <td>S-Parameters (S11/S21), Smith Match, Far-Field Gain</td>
                <td>28GHz 4x4 Microstrip Array</td>
              </tr>
              <tr>
                <td className="c4-mono-cyan">T2 // ARCH-RTL</td>
                <td>Computer Architecture &amp; FPGA</td>
                <td>Vivado/Vitis, Verilator, Yosys, Icarus, GTKWave</td>
                <td>Cycle-Accurate C++ Testbenches, Timing Closure</td>
                <td>5-Stage Pipelined RV32I Core</td>
              </tr>
              <tr>
                <td className="c4-mono-orange">T3 // SYS-OS</td>
                <td>Systems Programming &amp; Linux</td>
                <td>Rust, C++20, Arch Linux (Hyprland), Rocky/RHEL</td>
                <td>Lock-Free Atomics, Zero-Copy DMA, Perf Profiling</td>
                <td>A.V.E. Syscall &amp; Audio Engine</td>
              </tr>
              <tr>
                <td className="c4-mono-cyan">T4 // AI-BCI</td>
                <td>Applied ML &amp; Neural Interfaces</td>
                <td>PyTorch, ONNX, llama.cpp (GGUF), MNE/SciPy DSP</td>
                <td>PR-AUC Calibration, SHAP Attribution, EEG CSP</td>
                <td>FraudLens &amp; BCI Motor Classifier</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 04: LAB — HARDWARE & SIGNAL BENCHMARKS */}
      <section id="c4-verification" className="c4-section">
        <div className="c4-section-header">
          <div>
            <span className="c4-mono-orange">04 // VERIFICATION LAB</span>
            <h2 className="c4-section-title">BENCHMARK &amp; OSCILLOSCOPE PROBES</h2>
          </div>
        </div>

        <div className="c4-lab-cards">
          <div className="c4-chamfer-box">
            <span className="c4-mono-cyan">PROBE // LAB-01</span>
            <h3>EEG Motor-Imagery Spectral Filter Bank</h3>
            <p>
              Spatial-frequency decomposition of 8–30Hz sensorimotor rhythms (Mu/Beta bands) using
              Common Spatial Patterns for non-invasive Brain-Computer Interface command routing.
            </p>
          </div>
          <div className="c4-chamfer-box">
            <span className="c4-mono-orange">PROBE // LAB-02</span>
            <h3>AVX2 INT8 Matrix Microkernel</h3>
            <p>
              Cache-aligned SIMD GEMM kernel written in C++ intrinsics achieving 89% peak theoretical
              throughput on Intel Core i7-13650HX mobile silicon.
            </p>
          </div>
          <div className="c4-chamfer-box">
            <span className="c4-mono-cyan">PROBE // LAB-03</span>
            <h3>Wilkinson Quarter-Wave Corporate Feed</h3>
            <p>
              Equal-split phase-balanced RF power distribution network with isolation resistors
              suppressing port-to-port crosstalk below -26 dB.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 05 & 06: AXIOMS (PHILOSOPHY) + APPLICATION NOTES (WRITING) */}
      <section id="c4-principles" className="c4-section">
        <div className="c4-dual-panel">
          <div className="c4-chamfer-box c4-axioms-panel">
            <span className="c4-mono-orange">05 // ENGINEERING AXIOMS</span>
            <h2>FIRST-PRINCIPLES DESIGN RULES</h2>
            <ol className="c4-axiom-list">
              <li>
                <strong>Measure in Nanoseconds and Decibels:</strong> Never claim a system is fast
                or clean without P99 latency histograms, LUT counts, or S11 return-loss plots.
              </li>
              <li>
                <strong>Own the Full Vertical:</strong> When an AI model stalls, trace it down
                through the Python binding, C++ allocator, kernel page table, cache line, and RTL
                pipeline stage.
              </li>
              <li>
                <strong>Zero Unforced Abstractions:</strong> Every layer must justify its silicon
                and memory footprint.
              </li>
            </ol>
            <div className="c4-stamp-row">
              <span>ANKUSH MALOTHIA // SIROSIU</span>
              <span>MARK: SHINO</span>
            </div>
          </div>

          <div id="c4-notes" className="c4-chamfer-box c4-notes-panel">
            <span className="c4-mono-cyan">06 // APPLICATION NOTES (WRITING)</span>
            <h2>RECENT TECHNICAL MONOGRAPHS</h2>
            <div className="c4-appnotes-stack">
              <div className="c4-appnote-item">
                <span className="c4-mono-orange">AN-2026-01 // RTL</span>
                <h4>Resolving RAW Hazards in 5-Stage RISC-V Cores</h4>
                <p>Complete gate-level forwarding multiplexer equations and Verilator waveforms.</p>
              </div>
              <div className="c4-appnote-item">
                <span className="c4-mono-cyan">AN-2026-02 // RFIC</span>
                <h4>Defected Ground Structures in 28GHz Patch Arrays</h4>
                <p>Mitigating substrate surface waves on Rogers RO4003C laminates.</p>
              </div>
              <div className="c4-appnote-item">
                <span className="c4-mono-orange">AN-2026-03 // AI-SYS</span>
                <h4>Hybrid HNSW + SQLite WAL for Sovereign Agent Memory</h4>
                <p>Sub-15ms episodic recall without external vector database daemons.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 07 & 08: NOW TELEMETRY + I/O PORTS (CONTACT) */}
      <section id="c4-io" className="c4-section">
        <div className="c4-dual-panel">
          <div className="c4-chamfer-box">
            <span className="c4-mono-cyan">07 // OPERATIONAL TELEMETRY (NOW — NOV 2026)</span>
            <h2>CURRENT WORKSTATION &amp; R&amp;D STATE</h2>
            <dl className="c4-io-dl">
              <div>
                <dt>INSTITUTION &amp; DEGREE</dt>
                <dd>B.Tech ECE (3rd Year / 5th Sem), NIT Jalandhar</dd>
              </div>
              <div>
                <dt>PRIMARY R&amp;D ROADMAP</dt>
                <dd>Brain-Computer Interfaces (BCI) + AI Hardware Accelerators + RFIC</dd>
              </div>
              <div>
                <dt>HARDWARE WORKSTATION</dt>
                <dd>Lenovo LOQ 15IRX9 (i7-13650HX, RTX 4050, Multi-Boot Arch Hyprland)</dd>
              </div>
              <div>
                <dt>PHYSICAL PROTOCOL</dt>
                <dd>6-Day Resistance Split // 18:32 5.2km Run // Calisthenics Progression</dd>
              </div>
            </dl>
          </div>

          <div className="c4-chamfer-box">
            <span className="c4-mono-orange">08 // EXTERNAL I/O PORTS (CONTACT)</span>
            <h2>INITIATE TECHNICAL TRANSMISSION</h2>
            <p className="c4-io-desc">
              Direct engineering communication buses for hardware/ML roles, research collaborations,
              and systems consulting.
            </p>
            <div className="c4-io-ports">
              <a href="mailto:ankush@sirosiu.com" className="c4-port-link">
                <span>PORT_01 // SMTP_DIRECT</span>
                <strong>ankush@sirosiu.com →</strong>
              </a>
              <a
                href="https://github.com/sirosiu"
                target="_blank"
                rel="noreferrer"
                className="c4-port-link"
              >
                <span>PORT_02 // GIT_SOURCE</span>
                <strong>github.com/sirosiu →</strong>
              </a>
              <a
                href="https://sirosiu.com"
                target="_blank"
                rel="noreferrer"
                className="c4-port-link"
              >
                <span>PORT_03 // MASTER_DOMAIN</span>
                <strong>sirosiu.com // SHINO →</strong>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 09: PCB SILKSCREEN FOOTER */}
      <footer className="c4-footer">
        <div className="c4-footer-inner">
          <span>SIROSIU CORP // ANKUSH MALOTHIA — SCHEMATIC REV 3.04 (2026)</span>
          <span>SIGNATURE SILKSCREEN: SHINO // CONCEPT 04 TECHNICAL EDA</span>
        </div>
      </footer>
    </div>
  );
};

export default Concept04Technical;