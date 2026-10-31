import React from 'react'
import {
  ARTICLES,
  CAPABILITY_GROUPS,
  CORE_MESSAGING,
  LAB_EXPERIMENTS,
  NOW_FOCUS,
  PORTFOLIO_PROJECTS,
} from '../../data/portfolioData'
import { IconArrowRight, IconArrowUpRight, IconGithub } from '../../components/icons/Icons'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import './TechnicalStyles.css'

export const Concept04Technical: React.FC = () => {
  return (
    <div className="technical-viewport" data-concept="technical">
      {/* Header */}
      <header className="technical-header">
        <div className="technical-container technical-header-inner">
          <a href="#hero" className="technical-brand">
            <span>SIROSIU</span>
            <span className="technical-brand-chip">SYS-ARCH</span>
          </a>
          <nav className="technical-nav" aria-label="Technical Navigation">
            <a href="#case-studies" className="technical-nav-link">CASE STUDIES</a>
            <a href="#rd-index" className="technical-nav-link">R&D INDEX</a>
            <a href="#capabilities" className="technical-nav-link">CAPABILITIES</a>
            <a href="#philosophy" className="technical-nav-link">PHILOSOPHY</a>
            <a href="#research" className="technical-nav-link">RESEARCH</a>
            <a href="#now" className="technical-nav-link">CURRENT FOCUS</a>
            <a href="#inquiry" className="technical-nav-link">INQUIRY</a>
          </nav>
          <a href="#inquiry" className="technical-contact-btn">
            <span>TRANSMIT INQUIRY</span>
            <IconArrowRight size={13} />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="technical-hero">
        <div className="technical-container">
          <div className="technical-hero-grid">
            <div>
              <div className="technical-badge">
                <span>[ CONCEPT 04 // COMPUTATIONAL PRACTICE ]</span>
              </div>
              <h1 className="technical-headline">{CORE_MESSAGING.headline}</h1>
              <p className="technical-supporting">{CORE_MESSAGING.supporting}</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="#case-studies" className="technical-contact-btn" style={{ padding: '0.8rem 1.6rem' }}>
                  <span>Examine Case Studies</span>
                  <IconArrowRight size={15} />
                </a>
                <a
                  href="#philosophy"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: '1px solid var(--tc-border)',
                    padding: '0.8rem 1.5rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.85rem',
                    color: 'var(--tc-text-primary)',
                    textDecoration: 'none',
                    borderRadius: '2px',
                    background: '#fff',
                  }}
                >
                  <span>Engineering Methodology</span>
                </a>
              </div>
            </div>

            {/* Interactive System Architecture Centerpiece */}
            <ArchitectureDiagram />
          </div>
        </div>
      </section>

      {/* Engineering Case Studies */}
      <section id="case-studies" className="technical-section">
        <div className="technical-container">
          <div className="technical-section-head">
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--tc-orange)' }}>
                DISCIPLINE // VERIFIED IMPLEMENTATIONS
              </span>
              <h2 className="technical-section-title">Engineering Case Studies</h2>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--tc-text-muted)' }}>
              [ 06 VERIFIED WORKS ]
            </span>
          </div>

          <div className="technical-studies-grid">
            {PORTFOLIO_PROJECTS.map((p) => (
              <article key={p.id} className="c4-spec-sheet">
                {/* Spec Sheet Header */}
                <div className="c4-spec-header">
                  <div className="c4-spec-id-group">
                    <span className="c4-spec-doc-id">DOC: SPEC-2026-{p.domainCode}</span>
                    <span className="c4-spec-class">OPEN ARCHITECTURE</span>
                  </div>
                  <div className="c4-spec-status-pill">
                    <span className="c4-spec-status-dot" />
                    <span>{p.status.toUpperCase()} // VERIFIED</span>
                  </div>
                </div>

                {/* Spec Title & Tagline */}
                <div className="c4-spec-meta-block">
                  <div className="c4-spec-title-row">
                    <h3 className="c4-spec-title">{p.title}</h3>
                    <span className="c4-spec-domain-tag">{p.domain}</span>
                  </div>
                  <p className="c4-spec-tagline">{p.tagline}</p>
                </div>

                {/* 4-Quadrant Spec Grid */}
                <div className="c4-spec-quadrant-grid">
                  <div className="c4-quadrant-cell">
                    <span className="c4-quadrant-index">01 // QUANTITATIVE BOTTLENECK</span>
                    <p className="c4-quadrant-text">{p.problemStatement || p.summary}</p>
                  </div>
                  <div className="c4-quadrant-cell">
                    <span className="c4-quadrant-index">02 // ARCHITECTURAL APPROACH</span>
                    <p className="c4-quadrant-text">{p.technicalApproach || p.builtScope}</p>
                  </div>
                  <div className="c4-quadrant-cell">
                    <span className="c4-quadrant-index">03 // SYSTEM TOPOLOGY & BUS INTERCONNECT</span>
                    <p className="c4-quadrant-text font-mono">{p.systemArchitecture || p.architectureHighlight}</p>
                  </div>
                  <div className="c4-quadrant-cell">
                    <span className="c4-quadrant-index">04 // MEASURED VERIFICATION OUTCOME</span>
                    <p className="c4-quadrant-text highlight-outcome">
                      {p.measuredOutcome || p.outcomes?.[0] || '100% Hardware/Code Verified'}
                    </p>
                  </div>
                </div>

                {/* Hard Benchmark Metrics Bar */}
                <div className="c4-spec-metrics-bar">
                  {p.metrics.slice(0, 4).map((m, idx) => (
                    <div key={idx} className="c4-spec-metric-item">
                      <span className="c4-metric-lbl">{m.label}</span>
                      <span className="c4-metric-val">{m.value}</span>
                    </div>
                  ))}
                </div>

                {/* Footer with Tags and Source */}
                <div className="c4-spec-footer">
                  <div className="c4-spec-tags">
                    {p.tags.slice(0, 4).map((t, idx) => (
                      <span key={idx} className="c4-spec-tag-pill">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="c4-spec-repo-btn"
                  >
                    <span>INSPECT REPO</span>
                    <IconArrowUpRight size={13} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* R&D Lab Index */}
      <section id="rd-index" className="technical-section">
        <div className="technical-container">
          <div className="technical-section-head">
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--tc-cyan)' }}>
                DISCIPLINE // RESEARCH BENCHMARKS
              </span>
              <h2 className="technical-section-title">R&D Index</h2>
            </div>
          </div>

          <div>
            {LAB_EXPERIMENTS.map((exp) => (
              <div key={exp.id} className="technical-lab-row">
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--tc-orange)' }}>
                  {exp.index}
                </span>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.35rem 0' }}>{exp.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--tc-text-secondary)', margin: 0 }}>{exp.description}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  {exp.tech.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.7rem',
                        background: 'var(--tc-bg-surface-elevated)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '2px',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Capabilities Matrix */}
      <section id="capabilities" className="technical-section">
        <div className="technical-container">
          <div className="technical-section-head">
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--tc-orange)' }}>
                DISCIPLINE // SYSTEM RELATIONSHIPS
              </span>
              <h2 className="technical-section-title">Capabilities Matrix</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {CAPABILITY_GROUPS.map((g) => (
              <div key={g.code} style={{ background: '#fff', border: '1px solid var(--tc-border)', padding: '2rem', borderRadius: '3px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--tc-cyan)', display: 'block', marginBottom: '0.5rem' }}>
                  {g.code}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{g.category}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--tc-text-secondary)', marginBottom: '1.25rem' }}>{g.summary}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {g.skills.map((s, idx) => (
                    <div key={idx} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--tc-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '4px', height: '4px', background: 'var(--tc-orange)', borderRadius: '50%' }} />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Philosophy / About */}
      <section id="philosophy" className="technical-section">
        <div className="technical-container">
          <div className="technical-section-head">
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--tc-cyan)' }}>
                DISCIPLINE // COMPUTATIONAL RIGOR
              </span>
              <h2 className="technical-section-title">Engineering Methodology</h2>
            </div>
          </div>

          <div className="technical-philosophy-grid">
            <div>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--tc-text-secondary)', marginBottom: '1.5rem' }}>
                True computational engineering starts with hardware-software co-design. We avoid
                superficial abstractions by maintaining active competency across all layers of the
                computing stack: from the physical electromagnetic behavior of antennas, up through
                RTL pipeline hazards in silicon, to edge neural models and distributed web runtimes.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--tc-text-secondary)' }}>
                By adhering to verified specifications, open standards (RISC-V, POSIX, W3C), and
                strict latency/memory budgets, we craft software and hardware systems that remain
                predictable, efficient, and resilient under real-world operational stress.
              </p>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--tc-border)', padding: '2.5rem', borderRadius: '3px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--tc-orange)', marginBottom: '1rem' }}>
                METRIC VERIFICATION MANDATE
              </div>
              <blockquote style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
                “Every architectural assertion must be substantiated by automated testbenches or physical instrumentation.”
              </blockquote>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--tc-text-muted)' }}>
                ANKUSH MALOTHIA // SIROSIU PRACTICE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Writing / Research */}
      <section id="research" className="technical-section">
        <div className="technical-container">
          <div className="technical-section-head">
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--tc-orange)' }}>
                DISCIPLINE // MONOGRAPHS
              </span>
              <h2 className="technical-section-title">Technical Writing & Publications</h2>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {ARTICLES.map((art) => (
              <a
                key={art.id}
                href={art.link}
                className="technical-writing-item"
              >
                <div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--tc-orange)', display: 'block', marginBottom: '0.25rem' }}>
                    {art.index} • {art.category}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.35rem 0' }}>{art.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--tc-text-secondary)', margin: 0 }}>{art.summary}</p>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--tc-text-muted)', whiteSpace: 'nowrap' }}>
                  {art.date} // {art.readTime}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Now Focus */}
      <section id="now" className="technical-section">
        <div className="technical-container">
          <div className="technical-section-head">
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--tc-cyan)' }}>
                DISCIPLINE // ACTIVE CYCLES
              </span>
              <h2 className="technical-section-title">Current Technical Focus</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {NOW_FOCUS.map((item, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid var(--tc-border)', padding: '1.75rem', borderRadius: '3px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--tc-orange)', display: 'block', marginBottom: '0.5rem' }}>
                  FOCUS // {item.tag}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--tc-text-secondary)', lineHeight: 1.6 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry & Footer */}
      <footer id="inquiry" className="technical-footer">
        <div className="technical-container">
          <div style={{ maxWidth: '640px', marginBottom: '3.5rem' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--tc-orange)' }}>
              DISCIPLINE // PROFESSIONAL INQUIRY
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0.5rem 0 1rem 0' }}>
              Initiate Technical Consultation
            </h2>
            <p style={{ color: 'var(--tc-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Engaging on custom microprocessor co-processors, local agent runtimes, and high-frequency RF systems modeling.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="mailto:ankushmalothia@gmail.com"
                className="technical-contact-btn"
                style={{ padding: '0.75rem 1.75rem' }}
              >
                <span>ankushmalothia@gmail.com</span>
                <IconArrowUpRight size={14} />
              </a>
              <a
                href="https://github.com/Sirosiu"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: '1px solid var(--tc-border)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '2px',
                  background: '#fff',
                  color: 'var(--tc-text-primary)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                }}
              >
                <IconGithub size={16} />
                <span>github.com/Sirosiu</span>
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--tc-border-light)', paddingTop: '1.5rem' }}>
            <div>SIROSIU COMPUTATIONAL PRACTICE © 2026 // CONCEPT 04: TECHNICAL</div>
            <div>VERIFIED ON CLOUDFLARE WORKERS • 60 FPS • ACCESSIBLE DOM</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
