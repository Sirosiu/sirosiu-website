import { useState, useRef } from 'react'

interface StackStage {
  id: string
  slot: string
  glyph: string
  title: string
  domain: string
  coreLanguages: string
  tools: string[]
  verifiedSpec: string
  busLabel: string
}

const STACK_STAGES: StackStage[] = [
  {
    id: 'silicon',
    slot: 'LAYER 01',
    glyph: '⊞',
    title: 'SILICON & RTL',
    domain: 'Digital Logic & Accelerators',
    coreLanguages: 'RISC-V · SystemVerilog · Verilator · Vivado',
    tools: ['RISC-V RV32I', 'SystemVerilog', 'Verilog', 'Verilator', 'Vivado', 'Chisel', 'GTKWave', 'gem5'],
    verifiedSpec: '5-stage RV32I core + 4x4 systolic GEMM accelerator with 100% compliance pass',
    busLabel: 'LAYER 01 · GATE-LEVEL RTL & ACCELERATORS',
  },
  {
    id: 'low-level',
    slot: 'LAYER 02',
    glyph: '⚙',
    title: 'LOW-LEVEL RUNTIMES',
    domain: 'Kernel, OS & Embedded',
    coreLanguages: 'C++20 · Rust · Linux Kernel · Embedded',
    tools: ['C', 'C++20', 'Rust', 'Linux Kernel', 'POSIX', 'FreeRTOS', 'Assembly', 'GDB'],
    verifiedSpec: 'Zero-copy DMA ring buffers, <1.8μs deterministic IRQ latency, and lock-free concurrency',
    busLabel: 'LAYER 02 · KERNEL & EMBEDDED RUNTIMES',
  },
  {
    id: 'ai-agents',
    slot: 'LAYER 03',
    glyph: '🧠',
    title: 'AI AGENTS & NPU',
    domain: 'Autonomous Intelligence Systems',
    coreLanguages: 'Autonomous Agents · NPU Acceleration · PyTorch',
    tools: ['Autonomous Agent Runtimes', 'Local LLMs', 'PyTorch', 'ONNX Runtime', 'C++', 'Python', 'Quantization (GGUF)'],
    verifiedSpec: 'Sub-40ms on-device agent routing loop, 128-dim vector embeddings, and tool orchestration',
    busLabel: 'LAYER 03 · ON-DEVICE AGENT & NPU ORCHESTRATION',
  },
  {
    id: 'rf-hardware',
    slot: 'LAYER 04',
    glyph: '📡',
    title: 'RF & PHYSICAL LAYER',
    domain: 'Electromagnetics & Hardware',
    coreLanguages: 'Antenna Arrays · CST Studio · HFSS · PCB',
    tools: ['Antenna Arrays', 'CST Studio', 'Smith Charts', 'VNA S-Parameters', 'HFSS', 'KiCad PCB'],
    verifiedSpec: '5.8 GHz ISM patch array with S11 return loss < -24 dB and 6.2 dBi measured gain',
    busLabel: 'LAYER 04 · HIGH-FREQUENCY EM & PHYSICAL INTERFACE',
  },
]

export default function UnifiedTactilePipelineStack() {
  const [activeStage, setActiveStage] = useState(0)
  const current = STACK_STAGES[activeStage]
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleScrollToWork = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = document.getElementById('work')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        nextIndex = (index + 1) % STACK_STAGES.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        nextIndex = (index - 1 + STACK_STAGES.length) % STACK_STAGES.length
        break
      case 'Home':
        e.preventDefault()
        nextIndex = 0
        break
      case 'End':
        e.preventDefault()
        nextIndex = STACK_STAGES.length - 1
        break
      default:
        break
    }

    if (nextIndex !== null) {
      setActiveStage(nextIndex)
      tabRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className="unified-stack-pipeline">
      {/* Sequential Pipeline of Tactile Hardware ICs */}
      <div
        className="pipeline-ic-rail"
        role="tablist"
        aria-label="Technical Stack Architecture"
        aria-orientation="horizontal"
      >
        {STACK_STAGES.map((stage, idx) => {
          const isSelected = activeStage === idx
          return (
            <div key={stage.id} className="pipeline-node-segment">
              {/* Tactile IC Module Card */}
              <button
                ref={(el) => {
                  tabRefs.current[idx] = el
                }}
                type="button"
                role="tab"
                id={`stack-tab-${stage.id}`}
                aria-controls="stack-panel-telemetry"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveStage(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`tactile-pipeline-card ${isSelected ? 'is-active' : ''}`}
              >
                {/* Header row: Layer designation & glyph */}
                <div className="pipeline-card-header">
                  <div className="card-header-left">
                    <span className="card-glyph" aria-hidden="true">{stage.glyph}</span>
                    <span className="card-unit-label">{stage.slot}</span>
                  </div>
                  <span className={`card-active-indicator ${isSelected ? 'is-active' : ''}`} aria-hidden="true" />
                </div>

                {/* Title & Core Languages */}
                <div className="pipeline-card-body">
                  <h3 className="card-title">{stage.title}</h3>
                  <p className="card-languages">{stage.coreLanguages}</p>
                </div>
              </button>

              {/* Dataflow Trace Connector: Floating Data Dot ONLY */}
              {idx < STACK_STAGES.length - 1 && (
                <div className="pipeline-trace-bridge" aria-hidden="true">
                  <div className="bridge-track-line" />
                  <div className="bridge-data-dot" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Architecture Telemetry & Spec Readout */}
      <div
        id="stack-panel-telemetry"
        role="tabpanel"
        aria-labelledby={`stack-tab-${current.id}`}
        className="pipeline-telemetry-bus"
        tabIndex={0}
      >
        <div className="bus-header-row">
          <div className="bus-id-block">
            <span className="bus-id-code">{current.busLabel}</span>
          </div>
          <div className="bus-tools-evidence">
            <span className="tools-lead">CORE TOOLCHAIN:</span>
            <span className="tools-list">{current.tools.join(' · ')}</span>
          </div>
        </div>

        <div className="bus-spec-row">
          <div className="spec-content">
            <span className="spec-tag">VERIFIED ARCHITECTURE BENCHMARK:</span>
            <span className="spec-description">{current.verifiedSpec}</span>
          </div>
          <button
            type="button"
            onClick={handleScrollToWork}
            className="bus-explore-action"
            title="Explore matching engineering projects"
          >
            VIEW PROJECTS ↓
          </button>
        </div>
      </div>
    </div>
  )
}
