import React, { useState } from 'react'

export interface HardwareNode {
  id: string
  tierId: string
  tierName: string
  code: string
  title: string
  busProtocol: string
  clockDomain: string
  latency: string
  specOutcome: string
  powerEnvelope: string
  footprint: string
  codeSnippet: string
  codeLanguage: string
  downstreamIds: string[]
}

const HARDWARE_TIERS: { id: string; name: string; tag: string }[] = [
  { id: 't1', name: 'PHYSICAL & RF/ANALOG FRONTEND', tag: 'TIER 01' },
  { id: 't2', name: 'RTL MICROARCHITECTURE', tag: 'TIER 02' },
  { id: 't3', name: 'SYSTEMS & KERNEL RUNTIME', tag: 'TIER 03' },
  { id: 't4', name: 'APPLIED ML & AGENT INFERENCE', tag: 'TIER 04' },
]

const HARDWARE_NODES: HardwareNode[] = [
  // TIER 1
  {
    id: 'lna-adc',
    tierId: 't1',
    tierName: 'TIER 01 // PHYSICAL & RF/ANALOG FRONTEND',
    code: 'HW-MOD-01',
    title: 'Neural BCI & LNA Frontend',
    busProtocol: 'SPI-TDM / 24-Bit Sigma-Delta ADC',
    clockDomain: '32 kHz Sample Rate',
    latency: '14.2 µs Pipeline Delay',
    specOutcome: '98.4 dB CMRR, sub-microvolt noise floor (0.85 µVrms)',
    powerEnvelope: '1.4 mW Low-Power Rail',
    footprint: 'Analog Front-End Die Area 0.38 mm²',
    codeLanguage: 'c',
    codeSnippet: `// Analog Frontend Register Calibration
void afe_calibrate_offset(afe_channel_t *ch) {
    uint32_t baseline = adc_read_oversample(ch->adc_idx, 64);
    ch->dac_trim = (baseline > AFE_VREF_MID) ? (baseline - AFE_VREF_MID) : 0;
    afe_write_reg(AFE_REG_TRIM, ch->dac_trim);
}`,
    downstreamIds: ['riscv-core'],
  },
  {
    id: 'rf-patch',
    tierId: 't1',
    tierName: 'TIER 01 // PHYSICAL & RF/ANALOG FRONTEND',
    code: 'EM-ANT-02',
    title: 'Dual-Band RF Microstrip Array',
    busProtocol: 'Coaxial SMA / 50Ω Microstrip Feed',
    clockDomain: '2.45 GHz / 5.80 GHz Dual-Resonant',
    latency: '< 0.5 ns Propagation Delay',
    specOutcome: 'Return loss S11 < -22.4 dB, cross-polarization isolation > 28 dB',
    powerEnvelope: 'Passive Microstrip Substrate (Rogers RO4003C)',
    footprint: 'Substrate dimensions 42 x 38 x 1.52 mm',
    codeLanguage: 'openems',
    codeSnippet: `%% openEMS FDTD Boundary Setup
CSX = AddMaterial(CSX, 'RO4003C');
CSX = SetMaterialProperty(CSX, 'RO4003C', 'Epsilon', 3.55, 'Mue', 1.0);
FDTD = SetGaussExcite(FDTD, 0.5*(f_start+f_stop), 0.5*(f_stop-f_start));
BC = {'MUR_PML', 'MUR_PML', 'MUR_PML', 'MUR_PML', 'PEC', 'MUR_PML'};`,
    downstreamIds: ['lna-adc'],
  },

  // TIER 2
  {
    id: 'riscv-core',
    tierId: 't2',
    tierName: 'TIER 02 // RTL MICROARCHITECTURE',
    code: 'RTL-CORE-03',
    title: '5-Stage RV32I Pipelined Core',
    busProtocol: 'AXI4-Lite Master / Harvard 32-Bit Memory Bus',
    clockDomain: '120 MHz Target Clock',
    latency: '1 Cycle / Instruction (Optimal)',
    specOutcome: 'Hazard detection & forwarding logic fully verified via Verilator',
    powerEnvelope: '18.2 mW Dynamic Power at 1.1V',
    footprint: '7,420 LUTs on Artix-7 FPGA (XC7A35T)',
    codeLanguage: 'verilog',
    codeSnippet: `// 5-Stage Hazard Forwarding Unit
always_comb begin
  forward_a = 2'b00;
  if (ex_mem_regwrite && (ex_mem_rd != 0) && (ex_mem_rd == id_ex_rs1))
    forward_a = 2'b10; // Forward from MEM stage
  else if (mem_wb_regwrite && (mem_wb_rd != 0) && (mem_wb_rd == id_ex_rs1))
    forward_a = 2'b01; // Forward from WB stage
end`,
    downstreamIds: ['dma-ring'],
  },
  {
    id: 'vec-mac',
    tierId: 't2',
    tierName: 'TIER 02 // RTL MICROARCHITECTURE',
    code: 'VEC-MAC-04',
    title: 'Systolic Tensor Array MAC',
    busProtocol: 'AXI4-Stream 128-Bit Interconnect',
    clockDomain: '850 MHz Synthesized Macro',
    latency: '2 Clock Cycles per Tile Multiply',
    specOutcome: '4.2 TOPS/W INT8 systolic array peak energy efficiency',
    powerEnvelope: '124 mW Core Dynamic Power',
    footprint: '16x16 Processing Element Systolic Mesh',
    codeLanguage: 'systemverilog',
    codeSnippet: `// 16-bit Fixed-Point Systolic Processing Element
module pe_cell (
  input  logic clk, rst_n,
  input  logic signed [7:0] in_a, in_b,
  output logic signed [7:0] out_a, out_b,
  output logic signed [31:0] accum
);
  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) accum <= '0;
    else        accum <= accum + (in_a * in_b);
    out_a <= in_a; out_b <= in_b;
  end
endmodule`,
    downstreamIds: ['quant-llm'],
  },

  // TIER 3
  {
    id: 'dma-ring',
    tierId: 't3',
    tierName: 'TIER 03 // SYSTEMS & KERNEL RUNTIME',
    code: 'SYS-DMA-05',
    title: 'Zero-Copy DMA Ring Buffer',
    busProtocol: 'PCIe Gen4 x4 / Kernel eBPF Telemetry Hook',
    clockDomain: 'Asynchronous Lockless Interrupt',
    latency: '1.1 µs Ring Wakeup',
    specOutcome: 'Eliminated kernel-to-user context copy overhead; 100% throughput retention',
    powerEnvelope: 'Host Memory Subsystem Bus Master',
    footprint: 'Pinned 64MB HugePage Ring Allocation',
    codeLanguage: 'rust',
    codeSnippet: `// Lock-Free Single-Producer Single-Consumer DMA Ring
pub struct DmaRingBuffer<T, const N: usize> {
    head: CachePadded<AtomicUsize>,
    tail: CachePadded<AtomicUsize>,
    buffer: [UnsafeCell<MaybeUninit<T>>; N],
}
impl<T: Copy, const N: usize> DmaRingBuffer<T, N> {
    pub fn push_zero_copy(&self, val: T) -> Result<(), BufferFull> {
        let head = self.head.load(Ordering::Relaxed);
        let tail = self.tail.load(Ordering::Acquire);
        if head.wrapping_sub(tail) >= N { return Err(BufferFull); }
        unsafe { (*self.buffer[head % N].get()).write(val); }
        self.head.store(head.wrapping_add(1), Ordering::Release);
        Ok(())
    }
}`,
    downstreamIds: ['ave-orch'],
  },

  // TIER 4
  {
    id: 'ave-orch',
    tierId: 't4',
    tierName: 'TIER 04 // APPLIED ML & AGENT INFERENCE',
    code: 'AGT-AVE-06',
    title: 'A.V.E. Autonomous Agent Engine',
    busProtocol: 'Asynchronous Event Loop / IPC Unix Domain Socket',
    clockDomain: 'Sub-48ms Event Loop Dispatch',
    latency: '36 ms Tool Execution Dispatch',
    specOutcome: 'Episodic memory graph + sandboxed tool loop with strict verification gate',
    powerEnvelope: 'CPU/GPU Co-Processor Edge Dispatch',
    footprint: 'Rust Native Binary footprint < 14MB',
    codeLanguage: 'rust',
    codeSnippet: `// Sandboxed Tool Dispatch Verification Loop
pub async fn dispatch_verified_tool(&self, call: ToolCall) -> Result<ToolResult, AgentError> {
    let policy = self.security_manifest.validate(&call)?;
    if !policy.is_permitted() { return Err(AgentError::PolicyViolation(call.name)); }
    let start = Instant::now();
    let outcome = self.sandbox.execute(call).await?;
    self.telemetry.record_latency(start.elapsed());
    Ok(outcome)
}`,
    downstreamIds: [],
  },
  {
    id: 'quant-llm',
    tierId: 't4',
    tierName: 'TIER 04 // APPLIED ML & AGENT INFERENCE',
    code: 'ML-QUANT-07',
    title: 'Quantized INT4 Weight Engine',
    busProtocol: 'KV-Cache Paged SRAM / Unified Memory Arena',
    clockDomain: 'Dynamic Frequency Scaled Tensor Units',
    latency: '84 Tokens/sec on edge compute',
    specOutcome: '-64% first-token latency through flash-attention fused kernels',
    powerEnvelope: '14.5W TDP on Edge Accelerator',
    footprint: '4.8 GB INT4 Quantized Memory Footprint',
    codeLanguage: 'python',
    codeSnippet: `# Fused INT4 Matrix-Vector Kernel
@triton.jit
def fused_int4_gemv_kernel(
    a_ptr, b_ptr, c_ptr, scales_ptr,
    M, K, BLOCK_SIZE: tl.constexpr
):
    pid = tl.program_id(0)
    offs_k = tl.arange(0, BLOCK_SIZE)
    a = tl.load(a_ptr + pid * K + offs_k)
    b_packed = tl.load(b_ptr + offs_k)
    b_unpacked = unpack_int4(b_packed)
    scale = tl.load(scales_ptr + pid)
    c = tl.sum(a * b_unpacked) * scale
    tl.store(c_ptr + pid, c)`,
    downstreamIds: [],
  },
]

