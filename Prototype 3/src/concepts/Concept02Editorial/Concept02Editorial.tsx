import React, { useState } from 'react';
import './EditorialStyles.css';

interface EditorialArticle {
  folio: string;
  code: string;
  title: string;
  subtitle: string;
  discipline: string;
  dropcapLead: string;
  bodyColumns: string[];
  footnoteId: string;
  footnoteText: string;
  specs: { k: string; v: string }[];
  figureCaption: string;
}

const FEATURE_STORIES: EditorialArticle[] = [
  {
    folio: 'FOLIO I // PP. 04–11',
    code: 'AI-SYS-01',
    title: 'A.V.E. — Sovereign Cognitive Architecture',
    subtitle: 'On constructing an autonomous voice & episodic memory runtime outside cloud hegemony.',
    discipline: 'AUTONOMOUS SYSTEMS & LOCAL INFERENCE',
    dropcapLead:
      'Contemporary artificial intelligence interfaces suffer from architectural amnesia: every session begins in a vacuum, tethered to remote datacenter APIs that trade user sovereignty for convenience.',
    bodyColumns: [
      'A.V.E. (Autonomous Voice Entity) reimagines personal compute as an intimate, persistent cognitive daemon running natively on Linux silicon. By pairing quantized GGUF transformer inference with an acoustic wake pipeline and a hybrid HNSW + SQLite WAL episodic memory ledger, the system recalls months of engineering context in under 190 milliseconds.',
      'Tool execution is governed by a deterministic syscall sandbox. Rather than relying on brittle prompt chains, A.V.E. dispatches typed hardware and OS intents—controlling system telemetry, querying local knowledge graphs, and executing build pipelines with zero external network dependency.',
    ],
    footnoteId: 'FN.01',
    footnoteText:
      'Benchmarked on Intel Core i7-13650HX + RTX 4050 mobile die running Arch Linux (Hyprland kernel 6.x).',
    specs: [
      { k: 'WAKE LATENCY', v: '184 ms' },
      { k: 'WEIGHT FORMAT', v: '4-Bit Quantized GGUF' },
      { k: 'MEMORY ENGINE', v: 'HNSW + SQLite WAL' },
    ],
    figureCaption: 'PLATE 1.1 — Acoustic ring-buffer to episodic vector recall topology.',
  },
  {
    folio: 'FOLIO II // PP. 12–19',
    code: 'ML-SYS-02',
    title: 'FraudLens — High-Frequency Graph Anomaly Scoring',
    subtitle: 'Detecting non-linear collusion topologies across streaming financial ledgers in 6.4ms.',
    discipline: 'APPLIED MACHINE LEARNING & RISK TELEMETRY',
    dropcapLead:
      'Financial fraud rarely announces itself as a static outlier; it propagates as a coordinated temporal wave across transient account graphs within milliseconds.',
    bodyColumns: [
      'FraudLens combines sliding-window velocity aggregations with structural graph centrality features to score 14,800 transactions per second. By fusing gradient-boosted decision trees with neural residual calibration, the pipeline suppresses false-positive friction by 41.8% while maintaining a 0.964 PR-AUC.',
      'Crucially, every rejected or flagged transaction emits an inline SHAP feature-attribution vector—transforming black-box tensor outputs into human-auditable compliance evidence.',
    ],
    footnoteId: 'FN.02',
    footnoteText:
      'Evaluated on skewed 0.17% positive-class financial stream benchmarks under strict P99 tail-latency SLAs.',
    specs: [
      { k: 'TAIL LATENCY', v: '6.4 ms (P99)' },
      { k: 'PRECISION-RECALL', v: '0.964 PR-AUC' },
      { k: 'THROUGHPUT', v: '14,800 TPS' },
    ],
    figureCaption: 'PLATE 1.2 — Temporal velocity window & SHAP attribution decision boundary.',
  },
  {
    folio: 'FOLIO III // PP. 20–27',
    code: 'EM-RF-03',
    title: 'Full-Wave Electromagnetic Radiation & Smith Synthesis',
    subtitle: 'Computational field solving and impedance matching across 2.4GHz to 28GHz spectra.',
    discipline: 'RFIC & COMPUTATIONAL ELECTROMAGNETICS',
    dropcapLead:
      'At radio and millimeter-wave frequencies, a PCB trace ceases to be a simple wire and becomes a distributed electromagnetic resonator governed by Maxwell’s curl equations.',
    bodyColumns: [
      'This simulation suite computes 3D spherical far-field directivity tensors, Voltage Standing Wave Ratios (VSWR), and complex S-parameter matrices across arbitrary radiating geometries. Automated Smith Chart synthesis routines calculate optimal LC and microstrip stub matching networks.',
      'Achieving a -28.4 dB return loss (S11) and 93.6% radiation efficiency requires balancing substrate dielectric loss tangents against conductor skin-depth attenuation.',
    ],
    footnoteId: 'FN.03',
    footnoteText:
      'Verified against Keysight ADS Momentum & analytical Balanis cavity-model formulations.',
    specs: [
      { k: 'RETURN LOSS', v: '-28.4 dB (S11)' },
      { k: 'PEAK GAIN', v: '8.72 dBi' },
      { k: 'VSWR RATIO', v: '1.14 : 1' },
    ],
    figureCaption: 'PLATE 1.3 — Polar E/H-plane gain lobe & complex 50Ω Smith Chart locus.',
  },
  {
    folio: 'FOLIO IV // PP. 28–35',
    code: 'ARCH-RTL-04',
    title: 'RV32I — Five-Stage Pipelined RISC-V Microarchitecture',
    subtitle: 'Designing hazard-free register-transfer logic and forwarding muxes from scratch in Verilog.',
    discipline: 'COMPUTER ARCHITECTURE & DIGITAL VLSI',
    dropcapLead:
      'To understand why software stalls, one must descend beneath the compiler into the clock-edge timing of instruction fetch, decode, execute, memory, and writeback stages.',
    bodyColumns: [
      'Implemented in pure synthesizable Verilog HDL, this 32-bit RISC-V processor core incorporates full EX/MEM and MEM/WB data-forwarding paths alongside a dedicated load-use hazard detection unit that injects single-cycle pipeline bubbles only when mathematically unavoidable.',
      'Verified via deterministic C++ Verilator test harnesses and GTKWave cycle traces, the core achieves 1.18 CPI across Dhrystone microbenchmarks and synthesizes cleanly at 185 MHz.',
    ],
    footnoteId: 'FN.04',
    footnoteText:
      'Synthesized via Yosys & Xilinx Vivado targeting Artix-7 FPGA fabric (1,840 LUTs).',
    specs: [
      { k: 'ISA STANDARD', v: 'RISC-V RV32I' },
      { k: 'MAX FREQUENCY', v: '185 MHz' },
      { k: 'PIPELINE CPI', v: '1.18 Cycles' },
    ],
    figureCaption: 'PLATE 1.4 — Five-stage datapath schematic & forwarding multiplexer matrix.',
  },
  {
    folio: 'FOLIO V // PP. 36–41',
    code: 'EM-RF-05',
    title: '28GHz Phased Microstrip Patch Antenna Array',
    subtitle: 'Corporate Wilkinson feed networks and defected ground structures for 5G/mmWave beamforming.',
    discipline: 'MILLIMETER-WAVE RF FRONTEND',
    dropcapLead:
      'Millimeter-wave propagation suffers severe free-space path loss; recovering link margin demands high-gain phase-coherent aperture arrays.',
    bodyColumns: [
      'Engineered on Rogers RO4003C high-frequency laminate, this 4x4 microstrip patch array utilizes inset impedance feeding and quarter-wave transformer corporate distribution to deliver 16.4 dBi realized broadside gain.',
      'By etching periodic Defected Ground Structures (DGS) between adjacent radiating edges, surface-wave mutual coupling is suppressed below -24 dB, preserving clean ±42° electronic beam steering.',
    ],
    footnoteId: 'FN.05',
    footnoteText:
      'Substrate parameters: Rogers RO4003C, εr = 3.55, loss tangent tan(δ) = 0.0027 @ 28GHz.',
    specs: [
      { k: 'REALIZED GAIN', v: '16.4 dBi' },
      { k: 'SIDE-LOBE LEVEL', v: '-19.2 dB' },
      { k: 'SCAN SECTOR', v: '±42° Azimuth' },
    ],
    figureCaption: 'PLATE 1.5 — Corporate feed phase distribution & array factor radiation envelope.',
  },
  {
    folio: 'FOLIO VI // PP. 42–48',
    code: 'SYS-WEB-06',
    title: 'SIROSIU — Multi-Paradigm Design Engineering System',
    subtitle: 'Translating hardware telemetry, print typography, and fluid physics into the browser.',
    discipline: 'CREATIVE ENGINEERING & DESIGN SYSTEMS',
    dropcapLead:
      'A portfolio for a cross-stack engineer should not read like a static resume; it should function as an executable proof of craft across mediums.',
    bodyColumns: [
      'SIROSIU Prototype 3 unifies four distinct aesthetic and computational worlds: PBR spatial monoliths, European print monographs, divergence-free curl noise fields, and CAD/EDA schematic workbenches.',
      'Every component is authored without bloated UI frameworks, maintaining strict 60fps frame budgets and zero horizontal overflow from 320px handheld viewports to 4K studio monitors.',
    ],
    footnoteId: 'FN.06',
    footnoteText: 'Authored under the SIROSIU master identity // Signature mark: SHINO (2026).',
    specs: [
      { k: 'RENDER BUDGET', v: '16.6ms / 60fps' },
      { k: 'MIN VIEWPORT', v: '320px Zero-Overflow' },
      { k: 'IDENTITY MARK', v: 'SIROSIU // SHINO' },
    ],
    figureCaption: 'PLATE 1.6 — Four-concept state architecture & responsive typographic scale.',
  },
];

