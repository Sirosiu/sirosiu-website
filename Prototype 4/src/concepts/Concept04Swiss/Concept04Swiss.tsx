import React, { useEffect, useRef, useState, useMemo } from 'react'
import {
  PORTFOLIO_PROJECTS,
  ENGINEERING_CAPABILITIES,
  SITE_METADATA,
  ProjectItem,
} from '../../data/portfolioData'
import { SwissCurtainEngine } from './SwissCurtainEngine'
import { ProjectSchematicVisualizer } from '../../components/ProjectSchematicVisualizer'
import './SwissStyles.css'

export const Concept04Swiss: React.FC = () => {
  const swissRootRef = useRef<HTMLDivElement | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeProject, setActiveProject] = useState<ProjectItem>(PORTFOLIO_PROJECTS[0])
  const [dossierOpen, setDossierOpen] = useState(false)
  const [fontSizeScale, setFontSizeScale] = useState<number>(100)
  const [editorialKerning, setEditorialKerning] = useState<number>(0)

  // Mount Swiss Editorial Word-by-Word & Curtain Engine
  useEffect(() => {
    if (!swissRootRef.current) return
    const engine = new SwissCurtainEngine(swissRootRef.current)
    return () => engine.dispose()
  }, [])

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setScrollY(currentY)

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const prog = Math.min(1, Math.max(0, currentY / maxScroll))
      setScrollProgress(prog)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Words for word-by-word scroll-scrubbed manifesto
  const manifestoParagraph = useMemo(() => {
    return 'We engineer computing systems from first physical principles — bridging the physical reality of electromagnetic waves, synthesized silicon RTL, distributed memory hierarchies, and sovereign autonomous intelligence. True elegance is not the accumulation of ornament, but the reduction of complexity to its purest, most resilient form.'
  }, [])

  const words = useMemo(() => manifestoParagraph.split(' '), [manifestoParagraph])

  return (
    <div ref={swissRootRef} className="swiss-root">
      {/* Floating Monograph Reading Telemetry Header */}
      <div className="swiss-hud-fixed">
        <div className="swiss-hud-cell">
          <span className="swiss-hud-label">FOLIO PUBLICATION</span>
          <strong className="swiss-mono-ink">VOL. IV // ARCHITECTURAL CURTAIN</strong>
        </div>
        <div className="swiss-hud-cell">
          <span className="swiss-hud-label">READING PROGRESS</span>
          <strong className="swiss-mono-rust">{(scrollProgress * 100).toFixed(1)}% COMPLETE</strong>
        </div>
        <div className="swiss-hud-cell">
          <span className="swiss-hud-label">PAGE GRID</span>
          <strong>ASYLUM 12-COL ASYMMETRIC</strong>
        </div>
        <div className="swiss-hud-cell">
          <span className="swiss-hud-label">LOCATION</span>
          <strong>31.3260° N, 75.5762° E</strong>
        </div>
      </div>

      {/* Hero Section: Pure Typographic Curtain */}
      <header className="swiss-hero-section">
        <div className="swiss-hero-container">
          <div className="swiss-hero-meta">
            <span className="swiss-colophon-tag">SIROSIU MONOGRAPH</span>
            <span className="swiss-date-tag">AUTUMN 2026</span>
          </div>

          <h1
            className="swiss-hero-title"
            style={{
              fontSize: `clamp(3rem, ${fontSizeScale * 0.08}vw, 7.5rem)`,
              letterSpacing: `${editorialKerning * 0.01}em`,
            }}
          >
            Engineering <em>discipline</em> at the edge of computation.
          </h1>

          <div
            className="swiss-author-row"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              margin: '20px 0 28px 0',
              padding: '6px 16px',
              border: '1px solid #e4e4e7',
              background: '#fcfcfc',
              borderRadius: 4,
            }}
          >
            <img
              src="/assets/images/sirosiu-portrait.webp"
              alt="Ankush Malothia (Sirosiu)"
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid #18181b',
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#18181b', fontFamily: 'serif' }}>
                Ankush Malothia (Sirosiu)
              </div>
              <div style={{ fontSize: '0.72rem', color: '#71717a', fontFamily: 'var(--swiss-font-mono)' }}>
                Author &bull; First-Principles Systems Architect &bull; Silicon &bull; RF
              </div>
            </div>
          </div>

          <div className="swiss-hero-columns">
            <div className="swiss-hero-col-left">
              <span className="swiss-dropcap">S</span>
              <p>
                IROSIU is the personal engineering practice and research laboratory of Ankush
                Malothia. Spanning custom ASIC accelerators, high-frequency antenna arrays, and
                probabilistic machine learning models, every system is designed with rigorous physical
                grounding and typographic restraint.
              </p>
            </div>
            <div className="swiss-hero-col-right">
              <p>
                The digital artifacts presented herein document verified production silicon, latency
                measurements, and synthesized register-transfer logic. Scroll downward to reveal the
                curtain plates and full technical specifications.
              </p>
              <div className="swiss-hero-rule" />
              <div className="swiss-folio-index">
                <span>FOLIO INDEX // PP. 01–06</span>
                <span>CURTAIN REVEAL ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Word-by-Word Kinetic Scroll Scrub Section */}
      <section className="swiss-manifesto-section">
        <div className="swiss-manifesto-container">
          <span className="swiss-eyebrow">FIRST PRINCIPLES // ARCHITECTURAL AXIOM</span>
          <div className="swiss-word-scrub-box" data-swiss-text>
            {manifestoParagraph}
          </div>
        </div>
      </section>

      {/* Section 01: Architectural Curtain Project Plates */}
      <section id="swiss-projects" className="swiss-section">
        <div className="swiss-section-header">
          <span className="swiss-eyebrow">SELECTED WORKS // CATALOG RAISONNÉ</span>
          <h2>
            ARCHITECTURAL <span>PLATES</span>
          </h2>
          <p>
            Six foundational systems documented with verified benchmarks, hardware syntheses, and
            architectural approaches.
          </p>
        </div>

        <div className="swiss-plates-stack">
          {PORTFOLIO_PROJECTS.map((proj, idx) => {
            const isSelected = activeProject.id === proj.id
            return (
              <article
                key={proj.id}
                className={`swiss-plate-card ${isSelected ? 'is-focused' : ''}`}
                onClick={() => setActiveProject(proj)}
              >
                <div className="swiss-plate-left">
                  <div className="swiss-plate-meta">
                    <span className="swiss-plate-num">PLATE 0{idx + 1}</span>
                    <span className="swiss-domain-badge">{proj.domainCode}</span>
                  </div>

                  <h3 className="swiss-plate-title">{proj.title}</h3>
                  <p className="swiss-plate-tagline">{proj.tagline}</p>

                  <div className="swiss-plate-specs">
                    {proj.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="swiss-spec-item">
                        <span className="swiss-spec-label">{m.label}</span>
                        <strong className="swiss-spec-val">{m.value}</strong>
                      </div>
                    ))}
                  </div>

                  <p className="swiss-plate-summary">{proj.summary}</p>

                  <div className="swiss-plate-actions">
                    <button
                      type="button"
                      className="swiss-curtain-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveProject(proj)
                        setDossierOpen(true)
                      }}
                    >
                      READ MONOGRAPH DOSSIER [P. 0{idx + 1}] →
                    </button>
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="swiss-code-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      SOURCE CODE ↗
                    </a>
                  </div>
                </div>

                <div className="swiss-plate-right" data-swiss-plate>
                  <div className="swiss-plate-diagram">
                    <div className="swiss-diag-header">
                      <span>FIGURE 0{idx + 1}.A</span>
                      <span>SYSTEM TOPOLOGY // {proj.domain}</span>
                    </div>
                    <div className="swiss-diag-content">
                      {/* Architectural Vector Schematic */}
                      <ProjectSchematicVisualizer
                        id={proj.id as any}
                        accentColor="#dc2626"
                        secondaryColor="#18181b"
                        style={{ width: '100%', height: 180, borderRadius: 4, margin: '8px 0 14px 0' }}
                      />
                      <div className="swiss-diag-highlight">{proj.architectureHighlight}</div>
                      <div className="swiss-diag-tags">
                        {proj.tags.map((t, tIdx) => (
                          <span key={tIdx} className="swiss-diag-tag">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="swiss-diag-footer">
                      <span>SIROSIU ARCHIVAL SYSTEM // REPRODUCIBLE</span>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Section 02: Interactive Typography & Proportion Lab */}
      <section className="swiss-section">
        <div className="swiss-lab-card">
          <div className="swiss-lab-header">
            <span className="swiss-eyebrow">TYPOGRAPHIC SPECIFICATION BENCH</span>
            <h2>
              EDITORIAL SCALE &amp; <span>KERNING PROPORTION</span>
            </h2>
            <p>
              Interactively calibrate the display headline typographic scale and optical tracking for
              print and digital legibility.
            </p>
          </div>

          <div className="swiss-lab-controls">
            <div className="swiss-controls-row">
              <label>
                <span>DISPLAY FONT SCALE: {fontSizeScale}%</span>
                <input
                  type="range"
                  min="75"
                  max="135"
                  value={fontSizeScale}
                  onChange={(e) => setFontSizeScale(Number(e.target.value))}
                />
              </label>

              <label>
                <span>OPTICAL KERNING: {editorialKerning}em</span>
                <input
                  type="range"
                  min="-5"
                  max="15"
                  value={editorialKerning}
                  onChange={(e) => setEditorialKerning(Number(e.target.value))}
                />
              </label>
            </div>

            <div className="swiss-lab-spec-table">
              <div className="swiss-spec-row">
                <span>DISPLAY TYPEFACE</span>
                <strong>NEWSREADER 72PT SERIF DISPLAY (ITALIC &amp; REGULAR)</strong>
              </div>
              <div className="swiss-spec-row">
                <span>BODY COPY TYPEFACE</span>
                <strong>INTER SANS (300 LIGHT / 400 REGULAR / 600 SEMIBOLD)</strong>
              </div>
              <div className="swiss-spec-row">
                <span>TECHNICAL LABELS</span>
                <strong>JETBRAINS MONO 500 MEDIUM (ALL CAPS)</strong>
              </div>
              <div className="swiss-spec-row">
                <span>PAGE TONALITY</span>
                <strong>CHALK COTTON RAG (#F6F5F0) &amp; CARBON BLACK (#111113)</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 03: Engineering Capabilities Grid */}
      <section className="swiss-section">
        <div className="swiss-section-header">
          <span className="swiss-eyebrow">PRACTICE AREAS // CURRICULUM</span>
          <h2>
            TECHNICAL <span>DISCIPLINES</span>
          </h2>
        </div>

        <div className="swiss-capabilities-grid">
          {ENGINEERING_CAPABILITIES.map((cap, cIdx) => (
            <div key={cIdx} className="swiss-cap-item">
              <span className="swiss-cap-index">FOLIO.0{cIdx + 1}</span>
              <h4>{cap.area}</h4>
              <p>{cap.description}</p>
              <div className="swiss-cap-tags">
                {cap.skills.map((s, sIdx) => (
                  <span key={sIdx} className="swiss-cap-tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 04: Colophon & Editorial Footer */}
      <footer className="swiss-footer">
        <div className="swiss-footer-container">
          <div className="swiss-footer-left">
            <span className="swiss-colophon-eyebrow">COLOPHON &amp; CORRESPONDENCE</span>
            <h2>INQUIRE WITH THE STUDIO</h2>
            <p>
              Ankush Malothia welcomes technical correspondence regarding hardware architecture,
              autonomous agents, and creative technology commissions.
            </p>
            <div className="swiss-contact-links">
              <a href={`mailto:${SITE_METADATA.author.email}`} className="swiss-btn-ink">
                WRITE: {SITE_METADATA.author.email}
              </a>
              <a
                href={SITE_METADATA.author.github}
                target="_blank"
                rel="noreferrer"
                className="swiss-btn-ghost"
              >
                GITHUB REPOSITORY ↗
              </a>
            </div>
          </div>

          <div className="swiss-footer-right">
            <div className="swiss-colophon-stamp">
              <strong>SIROSIU EDITORIAL MONOGRAPH</strong>
              <span>TYPESET IN NEWSREADER &amp; JETBRAINS MONO</span>
              <span>PROTOTYPE 4 // CONCEPT 04 (SWISS CURTAIN)</span>
              <span>ZERO RUNTIME WARNINGS // 60FPS CERTIFIED</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Deep Dossier Modal */}
      {dossierOpen && activeProject && (
        <div className="swiss-modal-backdrop" onClick={() => setDossierOpen(false)}>
          <div className="swiss-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="swiss-modal-header">
              <div>
                <span className="swiss-eyebrow">
                  DOCUMENTED ARCHIVE // {activeProject.domainCode}
                </span>
                <h3>{activeProject.title}</h3>
              </div>
              <button
                type="button"
                className="swiss-modal-close"
                onClick={() => setDossierOpen(false)}
                aria-label="Close Dossier Modal"
              >
                ✕
              </button>
            </div>

            <div className="swiss-modal-body">
              {/* High-Resolution Architectural Vector Schematic */}
              <ProjectSchematicVisualizer
                id={activeProject.id as any}
                accentColor="#dc2626"
                secondaryColor="#18181b"
                style={{ width: '100%', height: 220, borderRadius: 4, marginBottom: 20 }}
              />

              <div className="swiss-modal-section">
                <h4>PROBLEM CONSTRAINTS &amp; ARCHITECTURAL BOTTLENECK</h4>
                <p>{activeProject.problemStatement || activeProject.summary}</p>
              </div>

              <div className="swiss-modal-section">
                <h4>FIRST-PRINCIPLES APPROACH</h4>
                <p>{activeProject.technicalApproach || activeProject.architectureHighlight}</p>
              </div>

              <div className="swiss-modal-section">
                <h4>VERIFIED PHYSICAL BENCHMARKS</h4>
                <div className="swiss-modal-metrics">
                  {activeProject.metrics.map((m, idx) => (
                    <div key={idx} className="swiss-modal-stat">
                      <span>{m.label}</span>
                      <strong>{m.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="swiss-modal-footer">
              <span className="swiss-modal-hint">Press [ESC] to return to monograph</span>
              <a
                href={activeProject.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="swiss-modal-link"
              >
                VIEW SOURCE ON GITHUB ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Concept04Swiss
