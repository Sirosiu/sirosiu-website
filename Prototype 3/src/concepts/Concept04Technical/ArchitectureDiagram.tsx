import React, { useState } from 'react'

interface SystemNode {
  id: string
  label: string
  layer: string
  spec: string
  subsystems: string[]
  status: string
}

const SYSTEM_NODES: SystemNode[] = [
  {
    id: 'em-rf',
    label: 'EM & Physical Systems',
    layer: 'LAYER 0',
    spec: '2.4 / 5.8 GHz Resonance • FDTD Solver',
    subsystems: ['CST Studio', 'openEMS Yee-Cells', 'S11 Match (< -22dB)', 'Smith Chart'],
    status: 'ACTIVE SIM',
  },
  {
    id: 'silicon-rtl',
    label: 'Digital Logic & Architecture',
    layer: 'LAYER 1',
    spec: 'RV32I 5-Stage Pipelined • Systolic Tensor Array',
    subsystems: ['SystemVerilog', 'Hazard Unit Forwarding', 'Verilator Automation', '120 MHz Target'],
    status: 'VERIFIED',
  },
  {
    id: 'neural-runtime',
    label: 'Autonomous Agent Runtime',
    layer: 'LAYER 2',
    spec: 'Local GGUF Models • Sub-48ms Dispatch',
    subsystems: ['Llama.cpp / Ollama', 'Episodic Memory Graph', 'Sandboxed Tool Loop', 'Zero Egress'],
    status: 'OPERATIONAL',
  },
  {
    id: 'reactive-ui',
    label: 'Distributed Edge Platform',
    layer: 'LAYER 3',
    spec: 'React 19 • Three.js GPGPU • Cloudflare Workers',
    subsystems: ['60 FPS Frame Budget', 'WCAG AA Compliance', 'Tactile Vector Canvas', 'Edge Caching'],
    status: 'HOSTED',
  },
]

export const ArchitectureDiagram: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('silicon-rtl')
  const activeData = SYSTEM_NODES.find((n) => n.id === selectedNode) || SYSTEM_NODES[1]

  return (
    <div className="tech-diagram-card">
      <div className="tech-diagram-header">
        <div className="tech-diagram-title-group">
          <span className="tech-dot" />
          <span className="tech-schematic-code">SCHEMATIC REF: SYS-ARCH-V3</span>
        </div>
        <span className="tech-schematic-status">CAD DRAFTING: 100% ORTHO</span>
      </div>

      {/* Interactive System Pipeline Nodes */}
      <div className="tech-nodes-flow">
        {SYSTEM_NODES.map((node, index) => {
          const isSelected = selectedNode === node.id
          return (
            <div key={node.id} className="tech-node-wrapper">
              <button
                type="button"
                onClick={() => setSelectedNode(node.id)}
                className={`tech-node-btn ${isSelected ? 'is-selected' : ''}`}
                aria-pressed={isSelected}
              >
                <div className="tech-node-top">
                  <span className="tech-node-layer">{node.layer}</span>
                  <span className="tech-node-status">{node.status}</span>
                </div>
                <h4 className="tech-node-label">{node.label}</h4>
                <p className="tech-node-spec">{node.spec}</p>
              </button>
              {index < SYSTEM_NODES.length - 1 && (
                <div className="tech-flow-connector" aria-hidden="true">
                  <span className="tech-pulse-dot" />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="12" y1="5" x2="12" y2="19" strokeWidth="1.5" strokeDasharray="3 3" />
                    <polyline points="7 14 12 19 17 14" strokeWidth="1.5" />
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Inspector Panel for Selected Node */}
      <div className="tech-inspector-panel">
        <div className="tech-inspector-meta">
          <span className="tech-inspector-tag">SUBSYSTEM INSPECTION // {activeData.layer}</span>
          <span className="tech-inspector-id">{activeData.label}</span>
        </div>
        <div className="tech-subsystems-list">
          {activeData.subsystems.map((sub, idx) => (
            <div key={idx} className="tech-subsystem-pill">
              <span className="pill-index">0{idx + 1}</span>
              <span className="pill-name">{sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
