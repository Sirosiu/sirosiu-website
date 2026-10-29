export default function ExperienceSection() {
  const experiences = [
    {
      period: '2024 – PRESENT',
      role: 'Lead Systems & AI Architect',
      organization: 'Ave Core Maintainer · Independent System',
      badge: 'ACTIVE ARCHITECTURE',
      badgeType: 'active',
      summary:
        'Architecting a local-first, privacy-preserving autonomous assistant runtime with on-device LLM inference, sub-48ms tool calling, and hierarchical episodic memory.',
      deliverables: [
        'Authored deterministic tool execution engine with dynamic function calling and sandboxed shell execution.',
        'Engineered hierarchical memory retrieval using quantized embedding vectors and cosine similarity cache in ChromaDB.',
        'Optimized local 4-bit and 8-bit GGUF model execution across Ollama and llama.cpp runtimes to guarantee zero cloud egress.',
      ],
      skills: ['Python', 'Ollama', 'llama.cpp', 'ChromaDB', 'FastAPI', 'Agent Memory', 'Tool Calling'],
    },
    {
      period: '2023 – PRESENT',
      role: 'Computer Architecture & RTL Researcher',
      organization: 'Independent Lab & Academic Research',
      badge: 'SILICON VERIFICATION',
      badgeType: 'verified',
      summary:
        'Designing, simulating, and synthesizing 32-bit pipelined RISC-V processor cores and systolic array matrix multiply hardware coprocessors in SystemVerilog.',
      deliverables: [
        'Implemented 5-stage RISC-V (RV32I) microarchitecture with full hazard forwarding, data hazard resolution, and branch penalty minimization.',
        'Achieved 100% pass rate across the official RISC-V architectural compliance test suite in Verilator cycle-accurate simulation.',
        'Synthesized RTL bitstreams on AMD/Xilinx Artix-7 FPGA using Vivado with verified timing closure and resource utilization analysis.',
      ],
      skills: ['SystemVerilog', 'Verilog', 'RISC-V ISA', 'Vivado', 'Verilator', 'gem5', 'GTKWave', 'C++'],
    },
    {
      period: '2023 – 2024',
      role: 'High-Frequency RF & Antenna Design Engineer',
      organization: 'ECE Communications Laboratory',
      badge: 'LAB RESEARCH',
      badgeType: 'lab',
      summary:
        'Conducted electromagnetic field modeling, microstrip patch antenna array geometry optimization, and impedance matching for dual-band wireless links.',
      deliverables: [
        'Designed 2.4/5.8GHz dual-band patch antenna array with optimized corporate microstrip feeding network.',
        'Validated S-parameters in CST Studio Suite and OpenEMS FDTD, achieving return loss S11 < -22 dB and VSWR < 1.15.',
        'Generated far-field 3D radiation gain patterns (7.8 dBi) and surface current density maps using custom MATLAB scripts.',
      ],
      skills: ['CST Studio Suite', 'OpenEMS (FDTD)', 'MATLAB', 'S-Parameters', 'VSWR', 'Radiation Patterns', 'DSP'],
    },
    {
      period: '2022 – PRESENT',
      role: 'Systems Software & Linux Infrastructure Developer',
      organization: 'Open Source Systems & Environment Tooling',
      badge: 'SYSTEMS & RUNTIMES',
      badgeType: 'systems',
      summary:
        'Developing deterministic development environments, Wayland compositor customizations, and memory-safe systems software on Arch Linux.',
      deliverables: [
        'Engineered custom Hyprland, Waybar, and shell environments with asynchronous C/Rust telemetry widgets.',
        'Configured reproducible multi-boot development setups, Docker container sandboxes, and automated build pipelines.',
        'Authored POSIX shell utilities for rapid kernel configuration, package compilation, and hardware driver debugging.',
      ],
      skills: ['C', 'Rust', 'Arch Linux', 'Hyprland', 'Docker', 'Bash', 'POSIX Shell', 'QEMU'],
    },
  ]

  return (
    <section id="experience" className="experience-section" aria-labelledby="experience-heading">
      <div className="experience-content-wrapper">
        {/* Section Tag */}
        <div className="section-eyebrow-row">
          <span className="section-eyebrow-tag">02 / TRACK RECORD</span>
          <span className="section-eyebrow-divider">//</span>
          <span className="section-eyebrow-text">PROFESSIONAL & RESEARCH EXPERIENCE</span>
        </div>

        <div className="experience-header-block">
          <h2 id="experience-heading" className="experience-main-heading">
            Engineering resilient systems<br />with measured outcomes.
          </h2>
          <p className="experience-lead-text">
            Hands-on technical roles, independent core maintainership, and academic laboratory research
            bridging silicon design, low-level Linux systems, and autonomous AI agents.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="experience-timeline">
          {experiences.map((exp, idx) => (
            <article key={idx} className="experience-card">
              <div className="exp-card-left">
                <span className="exp-period">{exp.period}</span>
                <span className={`exp-badge badge-${exp.badgeType}`}>{exp.badge}</span>
              </div>

              <div className="exp-card-body">
                <div className="exp-role-row">
                  <h3 className="exp-role">{exp.role}</h3>
                  <span className="exp-org">{exp.organization}</span>
                </div>

                <p className="exp-summary">{exp.summary}</p>

                <div className="exp-deliverables-block">
                  <h4 className="exp-deliverables-title">VERIFIED DELIVERABLES & OUTCOMES:</h4>
                  <ul className="exp-deliverables-list">
                    {exp.deliverables.map((item, dIdx) => (
                      <li key={dIdx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="exp-skills-row">
                  {exp.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="exp-skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
