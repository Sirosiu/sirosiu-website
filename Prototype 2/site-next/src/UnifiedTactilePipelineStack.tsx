import { useState } from 'react'

interface StackStage {
  id: string
  unit: string
  code: string
  slot: string
  glyph: string
  title: string
  domain: string
  coreLanguages: string
  tools: string[]
  verifiedSpec: string
  busLabel: string
  statusLedColor: string
}

const STACK_STAGES: StackStage[] = [
  {
    id: 'silicon',
    unit: 'U1',
    code: 'RTL-32',
    slot: 'STAGE 01',
    glyph: '⊞',
    title: 'SILICON & RTL',
    domain: 'Digital Logic & Accelerators',
    coreLanguages: 'SystemVerilog · Verilog · C++ · RISC-V',
    tools: ['SystemVerilog', 'Verilog', 'C++', 'RISC-V ISA', 'Vivado', 'Verilator', 'gem5', 'GTKWave'],
    verifiedSpec: '5-stage RV32I core + 4x4 systolic GEMM accelerator (100% compliance pass)',
    busLabel: 'BUS_01:GATE_LEVEL',
    statusLedColor: '#10b981', // emerald
  },
  {
    id: 'low-level',
    unit: 'U2',
    code: 'SYS-RT',
    slot: 'STAGE 02',
    glyph: '⚙',
    title: 'LOW-LEVEL RUNTIMES',
    domain: 'Kernel, OS & Embedded',
    coreLanguages: 'C · C++20 · Rust · Linux · Assembly',
    tools: ['C', 'C++20', 'Rust', 'Linux Kernel', 'POSIX', 'FreeRTOS', 'Assembly', 'GDB'],
    verifiedSpec: 'Zero-copy DMA ring buffers, <1.8μs deterministic IRQ, and lock-free concurrency',
    busLabel: 'BUS_02:KERNEL_IO',
    statusLedColor: '#06b6d4', // cyan
  },
  {
    id: 'ai-agents',
    unit: 'U3',
    code: 'AVE-NN',
    slot: 'STAGE 03',
    glyph: '🧠',
    title: 'AI AGENTS & NPU',
    domain: 'Autonomous Intelligence Systems',
    coreLanguages: 'Python · C++ · PyTorch · Rust',
    tools: ['Local LLMs', 'PyTorch', 'ONNX Runtime', 'C++', 'Python', 'Vector Fields', 'Quantization (GGUF)'],
    verifiedSpec: 'Sub-40ms on-device agent routing loop, 128-dim vector embeddings, and tool orchestration',
    busLabel: 'BUS_03:TENSOR_NPU',
    statusLedColor: '#d7a66e', // titanium gold
  },
  {
    id: 'rf-hardware',
    unit: 'U4',
    code: 'RF-EM',
    slot: 'STAGE 04',
    glyph: '📡',
    title: 'RF & PHYSICAL LAYER',
    domain: 'Electromagnetics & Hardware',
    coreLanguages: 'MATLAB · Python · CST · HFSS',
    tools: ['Antenna Arrays', 'CST Studio', 'Smith Charts', 'VNA S-Parameters', 'HFSS', 'KiCad PCB'],
    verifiedSpec: '5.8 GHz ISM patch array with S11 return loss < -24 dB and 6.2 dBi measured gain',
    busLabel: 'BUS_04:RF_FRONTEND',
    statusLedColor: '#f59e0b', // amber
  },
]

export default function UnifiedTactilePipelineStack() {
  const [activeStage, setActiveStage] = useState(0)
  const current = STACK_STAGES[activeStage]

  const handleScrollToWork = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = document.getElementById('work')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="unified-stack-pipeline">
      {/* Sequential Pipeline of Tactile Hardware ICs */}
      <div className="pipeline-ic-rail" role="tablist" aria-label="Technical Stack Architecture">
        {STACK_STAGES.map((stage, idx) => {
          const isSelected = activeStage === idx
          return (
            <div key={stage.id} className="pipeline-node-segment">
              {/* Tactile IC Module Card */}
              <button
                type="button"
                role="tab"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => setActiveStage(idx)}
                className={`tactile-pipeline-card ${isSelected ? 'is-active' : ''}`}
              >
                {/* Header row: Part number & Status LED */}
                <div className="pipeline-card-header">
                  <div className="card-header-left">
                    <span className="card-glyph" aria-hidden="true">{stage.glyph}</span>
                    <span className="card-unit-label">
                      {stage.unit} // <span className="card-code-highlight">{stage.code}</span>
                    </span>
                  </div>
                  <span
                    className="card-status-led"
                    style={{
                      backgroundColor: stage.statusLedColor,
                      boxShadow: isSelected ? `0 0 8px ${stage.statusLedColor}` : 'none',
                    }}
                  />
                </div>

                {/* Title & Core Languages */}
                <div className="pipeline-card-body">
                  <h3 className="card-title">{stage.title}</h3>
                  <p className="card-languages">{stage.coreLanguages}</p>
                </div>
              </button>

              {/* Dataflow Trace Connector: Floating Data Dot ONLY (NO ARROWS) */}
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

      {/* PCB Bus Telemetry Readout (Verified Spec & Generic Tool Evidence) */}
      <div className="pipeline-telemetry-bus">
        <div className="bus-header-row">
          <div className="bus-id-block">
            <span className="bus-led-dot" style={{ backgroundColor: current.statusLedColor }} />
            <span className="bus-id-code">{current.busLabel} //</span>
          </div>
          <div className="bus-tools-evidence">
            <span className="tools-lead">STACK EVIDENCE:</span>
            <span className="tools-list">{current.tools.join(' · ')}</span>
          </div>
        </div>

        <div className="bus-spec-row">
          <div className="spec-content">
            <span className="spec-tag">VERIFIED SPEC:</span>
            <span className="spec-description">{current.verifiedSpec}</span>
          </div>
          <button
            type="button"
            onClick={handleScrollToWork}
            className="bus-explore-action"
            title="Jump to engineering projects & artifacts"
          >
            EXPLORE SPEC ↓
          </button>
        </div>
      </div>
    </div>
  )
}
