export default function AboutSection() {
  return (
    <section id="about" className="about-section" aria-labelledby="about-heading">
      <div className="about-content-wrapper">
        {/* Section Tag */}
        <div className="section-eyebrow-row">
          <span className="section-eyebrow-tag">03 / PROFESSIONAL PROFILE</span>
          <span className="section-eyebrow-divider">·</span>
          <span className="section-eyebrow-text">EDUCATION &amp; SKILLS MATRIX</span>
        </div>

        <h2 id="about-heading" className="about-main-heading">
          Bridging physical silicon logic<br />with autonomous intelligence.
        </h2>

        {/* Narrative & Focus */}
        <div className="about-narrative-grid">
          <div className="about-narrative-col">
            <p className="about-lead-text">
              I&apos;m Ankush Malothia (Sirosiu). My engineering practice is anchored in the belief
              that the most impactful systems emerge when you understand the full computational continuum—from
              the digital gates and instruction pipelines in hardware, up to the low-level runtimes
              and autonomous AI agents orchestrating real-world workflows.
            </p>
            <p className="about-sub-text">
              Whether architecting a custom 5-stage RISC-V CPU with systolic matrix coprocessors,
              tuning localized 4-bit LLM inference pipelines in Ave to eliminate cloud data egress,
              or modeling electromagnetic field distributions for high-frequency antenna arrays,
              I build with rigorous benchmarking, mechanical empathy, and architectural clarity.
            </p>
          </div>

          {/* Education & Academic Foundation */}
          <div className="about-education-card">
            <div className="edu-card-header">
              <span className="edu-icon">🎓</span>
              <div>
                <span className="edu-badge">ACADEMIC FOUNDATION</span>
                <h3 className="edu-degree">Bachelor of Technology (B.Tech)</h3>
              </div>
            </div>
            <p className="edu-field">Electronics &amp; Communication Engineering (ECE)</p>
            <p className="edu-institution" style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', fontWeight: 500 }}>
              Dr. B. R. Ambedkar National Institute of Technology, Jalandhar (NIT Jalandhar)
            </p>
            <p style={{ fontSize: '12px', color: '#f59e0b', marginTop: '2px', fontFamily: 'var(--font-mono, monospace)' }}>
              Expected Graduation: 2028
            </p>
            <div className="edu-divider" />
            <h4 className="edu-coursework-title">RELEVANT SPECIALIZATIONS &amp; FOCUS:</h4>
            <div className="edu-tags">
              <span>Efficient AI Inference</span>
              <span>Computer Architecture</span>
              <span>Hardware-Software Integration</span>
              <span>Digital VLSI &amp; Verilog</span>
              <span>RF &amp; EM Antenna Modeling (CST)</span>
              <span>Applied Machine Learning</span>
              <span>Full-Stack Systems (FastAPI/Next.js)</span>
              <span>Linux &amp; Systems Engineering</span>
            </div>
          </div>
        </div>

        {/* Skills with Evidence Matrix (4 Pillars) */}
        <div className="skills-evidence-block">
          <div className="skills-block-header">
            <span className="skills-block-tag">TECHNICAL CAPABILITIES</span>
            <h3 className="skills-block-title">Skills & Verified Engineering Evidence</h3>
            <p className="skills-block-sub">
              Every tool and technology grounded in verified architectural implementations and benchmarks.
            </p>
          </div>

          <div className="skills-pillars-grid">
            {/* Pillar 1: Silicon & Computer Architecture */}
            <div className="skill-pillar-card">
              <div className="pillar-header">
                <span className="pillar-num">01</span>
                <span className="pillar-icon">⊞</span>
                <h4 className="pillar-title">Silicon & Architecture</h4>
              </div>
              <p className="pillar-desc">
                RTL digital logic design, instruction set architecture (ISA), and hardware acceleration.
              </p>
              <div className="pillar-tech-list">
                <span className="tech-badge">SystemVerilog</span>
                <span className="tech-badge">Verilog</span>
                <span className="tech-badge">RISC-V ISA</span>
                <span className="tech-badge">FPGA (Vivado)</span>
                <span className="tech-badge">Verilator</span>
                <span className="tech-badge">gem5</span>
                <span className="tech-badge">GTKWave</span>
              </div>
              <div className="pillar-evidence-box">
                <span className="evidence-label">VERIFIED ARTIFACT:</span>
                <p className="evidence-text">
                  Authored 5-stage pipelined RV32I core with hazard forwarding and 4x4 systolic GEMM accelerator. Passed 100% of RISC-V architectural compliance test suite.
                </p>
              </div>
            </div>

            {/* Pillar 2: Low-Level Runtimes & Systems */}
            <div className="skill-pillar-card">
              <div className="pillar-header">
                <span className="pillar-num">02</span>
                <span className="pillar-icon">⚙</span>
                <h4 className="pillar-title">Low-Level & Runtimes</h4>
              </div>
              <p className="pillar-desc">
                Performance-critical systems programming, kernel workflows, and execution sandboxes.
              </p>
              <div className="pillar-tech-list">
                <span className="tech-badge">C</span>
                <span className="tech-badge">C++</span>
                <span className="tech-badge">Rust</span>
                <span className="tech-badge">Arch Linux</span>
                <span className="tech-badge">Hyprland / Shell</span>
                <span className="tech-badge">QEMU</span>
                <span className="tech-badge">Docker</span>
              </div>
              <div className="pillar-evidence-box">
                <span className="evidence-label">VERIFIED ARTIFACT:</span>
                <p className="evidence-text">
                  Built deterministic subprocess orchestration pipelines with memory-safe inter-process communication and low-latency POSIX terminal tooling.
                </p>
              </div>
            </div>

            {/* Pillar 3: Applied AI & Autonomous Agents */}
            <div className="skill-pillar-card">
              <div className="pillar-header">
                <span className="pillar-num">03</span>
                <span className="pillar-icon">🧠</span>
                <h4 className="pillar-title">Applied AI & Agents</h4>
              </div>
              <p className="pillar-desc">
                Local inference optimization, episodic agent memory, and autonomous task execution.
              </p>
              <div className="pillar-tech-list">
                <span className="tech-badge">Python</span>
                <span className="tech-badge">Ollama / Llama.cpp</span>
                <span className="tech-badge">Quantized LLMs (GGUF)</span>
                <span className="tech-badge">Agent Memory</span>
                <span className="tech-badge">FastAPI</span>
                <span className="tech-badge">ChromaDB</span>
                <span className="tech-badge">Tool Calling</span>
              </div>
              <div className="pillar-evidence-box">
                <span className="evidence-label">VERIFIED ARTIFACT:</span>
                <p className="evidence-text">
                  Architected Ave autonomous assistant with sub-48ms tool dispatch, hierarchical vector memory retention, and 100% local private execution.
                </p>
              </div>
            </div>

            {/* Pillar 4: RF & Electromagnetic Engineering */}
            <div className="skill-pillar-card">
              <div className="pillar-header">
                <span className="pillar-num">04</span>
                <span className="pillar-icon">📡</span>
                <h4 className="pillar-title">RF & Electromagnetics</h4>
              </div>
              <p className="pillar-desc">
                High-frequency electromagnetic simulation, impedance matching, and radiation analysis.
              </p>
              <div className="pillar-tech-list">
                <span className="tech-badge">MATLAB</span>
                <span className="tech-badge">CST Studio Suite</span>
                <span className="tech-badge">OpenEMS (FDTD)</span>
                <span className="tech-badge">Patch Antennas</span>
                <span className="tech-badge">S-Parameters (S11)</span>
                <span className="tech-badge">VSWR</span>
                <span className="tech-badge">WebGL 3D Visualizer</span>
              </div>
              <div className="pillar-evidence-box">
                <span className="evidence-label">VERIFIED ARTIFACT:</span>
                <p className="evidence-text">
                  Designed dual-band 2.4/5.8GHz patch antenna array with corporate feeding network, achieving S11 &lt; -22dB return loss and 7.8 dBi directional gain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
