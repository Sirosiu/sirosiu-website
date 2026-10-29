import { useState } from 'react'

export interface IcChipData {
  id: string
  icon: string
  partNumber: string
  name: string
  shortStack: string
  busCode: string
  detailedTools: string
  keyArtifact: string
  jumpTarget: string
}

const CHIPS_DATA: IcChipData[] = [
  {
    id: 'u1',
    icon: '⊞',
    partNumber: 'U1 // RTL-32',
    name: 'SILICON & RTL',
    shortStack: 'Verilog · RISC-V',
    busCode: 'BUS_01:GATE_LEVEL',
    detailedTools: 'SystemVerilog · Verilog · RISC-V ISA · Vivado · Verilator · gem5 · GTKWave',
    keyArtifact: '5-stage RV32I core + 4x4 systolic GEMM accelerator (100% compliance pass)',
    jumpTarget: '#work',
  },
  {
    id: 'u2',
    icon: '⚙',
    partNumber: 'U2 // SYS-RT',
    name: 'LOW-LEVEL',
    shortStack: 'C++ · Rust · Linux',
    busCode: 'BUS_02:POSIX_RUNTIME',
    detailedTools: 'C · C++ · Rust · Arch Linux · Hyprland / Waybar · QEMU · Docker Sandboxes',
    keyArtifact: 'Low-latency async IPC pipelines, memory-safe subshells & deterministic environments',
    jumpTarget: '#experience',
  },
  {
    id: 'u3',
    icon: '🧠',
    partNumber: 'U3 // AVE-NN',
    name: 'AI AGENTS',
    shortStack: 'Ave · Local LLMs',
    busCode: 'BUS_03:LOCAL_INFERENCE',
    detailedTools: 'Python · Ollama / Llama.cpp · GGUF Quantization · ChromaDB · FastAPI · Tool Calling',
    keyArtifact: 'Ave on-device assistant with sub-48ms tool calling & zero cloud data egress',
    jumpTarget: '#work',
  },
  {
    id: 'u4',
    icon: '📡',
    partNumber: 'U4 // RF-EM',
    name: 'RF HARDWARE',
    shortStack: 'Antennas · CST',
    busCode: 'BUS_04:EM_FARFIELD',
    detailedTools: 'CST Studio Suite · OpenEMS (FDTD) · MATLAB · S-Parameters (S11) · VSWR · Far-Field Gain',
    keyArtifact: '2.4/5.8GHz dual-band patch antenna array with corporate feed (S11 < -22 dB)',
    jumpTarget: '#work',
  },
]

export default function TactileIcChips() {
  const [activeId, setActiveId] = useState<string>('u1')

  const activeChip = CHIPS_DATA.find((c) => c.id === activeId) || CHIPS_DATA[0]

  const handleChipClick = (id: string) => {
    setActiveId(id)
  }

  const handleJump = (target: string) => {
    const el = document.querySelector(target)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="tactile-ic-module" aria-label="Hardware Architecture Stack Chips">
      {/* IC Chips Horizontal Rail */}
      <div className="ic-chips-rail" role="tablist">
        {CHIPS_DATA.map((chip) => {
          const isActive = chip.id === activeId
          return (
            <div
              key={chip.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              className={`ic-chip-unit ${isActive ? 'is-active' : ''}`}
              onClick={() => handleChipClick(chip.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleChipClick(chip.id)
                }
              }}
            >
              {/* Clean Tactile IC Package Body (No pins) */}
              <div className="ic-package">
                {/* Header: Icon + Part Number + Status LED */}
                <div className="ic-header-line">
                  <div className="ic-header-left">
                    <span className="ic-icon-symbol" aria-hidden="true">{chip.icon}</span>
                    <span className="ic-part-no">{chip.partNumber}</span>
                  </div>
                  <span className={`ic-status-led ${isActive ? 'led-on' : ''}`} aria-hidden="true" />
                </div>

                {/* Chip Primary Name */}
                <div className="ic-name-line">
                  <span className="ic-chip-name">{chip.name}</span>
                </div>

                {/* Short Sub-Stack */}
                <div className="ic-sub-line">
                  <span className="ic-short-stack">{chip.shortStack}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* PCB Bus Trace Line */}
      <div className="ic-bus-connector" aria-hidden="true">
        <div className="pcb-trace-line" />
        <div className="pcb-via-dot" />
      </div>

      {/* Live Tactile Readout Drawer for Active IC */}
      <div className="ic-live-readout" aria-live="polite">
        <div className="readout-header">
          <span className="readout-bus-tag">
            <span className="readout-blink" aria-hidden="true">●</span> {activeChip.busCode}
          </span>
          <span className="readout-divider">//</span>
          <span className="readout-tools">{activeChip.detailedTools}</span>
        </div>

        <div className="readout-body">
          <span className="readout-artifact-lbl">VERIFIED SPEC:</span>
          <span className="readout-artifact-text">{activeChip.keyArtifact}</span>
          <button
            type="button"
            onClick={() => handleJump(activeChip.jumpTarget)}
            className="readout-jump-btn"
          >
            EXPLORE SPEC ↓
          </button>
        </div>
      </div>
    </div>
  )
}
