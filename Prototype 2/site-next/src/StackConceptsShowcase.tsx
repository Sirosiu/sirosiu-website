import { useState } from 'react'
import TactileIcChips from './TactileIcChips'

export type StackConceptId = 'chips' | 'pipeline' | 'analyzer' | 'blades'

interface DomainSpec {
  id: string
  code: string
  slot: string
  domain: string
  title: string
  tools: string[]
  metrics: string
  busLabel: string
  status: string
  color: string
}

const STACK_DOMAINS: DomainSpec[] = [
  {
    id: 'silicon',
    code: 'RTL-32',
    slot: 'STAGE_01',
    domain: 'SILICON & RTL',
    title: 'Silicon & Digital Logic Design',
    tools: ['SystemVerilog', 'Verilog', 'RISC-V ISA', 'Vivado', 'Verilator', 'gem5'],
    metrics: '5-Stage RV32I Core @ 180MHz · 4x4 Systolic GEMM Array (100% Compliance)',
    busLabel: 'BUS_01:GATE_LEVEL // 1.2ns gate latency · RV32I instruction decode',
    status: 'SYNTHESIZED & VERIFIED',
    color: '#10b981', // emerald
  },
  {
    id: 'systems',
    code: 'SYS-RT',
    slot: 'STAGE_02',
    domain: 'LOW-LEVEL RUNTIMES',
    title: 'Kernel & Systems Architecture',
    tools: ['C', 'C++20', 'Rust', 'Linux Kernel', 'POSIX', 'FreeRTOS', 'Assembly'],
    metrics: 'Zero-copy ring buffer DMA · <1.8μs deterministic IRQ · Lock-free IPC',
    busLabel: 'BUS_02:KERNEL_IO // Ring buffer DMA · Cache-coherent paging',
    status: 'BENCHMARKED',
    color: '#06b6d4', // cyan
  },
  {
    id: 'agents',
    code: 'AVE-NN',
    slot: 'STAGE_03',
    domain: 'AI AGENTS & ON-DEVICE ML',
    title: 'Autonomous Intelligence Systems',
    tools: ['Local LLMs', 'PyTorch', 'ONNX Runtime', 'Vector Fields', 'Quantization'],
    metrics: 'On-device edge inference · Sub-40ms agentic routing · 128-dim vector embeddings',
    busLabel: 'BUS_03:TENSOR_NPU // 4-bit quantized tensor pipeline · Autonomous agent loop',
    status: 'ACTIVE RUNTIME',
    color: '#d7a66e', // titanium gold
  },
  {
    id: 'rf',
    code: 'RF-EM',
    slot: 'STAGE_04',
    domain: 'RF & PHYSICAL LAYER',
    title: 'Electromagnetic & RF Hardware',
    tools: ['Antenna Arrays', 'CST Studio', 'Smith Charts', 'VNA S-Parameters', 'HFSS'],
    metrics: '5.8GHz ISM patch array · S11 return loss < -24dB · 6.2dBi measured gain',
    busLabel: 'BUS_04:RF_FRONTEND // 50Ω microstrip match · S11 < -24dB @ 5.8GHz',
    status: 'MEASURED PHYSICAL',
    color: '#f59e0b', // amber
  },
]