export const ArchitectureDiagram: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('riscv-core')
  const activeNode = HARDWARE_NODES.find((n) => n.id === selectedNodeId) || HARDWARE_NODES[2]

  return (
    <div className="c4-schematic-workbench" aria-label="Interactive 4-Tier Systems Architecture Schematic">
      {/* Schematic Header Bar */}
      <div className="c4-schematic-header">
        <div className="c4-schematic-title-group">
          <span className="c4-schematic-beacon" />
          <div>
            <span className="c4-schematic-code">SCHEMATIC REF // SYS-ARCH-V3.8</span>
            <span className="c4-schematic-sub">MULTI-TIER SILICON & AGENT TOPOLOGY</span>
          </div>
        </div>
        <div className="c4-schematic-badge">
          <span>CLASSIFICATION: OPEN SPEC</span>
          <span className="c4-badge-verified">SILICON VERIFIED</span>
        </div>
      </div>

      <div className="c4-schematic-layout">
        {/* Left Side: 4 Swimlanes & Interactive Circuit Blocks */}
        <div className="c4-swimlanes-container">
          {/* Animated SVG Bus Traces Background */}
          <svg className="c4-bus-traces-svg" aria-hidden="true">
            <defs>
              <linearGradient id="bus-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#ea580c" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {/* Orthogonal Manhattan Bus Lines */}
            <path d="M 120 70 L 120 140 L 220 140 L 220 190" className="c4-bus-track" />
            <path d="M 120 70 L 120 140 L 220 140 L 220 190" className="c4-bus-active" />

            <path d="M 220 230 L 220 290 L 160 290 L 160 340" className="c4-bus-track" />
            <path d="M 220 230 L 220 290 L 160 290 L 160 340" className="c4-bus-active" />

            <path d="M 160 380 L 160 440 L 220 440 L 220 480" className="c4-bus-track" />
            <path d="M 160 380 L 160 440 L 220 440 L 220 480" className="c4-bus-active" />
          </svg>

          {HARDWARE_TIERS.map((tier) => {
            const tierNodes = HARDWARE_NODES.filter((n) => n.tierId === tier.id)
            return (
              <div key={tier.id} className="c4-swimlane">
                <div className="c4-swimlane-label">
                  <span className="c4-tier-tag">{tier.tag}</span>
                  <span className="c4-tier-name">{tier.name}</span>
                </div>
                <div className="c4-swimlane-nodes">
                  {tierNodes.map((node) => {
                    const isSelected = selectedNodeId === node.id
                    const isRelated =
                      isSelected ||
                      activeNode.downstreamIds.includes(node.id) ||
                      node.downstreamIds.includes(activeNode.id)
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`c4-module-block ${isSelected ? 'is-selected' : ''} ${
                          !isRelated ? 'is-dimmed' : ''
                        }`}
                        aria-pressed={isSelected}
                      >
                        <div className="c4-module-header">
                          <span className="c4-module-code">{node.code}</span>
                          <span className="c4-module-dot" />
                        </div>
                        <h4 className="c4-module-title">{node.title}</h4>
                        <div className="c4-module-meta">
                          <span>{node.clockDomain}</span>
                          <span className="c4-module-latency">{node.latency}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Side: Live Hardware Telemetry Inspector Drawer */}
        <aside className="c4-inspector-drawer">
          <div className="c4-inspector-head">
            <span className="c4-inspector-eyebrow">NODE TELEMETRY INSPECTOR</span>
            <h3 className="c4-inspector-title">{activeNode.title}</h3>
            <span className="c4-inspector-tier-badge">{activeNode.tierName}</span>
          </div>

          <div className="c4-inspector-specs-grid">
            <div className="c4-spec-row">
              <span className="c4-spec-key">BUS PROTOCOL</span>
              <span className="c4-spec-val highlight">{activeNode.busProtocol}</span>
            </div>
            <div className="c4-spec-row">
              <span className="c4-spec-key">CLOCK DOMAIN</span>
              <span className="c4-spec-val">{activeNode.clockDomain}</span>
            </div>
            <div className="c4-spec-row">
              <span className="c4-spec-key">LATENCY BOUND</span>
              <span className="c4-spec-val highlight-orange">{activeNode.latency}</span>
            </div>
            <div className="c4-spec-row">
              <span className="c4-spec-key">POWER ENVELOPE</span>
              <span className="c4-spec-val">{activeNode.powerEnvelope}</span>
            </div>
            <div className="c4-spec-row">
              <span className="c4-spec-key">HARDWARE FOOTPRINT</span>
              <span className="c4-spec-val">{activeNode.footprint}</span>
            </div>
            <div className="c4-spec-row full-width">
              <span className="c4-spec-key">VERIFIED OUTCOME</span>
              <span className="c4-spec-val outcome">{activeNode.specOutcome}</span>
            </div>
          </div>

          {/* Code / RTL / C Snippet Preview */}
          <div className="c4-inspector-code-box">
            <div className="c4-code-header">
              <span className="c4-code-lang">SOURCE VERIFICATION [{activeNode.codeLanguage.toUpperCase()}]</span>
              <span className="c4-code-file">{activeNode.code}.src</span>
            </div>
            <pre className="c4-code-snippet">
              <code>{activeNode.codeSnippet}</code>
            </pre>
          </div>
        </aside>
      </div>

      {/* Silkscreen PCB Revision Stamp */}
      <div className="c4-silkscreen-stamp">
        REV 3.8 // SHINO-SILICON // 4-TIER COMPUTE TELEMETRY DIE // ORTHOGRAPHIC EDA 0.05
      </div>
    </div>
  )
}
