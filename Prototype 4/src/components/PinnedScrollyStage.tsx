import React, { useEffect, useRef, useState, useCallback } from 'react'
import { PORTFOLIO_PROJECTS, ProjectItem, CONCEPT_META, ConceptId, SITE_METADATA } from '../data/portfolioData'
import { ProjectSchematicVisualizer, ProjectSchematicId } from './ProjectSchematicVisualizer'
import './PinnedScrollyStage.css'

export interface PinnedScrollyStageProps {
  conceptId: ConceptId
  accentColor: string
  accentGlow: string
  secondaryColor: string
  renderCanvas: (container: HTMLDivElement) => (() => void) | void
  customHeroEyebrow?: string
  customHeroLead?: string
  customHeroMeta?: React.ReactNode
  customEpilogueLead?: string
}

interface BeatConfig {
  id: string
  type: 'hero' | 'project' | 'epilogue'
  start: number
  end: number
  project?: ProjectItem
  projectIndex?: number
}

function mapProjectToSchematicId(projectId: string): ProjectSchematicId {
  switch (projectId) {
    case 'ave-agent':
      return 'ave-agent'
    case 'fraudlens':
      return 'fraudlens'
    case 'antenna-simulation':
      return 'phased-array'
    case 'rv32i-core':
      return 'rv32i-core'
    case 'rf-patch-array':
      return 'microstrip-patch'
    case 'sirosiu-website':
      return 'portfolio-engine'
    default:
      return 'portfolio-engine'
  }
}

function getBeatState(p: number, start: number, end: number, isHero = false, isEpilogue = false) {
  if (p < start || p > end) {
    return {
      active: false,
      opacity: 0,
      transform: 'translate(-50%, calc(-50% + 28px)) scale(0.95)',
      filter: 'blur(8px)',
      pointerEvents: 'none' as const,
    }
  }

  const fadeInWindow = 0.035
  const fadeOutWindow = 0.035
  let factor = 1.0
  let offsetY = 0
  let blur = 0
  let scale = 1.0

  if (!isHero && p < start + fadeInWindow) {
    const t = Math.max(0, Math.min(1, (p - start) / fadeInWindow))
    factor = t
    offsetY = (1 - t) * 24
    blur = (1 - t) * 5
    scale = 0.96 + t * 0.04
  } else if (!isEpilogue && p > end - fadeOutWindow) {
    const t = Math.max(0, Math.min(1, (end - p) / fadeOutWindow))
    factor = t
    offsetY = -(1 - t) * 24
    blur = (1 - t) * 5
    scale = 1.0 + (1 - t) * 0.04
  }

  return {
    active: true,
    opacity: Math.max(0, Math.min(1, factor)),
    transform: `translate(-50%, calc(-50% + ${offsetY}px)) scale(${scale})`,
    filter: `blur(${blur}px)`,
    pointerEvents: (factor > 0.4 ? 'auto' : 'none') as 'auto' | 'none',
  }
}