export default function StackConceptsShowcase() {
  const [activeConcept, setActiveConcept] = useState<StackConceptId>(() => {
    if (typeof window === 'undefined') return 'chips'
    try {
      const saved = localStorage.getItem('sirosiu-stack-concept') as StackConceptId
      if (saved === 'chips' || saved === 'pipeline' || saved === 'analyzer' || saved === 'blades') {
        return saved
      }
    } catch {}
    return 'chips'
  })

  // State for Concept 2: Pipeline
  const [activePipelineStage, setActivePipelineStage] = useState(0)

  // State for Concept 3: Logic Analyzer
  const [activeChannel, setActiveChannel] = useState(0)

  // State for Concept 4: Blades
  const [activeBlade, setActiveBlade] = useState(0)

  const handleSelectConcept = (c: StackConceptId) => {
    setActiveConcept(c)
    try {
      localStorage.setItem('sirosiu-stack-concept', c)
    } catch {}
  }

  return (
    <div className="stack-concepts-wrapper">
      {/* Concept Switcher Ribbon */}
      <div className="stack-concept-switcher-bar">
        <div className="switcher-header-tag">
          <span className="switcher-pulse-pip" />
          <span className="switcher-label">STACK CONCEPT:</span>
        </div>
        <div className="switcher-pill-group" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeConcept === 'chips'}
            onClick={() => handleSelectConcept('chips')}
            className={`concept-pill-btn ${activeConcept === 'chips' ? 'is-active' : ''}`}
          >
            <span className="concept-num">01</span>
            <span className="concept-name">TACTILE ICs</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeConcept === 'pipeline'}
            onClick={() => handleSelectConcept('pipeline')}
            className={`concept-pill-btn ${activeConcept === 'pipeline' ? 'is-active' : ''}`}
          >
            <span className="concept-num">02</span>
            <span className="concept-name">PIPELINE RIBBON</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeConcept === 'analyzer'}
            onClick={() => handleSelectConcept('analyzer')}
            className={`concept-pill-btn ${activeConcept === 'analyzer' ? 'is-active' : ''}`}
          >
            <span className="concept-num">03</span>
            <span className="concept-name">LOGIC ANALYZER</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeConcept === 'blades'}
            onClick={() => handleSelectConcept('blades')}
            className={`concept-pill-btn ${activeConcept === 'blades' ? 'is-active' : ''}`}
          >
            <span className="concept-num">04</span>
            <span className="concept-name">BLADE RACK</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CONCEPT 1: TACTILE IC CHIPS (ORIGINAL PRESERVED)               */}
      {/* ============================================================== */}
      {activeConcept === 'chips' && (
        <div className="concept-container concept-fade-in">
          <TactileIcChips />
        </div>
      )}

      {/* ============================================================== */}
      {/* CONCEPT 2: SILICON-TO-AGENTS INSTRUCTION PIPELINE RIBBON       */}
      {/* ============================================================== */}
      {activeConcept === 'pipeline' && (
        <div className="concept-container concept-fade-in concept-pipeline-container">
          <div className="pipeline-strip-track">
            {STACK_DOMAINS.map((domain, idx) => {
              const isSelected = activePipelineStage === idx
              return (
                <div key={domain.id} className="pipeline-node-wrapper">
                  <button
                    type="button"
                    onClick={() => setActivePipelineStage(idx)}
                    className={`pipeline-stage-card ${isSelected ? 'is-active' : ''}`}
                    aria-label={`Select pipeline stage: ${domain.domain}`}
                  >
                    <div className="pipeline-card-header">
                      <span className="pipeline-stage-idx">{domain.slot}</span>
                      <span
                        className="pipeline-status-dot"
                        style={{ backgroundColor: domain.color }}
                      />
                    </div>
                    <div className="pipeline-card-title">{domain.domain}</div>
                    <div className="pipeline-card-code">{domain.code}</div>
                  </button>

                  {idx < STACK_DOMAINS.length - 1 && (
                    <div className="pipeline-connector-flow" aria-hidden="true">
                      <div className="flow-line" />
                      <div className="flow-pulse-particle" />
                      <span className="flow-arrow">►</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Inline Active Stage Architectural Capsule */}
          <div className="pipeline-capsule-display">
            <div className="capsule-header-line">
              <span className="capsule-bus-tag">
                {STACK_DOMAINS[activePipelineStage].slot} // {STACK_DOMAINS[activePipelineStage].code}
              </span>
              <span className="capsule-status-pill">
                ● {STACK_DOMAINS[activePipelineStage].status}
              </span>
            </div>
            <div className="capsule-tools-row">
              <span className="capsule-label">STACK TOOLS:</span>
              <div className="capsule-badges">
                {STACK_DOMAINS[activePipelineStage].tools.map((t) => (
                  <span key={t} className="capsule-badge">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="capsule-metric-line">
              <span className="capsule-label">MEASURED SPEC:</span>
              <span className="capsule-metric-val">
                {STACK_DOMAINS[activePipelineStage].metrics}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CONCEPT 3: LOGIC SIGNAL ANALYZER & OSCILLOSCOPE HUD            */}
      {/* ============================================================== */}
      {activeConcept === 'analyzer' && (
        <div className="concept-container concept-fade-in concept-analyzer-container">
          <div className="analyzer-screen-bezel">
            {/* Scope Top Header Status Bar */}
            <div className="analyzer-status-bar">
              <div className="scope-stat-group">
                <span className="scope-rec-light" />
                <span className="scope-brand">KEYSIGHT // LOGIC ANALYZER</span>
                <span className="scope-clock-stat">SYS_CLK: 500MHz</span>
              </div>
              <div className="scope-stat-group">
                <span className="scope-trigger-mode">TRIG: AUTO [RTL_POS_EDGE]</span>
                <span className="scope-samp-rate">2.5 GS/s</span>
              </div>
            </div>

            {/* Scope Traces Matrix */}
            <div className="analyzer-traces-matrix">
              {STACK_DOMAINS.map((domain, idx) => {
                const isSelected = activeChannel === idx
                return (
                  <div
                    key={domain.id}
                    onClick={() => setActiveChannel(idx)}
                    className={`analyzer-channel-row ${isSelected ? 'is-active' : ''}`}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="channel-id-cell">
                      <span className="ch-num">CH{idx + 1}</span>
                      <span className="ch-name">{domain.domain}</span>
                    </div>

                    {/* Live SVG Signal Waveform */}
                    <div className="channel-waveform-screen">
                      <svg
                        className="waveform-svg"
                        viewBox="0 0 320 28"
                        preserveAspectRatio="none"
                      >
                        {idx === 0 && (
                          /* Square Wave (Clock / RTL logic) */
                          <path
                            d="M0,22 L20,22 L20,6 L40,6 L40,22 L60,22 L60,6 L80,6 L80,22 L100,22 L100,6 L120,6 L120,22 L140,22 L140,6 L160,6 L160,22 L180,22 L180,6 L200,6 L200,22 L220,22 L220,6 L240,6 L240,22 L260,22 L260,6 L280,6 L280,22 L300,22 L300,6 L320,6"
                            fill="none"
                            stroke={domain.color}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            className="wave-line animated-scan"
                          />
                        )}
                        {idx === 1 && (
                          /* Bus Transition Hex Opcodes (System Kernel IO) */
                          <path
                            d="M0,14 L30,14 L35,6 L65,6 L70,14 L110,14 L115,22 L145,22 L150,14 L190,14 L195,6 L225,6 L230,14 L270,14 L275,22 L305,22 L310,14 L320,14"
                            fill="none"
                            stroke={domain.color}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            className="wave-line animated-scan-reverse"
                          />
                        )}
                        {idx === 2 && (
                          /* Tensor Activation Sigmoid / Neural Sine Wave */
                          <path
                            d="M0,14 Q20,2 40,14 T80,14 T120,14 T160,14 T200,14 T240,14 T280,14 T320,14"
                            fill="none"
                            stroke={domain.color}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            className="wave-line animated-scan"
                          />
                        )}
                        {idx === 3 && (
                          /* High-Frequency RF Sinusoidal Modulation */
                          <path
                            d="M0,14 Q10,4 20,14 T40,14 T60,14 T80,14 T100,14 T120,14 T140,14 T160,14 T180,14 T200,14 T220,14 T240,14 T260,14 T280,14 T300,14 T320,14"
                            fill="none"
                            stroke={domain.color}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            className="wave-line animated-scan-fast"
                          />
                        )}
                      </svg>
                    </div>

                    <div className="channel-reading-cell">
                      <span className="reading-tag">{domain.code}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Scope Telemetry Readout Strip */}
            <div className="analyzer-telemetry-readout">
              <span className="telemetry-prompt">SCOPE_LOG &gt;</span>
              <span className="telemetry-content">
                <strong>{STACK_DOMAINS[activeChannel].domain}</strong> // {STACK_DOMAINS[activeChannel].metrics}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CONCEPT 4: MODULAR ACCELERATOR BLADE RACK                      */}
      {/* ============================================================== */}
      {activeConcept === 'blades' && (
        <div className="concept-container concept-fade-in concept-blades-container">
          <div className="blades-rack-housing">
            <div className="rack-rail-header">
              <span className="rack-chassis-label">COMPUTE CHASSIS // 4-BLADE TOPOLOGY</span>
              <span className="rack-bus-spec">PCIe 5.0 x16 INTERCONNECT</span>
            </div>

            <div className="blades-grid">
              {STACK_DOMAINS.map((domain, idx) => {
                const isSelected = activeBlade === idx
                return (
                  <div
                    key={domain.id}
                    onClick={() => setActiveBlade(idx)}
                    className={`blade-unit-card ${isSelected ? 'is-engaged' : ''}`}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="blade-latch-top">
                      <span className="blade-eject-handle" />
                      <span
                        className="blade-led-indicator"
                        style={{
                          backgroundColor: domain.color,
                          boxShadow: `0 0 8px ${domain.color}`,
                        }}
                      />
                    </div>

                    <div className="blade-body">
                      <div className="blade-meta-row">
                        <span className="blade-slot-tag">{domain.slot}</span>
                        <span className="blade-code-tag">{domain.code}</span>
                      </div>
                      <h4 className="blade-title">{domain.domain}</h4>

                      {/* Hardware fin vents styling */}
                      <div className="blade-vent-strip">
                        <span className="vent-line" />
                        <span className="vent-line" />
                        <span className="vent-line" />
                        <span className="vent-line" />
                        <span className="vent-line" />
                      </div>

                      <div className="blade-quick-tools">
                        {domain.tools.slice(0, 3).join(' · ')}
                      </div>
                    </div>

                    <div className="blade-bottom-rail">
                      <span className="rail-status">{isSelected ? 'ENGAGED' : 'STANDBY'}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Engaged Blade Telemetry Console */}
            <div className="blade-telemetry-console">
              <div className="blade-telemetry-header">
                <span className="telemetry-blade-id">
                  {STACK_DOMAINS[activeBlade].slot} // {STACK_DOMAINS[activeBlade].domain}
                </span>
                <span className="telemetry-blade-tools">
                  {STACK_DOMAINS[activeBlade].tools.join(' · ')}
                </span>
              </div>
              <p className="telemetry-blade-metric">
                <span className="metric-tag">ACTIVE HARDWARE SPEC:</span> {STACK_DOMAINS[activeBlade].metrics}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