export const Concept02Editorial: React.FC = () => {
  const [activeFootnote, setActiveFootnote] = useState<string>('FN.01');

  return (
    <div className="c2-editorial-root">
      {/* SVG Cotton Rag Paper Grain Filter */}
      <svg className="c2-grain-svg" aria-hidden="true">
        <filter id="c2-cotton-rag">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div className="c2-paper-grain-overlay" />

      {/* RUNNING MONOGRAPH MASTHEAD */}
      <header className="c2-masthead">
        <div className="c2-masthead-row">
          <div className="c2-mast-cell">
            <span className="c2-vermilion-tag">ISSUE NO. 04 // AUTUMN–WINTER 2026</span>
          </div>
          <div className="c2-mast-cell c2-mast-center">
            <strong>SIROSIU MONOGRAPH</strong> — JOURNAL OF COMPUTATIONAL ARCHITECTURE, RF SILICON &amp;
            APPLIED INTELLIGENCE
          </div>
          <div className="c2-mast-cell c2-mast-right">
            <span>ISSN 2026-0802 // EDITION: SHINO</span>
          </div>
        </div>

        <nav className="c2-index-bar" aria-label="Editorial Contents">
          <span className="c2-index-label">INDEX RERUM:</span>
          <a href="#c2-cover">I. FRONTISPIECE</a>
          <a href="#c2-folios">II. FEATURE FOLIOS (06)</a>
          <a href="#c2-lexicon">III. TECHNICAL LEXICON</a>
          <a href="#c2-laboratory">IV. LABORATORY NOTES</a>
          <a href="#c2-essay">V. EDITORIAL ESSAY</a>
          <a href="#c2-colophon">VI. COLOPHON &amp; DISPATCH</a>
        </nav>
      </header>

      {/* SECTION 01: HERO COVER SPREAD */}
      <section id="c2-cover" className="c2-cover-spread">
        {/* Left Marginalia Spine */}
        <aside className="c2-cover-spine">
          <div className="c2-spine-meta">
            <span className="c2-mono-vermilion">VOL. IV — MONOGRAPH</span>
            <span>ANKUSH MALOTHIA</span>
            <span>DR. B. R. AMBEDKAR NIT JALANDHAR</span>
            <span>DEPT. OF ELECTRONICS &amp; COMM.</span>
          </div>
          <div className="c2-vertical-stamp">SIROSIU PRESS // JALANDHAR — ZÜRICH</div>
        </aside>

        {/* Central Asymmetric Editorial Stage */}
        <div className="c2-cover-main">
          <div className="c2-cover-kicker">
            <span>ARCHITECTURAL PORTFOLIO &amp; RESEARCH COMPENDIUM</span>
            <span className="c2-mono-vermilion">SIGNATURE: SHINO</span>
          </div>

          <h1 className="c2-cover-headline">
            The Physics of <em>Autonomous</em> Silicon, Waves &amp; <em>Machines.</em>
          </h1>

          <div className="c2-cover-lead-grid">
            <p className="c2-cover-deck">
              An independent engineering publication documenting six production investigations across
              <strong> RISC-V processor design</strong>, <strong>28GHz phased antenna arrays</strong>,
              <strong> real-time graph anomaly scoring</strong>, and{' '}
              <strong>sovereign voice intelligence</strong>.
            </p>
            <div className="c2-cover-colophon-box">
              <div className="c2-kv-line">
                <span>EDITOR &amp; ARCHITECT</span>
                <strong>Ankush Malothia (Sirosiu)</strong>
              </div>
              <div className="c2-kv-line">
                <span>DISCIPLINES</span>
                <strong>AI HW · RFIC · RTL · Linux</strong>
              </div>
              <div className="c2-kv-line">
                <span>ARCHIVE STATUS</span>
                <strong className="c2-vermilion-text">Complete Unabridged Edition</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Duotone Halftone Publication Plate */}
        <div className="c2-cover-plate">
          <div className="c2-plate-frame">
            <div className="c2-plate-header">
              <span>FIG. 0.1 — DIE &amp; FIELD TOPOGRAPHY</span>
              <span>SCALE 1 : 10⁴</span>
            </div>

            {/* Generative SVG Architectural Lithograph Plate */}
            <svg
              viewBox="0 0 360 420"
              className="c2-litho-svg"
              role="img"
              aria-label="Technical lithograph plate showing radiation lobes and silicon bus lines"
            >
              <defs>
                <pattern id="c2-dots" width="6" height="6" patternUnits="userSpaceOnUse">
                  <circle cx="1.5" cy="1.5" r="1" fill="#18181b" opacity="0.28" />
                </pattern>
              </defs>
              <rect width="360" height="420" fill="url(#c2-dots)" />
              {/* Concentric Smith / Radiation Contours */}
              <circle cx="180" cy="190" r="130" fill="none" stroke="#18181b" strokeWidth="1.2" />
              <circle
                cx="180"
                cy="190"
                r="96"
                fill="none"
                stroke="#18181b"
                strokeWidth="0.75"
                strokeDasharray="4 4"
              />
              <circle cx="210" cy="190" r="64" fill="none" stroke="#c84b31" strokeWidth="1.5" />
              <circle cx="240" cy="190" r="32" fill="none" stroke="#c84b31" strokeWidth="1" />
              {/* Orthogonal Die Crosshairs */}
              <line x1="20" y1="190" x2="340" y2="190" stroke="#18181b" strokeWidth="0.8" />
              <line x1="180" y1="30" x2="180" y2="350" stroke="#18181b" strokeWidth="0.8" />
              {/* Microstrip Patch Array Geometry */}
              <g transform="translate(116, 126)">
                {[0, 36, 72, 108].map((x) =>
                  [0, 36, 72, 108].map((y) => (
                    <rect
                      key={`${x}-${y}`}
                      x={x}
                      y={y}
                      width="20"
                      height="20"
                      fill="#fbf9f5"
                      stroke="#18181b"
                      strokeWidth="1.2"
                    />
                  ))
                )}
              </g>
              <text x="24" y="388" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#18181b">
                S11 = -28.4 dB // RV32I 5-STAGE // A.V.E. KERNEL
              </text>
              <text x="24" y="402" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#c84b31">
                LITHOGRAPH PLATE NO. 04 — SIROSIU ARCHIVE
              </text>
            </svg>

            <p className="c2-plate-caption">
              Superimposed 28GHz 4×4 phased patch aperture over a normalized 50Ω Smith impedance
              chart. Printed in rich carbon ink (`#18181b`) and vermilion rust (`#c84b31`).
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 02: SELECTED WORK — THE SIX FEATURE FOLIOS */}
      <section id="c2-folios" className="c2-folios-section">
        <div className="c2-section-banner">
          <span className="c2-mono-vermilion">PART II // OPERA SELECTA</span>
          <h2 className="c2-banner-title">Feature Engineering Monographs (Folios I—VI)</h2>
          <span className="c2-mono-muted">CLICK ANY FOOTNOTE MARKER TO INSPECT CITATION</span>
        </div>

        {FEATURE_STORIES.map((story, index) => (
          <article key={story.code} className="c2-folio-spread">
            {/* Left Margin Column: Folio Index & Footnote */}
            <div className="c2-folio-margin">
              <div className="c2-folio-num">{story.folio}</div>
              <div className="c2-folio-code">{story.code}</div>
              <div className="c2-folio-discipline">{story.discipline}</div>

              <div
                className={`c2-margin-footnote ${
                  activeFootnote === story.footnoteId ? 'is-highlighted' : ''
                }`}
              >
                <strong>[{story.footnoteId}]</strong> {story.footnoteText}
              </div>
            </div>

            {/* Center Story Column */}
            <div className="c2-folio-article">
              <h3 className="c2-story-title">{story.title}</h3>
              <p className="c2-story-subtitle">{story.subtitle}</p>

              <p className="c2-story-dropcap">
                {story.dropcapLead}
                <button
                  type="button"
                  className="c2-footnote-trigger"
                  onClick={() => setActiveFootnote(story.footnoteId)}
                >
                  [{story.footnoteId}]
                </button>
              </p>

              <div className="c2-two-column-prose">
                {story.bodyColumns.map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>
            </div>

            {/* Right Specification & Figure Plate Column */}
            <div className="c2-folio-specplate">
              <div className="c2-spec-table-header">VERIFIED TELEMETRY LEDGER</div>
              <dl className="c2-spec-dl">
                {story.specs.map((s) => (
                  <div key={s.k} className="c2-spec-row">
                    <dt>{s.k}</dt>
                    <dd>{s.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="c2-mini-diagram">
                <div className="c2-diagram-bars">
                  <span style={{ width: `${88 - index * 6}%` }} />
                  <span style={{ width: `${72 + (index % 3) * 8}%` }} />
                  <span style={{ width: `${94 - (index % 2) * 12}%` }} />
                </div>
                <p className="c2-fig-caption">{story.figureCaption}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* SECTION 03: CAPABILITIES — TECHNICAL LEXICON */}
      <section id="c2-lexicon" className="c2-lexicon-section">
        <div className="c2-section-banner">
          <span className="c2-mono-vermilion">PART III // METHODOLOGIA</span>
          <h2 className="c2-banner-title">The Four Pillars of the Practice</h2>
        </div>

        <div className="c2-lexicon-grid">
          <div className="c2-lexicon-entry">
            <span className="c2-entry-num">§ 01</span>
            <h3>Computer Architecture &amp; RTL Synthesis</h3>
            <p>
              Cycle-accurate RTL design in Verilog/SystemVerilog. Pipelined RISC-V cores, hazard
              forwarding logic, Verilator C++ simulation harnesses, and FPGA synthesis via Vivado
              and Yosys.
            </p>
          </div>
          <div className="c2-lexicon-entry">
            <span className="c2-entry-num">§ 02</span>
            <h3>RFIC &amp; Electromagnetic Engineering</h3>
            <p>
              Microstrip phased array design, S-parameter network characterization, Wilkinson power
              dividers, and Smith Chart impedance matching across 2.4GHz–28GHz using Keysight ADS
              and Cadence.
            </p>
          </div>
          <div className="c2-lexicon-entry">
            <span className="c2-entry-num">§ 03</span>
            <h3>Applied AI, ML &amp; Brain-Computer Interfaces</h3>
            <p>
              Quantized local LLM inference engines, EEG/BCI non-invasive motor-imagery DSP
              pipelines, and high-throughput graph anomaly detection systems with calibrated SHAP
              explainability.
            </p>
          </div>
          <div className="c2-lexicon-entry">
            <span className="c2-entry-num">§ 04</span>
            <h3>Systems Programming &amp; Linux Toolchains</h3>
            <p>
              Bare-metal performance engineering in C++, Rust, and Python across multi-boot Arch
              Linux (Hyprland) environments. Zero-copy ring buffers, SIMD kernels, and deterministic
              builds.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 04 & 05: LABORATORY NOTES + EDITORIAL ESSAY (PHILOSOPHY & WRITING) */}
      <section id="c2-laboratory" className="c2-editorial-split-section">
        <div className="c2-lab-column">
          <span className="c2-mono-vermilion">PART IV // ADDENDA &amp; LAB NOTES</span>
          <h2 className="c2-sub-display">Working Bench &amp; Dispatches</h2>

          <div className="c2-chronicle-list">
            <div className="c2-chronicle-item">
              <span className="c2-chron-date">NOTE 01 // BCI DSP</span>
              <h4>Common Spatial Patterns (CSP) for EEG Motor Imagery</h4>
              <p>
                 isolating mu (8–12Hz) and beta (18–26Hz) cortical desynchronization across
                sensorimotor electrodes for low-latency neural command decoding.
              </p>
            </div>
            <div className="c2-chronicle-item">
              <span className="c2-chron-date">NOTE 02 // ARCH-RTL</span>
              <h4>Resolving Load-Use Hazards Without Clock Degradation</h4>
              <p>
                Hardware interlock stall insertion paired with MEM-to-EX register bypass paths in
                32-bit RISC-V pipelines.
              </p>
            </div>
            <div className="c2-chronicle-item">
              <span className="c2-chron-date">NOTE 03 // SYSTEMS</span>
              <h4>Memory-Mapped KV-Cache Paging on Consumer GPUs</h4>
              <p>
                Sustaining token generation throughput on 6GB–16GB VRAM envelopes via INT4 group
                quantization and pinned host memory.
              </p>
            </div>
          </div>
        </div>

        <div id="c2-essay" className="c2-essay-column">
          <span className="c2-mono-vermilion">PART V // EDITORIAL MANIFESTO</span>
          <h2 className="c2-sub-display">
            Why the Future Belongs to the <em>Full-Stack Physicist-Engineer</em>
          </h2>
          <blockquote className="c2-pullquote">
            “Between the differential equation of an electromagnetic wave and the token probability
            of a transformer lies a single unbroken chain of engineering.”
          </blockquote>
          <p className="c2-essay-body">
            For three decades, technology encouraged hyper-specialization: analog engineers rarely
            spoke to RTL architects, RTL architects rarely wrote kernel drivers, and systems
            programmers treated machine learning models as opaque weights.
          </p>
          <p className="c2-essay-body">
            As Moore’s Law transitions into domain-specific co-design, that boundary has collapsed.
            Building next-generation brain-computer interfaces or edge AI accelerators requires
            fluent command of the entire vertical—from the analog noise floor of a sensor front-end,
            through custom RISC-V vector datapaths, up to the Rust/C++ runtime and neural network.
            <strong> SIROSIU</strong> is the ongoing record of that synthesis.
          </p>
          <div className="c2-essay-signoff">
            <span>— Ankush Malothia (Sirosiu)</span>
            <span className="c2-mono-vermilion">SHINO // JALANDHAR, NOV 2026</span>
          </div>
        </div>
      </section>

      {/* SECTION 07 & 08: NOW + COLOPHON / CONTACT */}
      <section id="c2-colophon" className="c2-colophon-section">
        <div className="c2-colophon-grid">
          <div className="c2-colophon-cell">
            <span className="c2-mono-vermilion">VI.A // STATUS PRAESENS (NOW)</span>
            <h3>Autumn–Winter 2026</h3>
            <p>
              Undergraduate researcher in Electronics &amp; Communication Engineering at{' '}
              <strong>NIT Jalandhar</strong> (3rd Year / 5th Semester). Currently advancing{' '}
              <strong>A.V.E.</strong> local agent memory architectures, studying non-invasive{' '}
              <strong>BCI neural interfaces</strong>, and training for a sub-7:00/mile 10K alongside
              strict calisthenics progression.
            </p>
          </div>

          <div className="c2-colophon-cell">
            <span className="c2-mono-vermilion">VI.B // TYPOGRAPHY &amp; PAPER SPEC</span>
            <h3>Production Colophon</h3>
            <p>
              Set in <em>Newsreader</em> Roman &amp; Italic (display and body copy) paired with{' '}
              <em>JetBrains Mono</em> for tabular engineering indices. Printed digitally on warm
              ivory cotton stock (`#fbf9f5`) with carbon ink (`#18181b`) and vermilion rust
              (`#c84b31`) marginalia rules.
            </p>
          </div>

          <div className="c2-colophon-cell">
            <span className="c2-mono-vermilion">VI.C // CORRESPONDENCE</span>
            <h3>Editorial &amp; Engineering Dispatch</h3>
            <ul className="c2-correspondence-list">
              <li>
                <span>ELECTRONIC MAIL:</span>
                <a href="mailto:ankush@sirosiu.com">ankush@sirosiu.com</a>
              </li>
              <li>
                <span>SOURCE ARCHIVE:</span>
                <a href="https://github.com/sirosiu" target="_blank" rel="noreferrer">
                  github.com/sirosiu
                </a>
              </li>
              <li>
                <span>PUBLICATION URL:</span>
                <a href="https://sirosiu.com" target="_blank" rel="noreferrer">
                  https://sirosiu.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 09: FOOTER IMPRINT */}
      <footer className="c2-footer-imprint">
        <div>
          <strong>SIROSIU PRESS</strong> — IMPRIMATUR: ANKUSH MALOTHIA // SIGNATURE MARK: SHINO
        </div>
        <div className="c2-mono-vermilion">
          CONCEPT 02 — EUROPEAN EDITORIAL MONOGRAPH // ALL RIGHTS RESERVED © 2026
        </div>
      </footer>
    </div>
  );
};

export default Concept02Editorial;