export const PinnedScrollyStage: React.FC<PinnedScrollyStageProps> = ({
  conceptId,
  accentColor,
  accentGlow,
  secondaryColor,
  renderCanvas,
  customHeroEyebrow,
  customHeroLead,
  customHeroMeta,
  customEpilogueLead,
}) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)

  const meta = CONCEPT_META[conceptId]

  // Initialize and mount visual engine canvas
  useEffect(() => {
    const container = canvasContainerRef.current
    if (!container) return
    container.innerHTML = ''
    const cleanup = renderCanvas(container)
    return () => {
      if (typeof cleanup === 'function') {
        cleanup()
      }
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [renderCanvas, conceptId])

  // Track normalized scroll progress across the scrollable document at 60fps
  useEffect(() => {
    let rafId: number
    const calculateProgress = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0
      const totalScrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const normalized = Math.max(0, Math.min(1, scrollY / totalScrollable))
      setScrollProgress((prev) => (Math.abs(prev - normalized) > 0.0001 ? normalized : prev))
      rafId = requestAnimationFrame(calculateProgress)
    }

    rafId = requestAnimationFrame(calculateProgress)
    window.addEventListener('scroll', calculateProgress, { passive: true })
    window.addEventListener('resize', calculateProgress)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', calculateProgress)
      window.removeEventListener('resize', calculateProgress)
    }
  }, [])

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedProject])

  // Define the 8 seamless narrative beats with subtle crossfading
  const beats: BeatConfig[] = [
    {
      id: 'beat-hero',
      type: 'hero',
      start: 0.00,
      end: 0.12,
    },
    {
      id: 'beat-project-1',
      type: 'project',
      start: 0.11,
      end: 0.24,
      project: PORTFOLIO_PROJECTS[0],
      projectIndex: 1,
    },
    {
      id: 'beat-project-2',
      type: 'project',
      start: 0.23,
      end: 0.36,
      project: PORTFOLIO_PROJECTS[1],
      projectIndex: 2,
    },
    {
      id: 'beat-project-3',
      type: 'project',
      start: 0.35,
      end: 0.48,
      project: PORTFOLIO_PROJECTS[2],
      projectIndex: 3,
    },
    {
      id: 'beat-project-4',
      type: 'project',
      start: 0.47,
      end: 0.60,
      project: PORTFOLIO_PROJECTS[3],
      projectIndex: 4,
    },
    {
      id: 'beat-project-5',
      type: 'project',
      start: 0.59,
      end: 0.72,
      project: PORTFOLIO_PROJECTS[4],
      projectIndex: 5,
    },
    {
      id: 'beat-project-6',
      type: 'project',
      start: 0.71,
      end: 0.84,
      project: PORTFOLIO_PROJECTS[5],
      projectIndex: 6,
    },
    {
      id: 'beat-epilogue',
      type: 'epilogue',
      start: 0.83,
      end: 1.00,
    },
  ]

  // Quick jump helper for user convenience
  const scrollToBeat = useCallback((progress: number) => {
    const totalScrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const targetY = totalScrollable * progress
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  }, [])

  return (
    <div
      ref={trackRef}
      className="scrolly-track"
      style={
        {
          '--scrolly-accent': accentColor,
          '--scrolly-accent-glow': accentGlow,
          '--scrolly-secondary': secondaryColor,
        } as React.CSSProperties
      }
    >
      <div className="scrolly-viewport">
        {/* Full-bleed visual engine canvas */}
        <div ref={canvasContainerRef} className="scrolly-canvas-layer" />

        {/* Cinematic Vignette */}
        <div className="scrolly-vignette" />

        {/* Bottom scrub progress timeline */}
        <div className="scrolly-progress-bar-container" role="progressbar" aria-valuenow={Math.round(scrollProgress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="scrolly-progress-bar-fill"
            style={{ width: `${(scrollProgress * 100).toFixed(1)}%` }}
          />
        </div>

        {/* Narrative Overlay Stages (Only 1 active beat at a time) */}
        <div className="scrolly-content-container">
          {beats.map((beat) => {
            const isHero = beat.type === 'hero'
            const isEpilogue = beat.type === 'epilogue'
            const state = getBeatState(scrollProgress, beat.start, beat.end, isHero, isEpilogue)
            if (!state.active && state.opacity === 0) return null

            if (beat.type === 'hero') {
              return (
                <div
                  key={beat.id}
                  className="scrolly-beat-card"
                  style={{
                    opacity: state.opacity,
                    transform: state.transform,
                    filter: state.filter,
                    pointerEvents: state.pointerEvents,
                  }}
                >
                  <span className="scrolly-hero-eyebrow">
                    {customHeroEyebrow || `[ CONCEPT ${meta.number} // ${meta.name.toUpperCase()} ]`}
                  </span>
                  <h1 className="scrolly-hero-title">SIROSIU</h1>
                  <p className="scrolly-hero-lead">
                    {customHeroLead ||
                      'Autonomous AI Systems Architect & Creative Technologist crafting sub-millisecond compute engines, real-time WebGL, and mission-critical architectures.'}
                  </p>

                  <div className="scrolly-author-chip">
                    <img
                      src="/assets/images/sirosiu-portrait.webp"
                      alt="Sirosiu Portrait"
                      className="scrolly-author-avatar"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none'
                      }}
                    />
                    <div>
                      <div className="scrolly-author-name">Ankush Malothia (Sirosiu)</div>
                      <div className="scrolly-author-meta">New Delhi, India • Systems Architect</div>
                    </div>
                  </div>

                  {customHeroMeta}

                  <div className="scrolly-scroll-prompt">
                    <span>SCROLL TO EXPLORE ARCHITECTURE</span>
                    <span>↓</span>
                  </div>
                </div>
              )
            }

            if (beat.type === 'project' && beat.project) {
              const p = beat.project
              const idxStr = beat.projectIndex?.toString().padStart(2, '0') || '01'
              return (
                <div
                  key={beat.id}
                  className="scrolly-beat-card"
                  style={{
                    opacity: state.opacity,
                    transform: state.transform,
                    filter: state.filter,
                    pointerEvents: state.pointerEvents,
                  }}
                >
                  <article className="scrolly-project-glass">
                    <div className="scrolly-project-header">
                      <span className="scrolly-step-badge">
                        PROJECT {idxStr} / 06 // {p.status.toUpperCase()}
                      </span>
                      <span className="scrolly-domain-tag">{p.domain}</span>
                    </div>

                    <h2 className="scrolly-project-title">{p.title}</h2>
                    <p className="scrolly-project-tagline">{p.tagline}</p>

                    <div className="scrolly-metrics-row">
                      {p.metrics.slice(0, 3).map((m, mIdx) => (
                        <div key={mIdx} className="scrolly-metric-card">
                          <span className="scrolly-metric-label">{m.label.toUpperCase()}</span>
                          <span className="scrolly-metric-value">{m.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="scrolly-project-footer">
                      <div className="scrolly-tag-pills">
                        {p.tags.slice(0, 4).map((tag, tIdx) => (
                          <span key={tIdx} className="scrolly-tag-pill">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <button
                          type="button"
                          className="scrolly-open-btn"
                          onClick={() => setSelectedProject(p)}
                        >
                          EXPLORE SCHEMATIC [DOSSIER] →
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              )
            }

            if (beat.type === 'epilogue') {
              return (
                <div
                  key={beat.id}
                  className="scrolly-beat-card"
                  style={{
                    opacity: state.opacity,
                    transform: state.transform,
                    filter: state.filter,
                    pointerEvents: state.pointerEvents,
                  }}
                >
                  <div className="scrolly-epilogue-glass">
                    <span className="scrolly-hero-eyebrow">
                      [ TRANSMISSION UPLINK // ARCHIVE SYNCHRONIZED ]
                    </span>
                    <h2 className="scrolly-epilogue-title">INITIATE CONTACT</h2>
                    <p className="scrolly-epilogue-lead">
                      {customEpilogueLead ||
                        'Open for high-impact autonomous AI architecture, mission-critical systems engineering, and creative computing advisory.'}
                    </p>

                    <div className="scrolly-uplink-links">
                      <a
                        href={`mailto:${SITE_METADATA.author.email}`}
                        className="scrolly-btn-primary"
                      >
                        EMAIL: {SITE_METADATA.author.email}
                      </a>
                      <a
                        href={SITE_METADATA.author.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="scrolly-btn-outline"
                      >
                        GITHUB ARCHIVE ↗
                      </a>
                      <a
                        href={SITE_METADATA.author.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="scrolly-btn-outline"
                      >
                        LINKEDIN ↗
                      </a>
                    </div>

                    <div className="scrolly-epilogue-meta">
                      <span>RESPONSE: &lt; 24H</span>
                      <span>ENCRYPTION: TLS 1.3</span>
                      <span>PARADIGM: ZERO LATENCY</span>
                    </div>
                  </div>
                </div>
              )
            }

            return null
          })}
        </div>
      </div>

      {/* Interactive Project Dossier Modal */}
      {selectedProject && (
        <div
          className="scrolly-modal-backdrop"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="scrolly-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="scrolly-modal-header">
              <div>
                <span className="scrolly-step-badge">
                  SYSTEM DOSSIER // {selectedProject.domain}
                </span>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.8rem', color: '#f8fafc', marginTop: '0.4rem' }}>
                  {selectedProject.title}
                </h3>
              </div>
              <button
                type="button"
                className="scrolly-modal-close"
                onClick={() => setSelectedProject(null)}
                aria-label="Close Dossier"
              >
                ✕
              </button>
            </div>

            {/* Embedded Live Interactive Schematic Visualizer */}
            <div style={{ marginBottom: '1.8rem' }}>
              <ProjectSchematicVisualizer
                id={mapProjectToSchematicId(selectedProject.id)}
                accentColor={accentColor}
                secondaryColor={secondaryColor}
              />
            </div>

            <div className="scrolly-modal-section">
              <h4>EXECUTIVE ARCHITECTURE HIGHLIGHT</h4>
              <p>{selectedProject.architectureHighlight}</p>
            </div>

            <div className="scrolly-modal-section">
              <h4>SYSTEM SUMMARY</h4>
              <p>{selectedProject.summary}</p>
            </div>

            {selectedProject.technicalApproach && (
              <div className="scrolly-modal-section">
                <h4>TECHNICAL APPROACH</h4>
                <p>{selectedProject.technicalApproach}</p>
              </div>
            )}

            <div className="scrolly-metrics-row">
              {selectedProject.metrics.map((m, idx) => (
                <div key={idx} className="scrolly-metric-card">
                  <span className="scrolly-metric-label">{m.label.toUpperCase()}</span>
                  <span className="scrolly-metric-value">{m.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <a
                href={selectedProject.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="scrolly-btn-primary"
              >
                SOURCE CODE REPOSITORY ↗
              </a>
              {selectedProject.demoUrl && (
                <a
                  href={selectedProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="scrolly-btn-outline"
                >
                  LIVE DEMO ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default PinnedScrollyStage
