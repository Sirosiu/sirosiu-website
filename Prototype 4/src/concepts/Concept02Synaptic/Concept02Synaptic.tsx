import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  PORTFOLIO_PROJECTS,
  ENGINEERING_CAPABILITIES,
  SITE_METADATA,
  ProjectItem,
} from '../../data/portfolioData'
import { SynapticArborEngine } from './SynapticArborEngine'
import { ProjectSchematicVisualizer } from '../../components/ProjectSchematicVisualizer'
import './SynapticStyles.css'

export const Concept02Synaptic: React.FC = () => {
  const arborRef = useRef<HTMLDivElement | null>(null)
  const engineRef = useRef<SynapticArborEngine | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [activeProject, setActiveProject] = useState<ProjectItem>(PORTFOLIO_PROJECTS[0])
  const [dossierOpen, setDossierOpen] = useState(false)
  const [neuroAgonistGain, setNeuroAgonistGain] = useState<number>(65)
  const [activeBand, setActiveBand] = useState<'DELTA' | 'THETA' | 'ALPHA' | 'BETA' | 'GAMMA'>('ALPHA')
  const [audioActive, setAudioActive] = useState(false)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const binauralLeftRef = useRef<OscillatorNode | null>(null)
  const binauralRightRef = useRef<OscillatorNode | null>(null)

  // Mount 60fps Dendritic Arborization Engine with Action Potential Propagation
  useEffect(() => {
    if (!arborRef.current) return
    const engine = new SynapticArborEngine(arborRef.current)
    engineRef.current = engine

    return () => {
      engine.dispose()
      engineRef.current = null
    }
  }, [])

  // Track scroll position & calculate EEG brainwave band
  useEffect(() => {
    let lastY = window.scrollY
    let lastTime = performance.now()
    let frameId: number

    const handleScroll = () => {
      const currentY = window.scrollY
      const currentTime = performance.now()
      const dt = Math.max(1, currentTime - lastTime)
      const dy = currentY - lastY
      const v = Math.abs(dy / dt) * 100

      setScrollY(currentY)
      setScrollVelocity((prev) => prev * 0.8 + v * 0.2)

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const prog = Math.min(1, Math.max(0, currentY / maxScroll))
      setScrollProgress(prog)

      // Frequency Band shift based on scroll progress
      if (prog < 0.2) setActiveBand('DELTA')
      else if (prog < 0.4) setActiveBand('THETA')
      else if (prog < 0.6) setActiveBand('ALPHA')
      else if (prog < 0.85) setActiveBand('BETA')
      else setActiveBand('GAMMA')

      lastY = currentY
      lastTime = currentTime
    }

    const decayVelocity = () => {
      setScrollVelocity((v) => (v > 0.05 ? v * 0.92 : 0))
      frameId = requestAnimationFrame(decayVelocity)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    frameId = requestAnimationFrame(decayVelocity)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(frameId)
    }
  }, [])

  // Binaural Brainwave Audio Synthesizer
  const toggleAudio = useCallback(() => {
    if (!audioActive) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const ctx = new AudioCtx()
        audioCtxRef.current = ctx

        // Left ear 216Hz, right ear 216 + target offset Hz for binaural beat
        const baseFreq = 216.0
        const oscL = ctx.createOscillator()
        const oscR = ctx.createOscillator()
        const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null
        const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null
        const masterGain = ctx.createGain()

        oscL.type = 'sine'
        oscR.type = 'sine'
        oscL.frequency.setValueAtTime(baseFreq, ctx.currentTime)
        oscR.frequency.setValueAtTime(baseFreq + 10.0, ctx.currentTime) // 10Hz Alpha beat

        masterGain.gain.setValueAtTime(0.001, ctx.currentTime)
        masterGain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 1.0)

        if (pannerL && pannerR) {
          pannerL.pan.value = -1.0
          pannerR.pan.value = 1.0
          oscL.connect(pannerL)
          oscR.connect(pannerR)
          pannerL.connect(masterGain)
          pannerR.connect(masterGain)
        } else {
          oscL.connect(masterGain)
          oscR.connect(masterGain)
        }

        masterGain.connect(ctx.destination)
        oscL.start()
        oscR.start()

        binauralLeftRef.current = oscL
        binauralRightRef.current = oscR
        setAudioActive(true)
      } catch (err) {
        console.warn('Audio initiation failed:', err)
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
        audioCtxRef.current = null
      }
      setAudioActive(false)
    }
  }, [audioActive])

  // Modulate binaural beat by EEG band
  useEffect(() => {
    if (audioActive && binauralRightRef.current && audioCtxRef.current) {
      const beatOffsets = {
        DELTA: 2.5,
        THETA: 6.0,
        ALPHA: 10.0,
        BETA: 20.0,
        GAMMA: 40.0,
      }
      const targetOffset = beatOffsets[activeBand]
      binauralRightRef.current.frequency.setTargetAtTime(216.0 + targetOffset, audioCtxRef.current.currentTime, 0.2)
    }
  }, [activeBand, audioActive])

  return (
    <div className="synaptic-root">
      {/* 60FPS Interactive Dendritic Arborization Background Canvas */}
      <div ref={arborRef} className="synaptic-canvas" aria-hidden="true" />

      {/* Fixed Neuro-Telemetry & EEG Resonance Bar */}
      <div className="synaptic-hud-fixed">
        <div className="synaptic-hud-cell">
          <span className="synaptic-hud-label">NEURAL STATE</span>
          <strong className="synaptic-mono-cyan">CORTICAL RESONANCE</strong>
        </div>
        <div className="synaptic-hud-cell">
          <span className="synaptic-hud-label">EEG FREQUENCY BAND</span>
          <strong className="synaptic-mono-violet">
            {activeBand} // {activeBand === 'DELTA' ? '0.5-4Hz' : activeBand === 'THETA' ? '4-8Hz' : activeBand === 'ALPHA' ? '8-13Hz' : activeBand === 'BETA' ? '13-30Hz' : '30-100Hz'}
          </strong>
        </div>
        <div className="synaptic-hud-cell">
          <span className="synaptic-hud-label">MEMBRANE POTENTIAL</span>
          <strong>{activeBand === 'GAMMA' ? '+30 mV (SPIKE)' : '-70 mV (POLARIZED)'}</strong>
        </div>
        <div className="synaptic-hud-cell">
          <span className="synaptic-hud-label">CONNECTOME NODES</span>
          <strong>52 SOMAS // 184 AXONS</strong>
        </div>
        <div className="synaptic-hud-cell synaptic-hud-action">
          <button
            type="button"
            className={`synaptic-audio-btn ${audioActive ? 'is-active' : ''}`}
            onClick={toggleAudio}
            aria-label="Toggle Binaural Beat Sound"
          >
            <span>{audioActive ? `BINAURAL: ${activeBand}` : 'BINAURAL: OFF'}</span>
          </button>
        </div>
      </div>

      {/* Hero Section: Neuro-Genesis */}
      <header className="synaptic-hero-section">
        <div className="synaptic-hero-container">
          <div className="synaptic-hero-badge">
            <span className="synaptic-pulse-dot" />
            <span>02 // SYNAPTIC NEURO-GENESIS ARCHITECTURE</span>
          </div>

          <h1
            className="synaptic-hero-title"
            style={{
              letterSpacing: `${Math.max(0.02, 0.16 - scrollProgress * 0.14)}em`,
              opacity: Math.max(0.2, 1 - scrollProgress * 1.9),
              transform: `translateY(${scrollY * 0.16}px)`,
            }}
          >
            THE ARCHITECTURE OF <span className="synaptic-text-gradient">CONSCIOUSNESS</span>.
          </h1>

          <p
            className="synaptic-hero-lead"
            style={{
              opacity: Math.max(0.15, 1 - scrollProgress * 2.3),
              transform: `translateY(${scrollY * 0.12}px)`,
            }}
          >
            SIROSIU explores the computational substrate of the human mind: neuromorphic processing,
            synaptic plasticity, real-time audio perception, and distributed cognitive intelligence.
            Scroll to traverse cortical layers and synaptic clusters.
          </p>

          <div
            className="synaptic-author-chip"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              margin: '18px 0 24px 0',
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(12px)',
              padding: '6px 18px',
              borderRadius: 999,
              border: '1px solid rgba(139, 92, 246, 0.35)',
            }}
          >
            <img
              src="/assets/images/sirosiu-portrait.webp"
              alt="Ankush Malothia (Sirosiu)"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid #8b5cf6',
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f8fafc' }}>
                Ankush Malothia (Sirosiu)
              </div>
              <div style={{ fontSize: '0.68rem', color: '#a78bfa', fontFamily: 'monospace' }}>
                Neuromorphic Systems &bull; GNN &bull; Quantized Edge Intelligence
              </div>
            </div>
          </div>

          <div className="synaptic-scroll-indicator">
            <span className="synaptic-scroll-line" />
            <span className="synaptic-scroll-text">SCROLL TO PROPAGATE ACTION POTENTIALS ↓</span>
          </div>
        </div>
      </header>

      {/* Section 01: Active Synaptic Clusters (Projects) */}
      <section id="synaptic-clusters" className="synaptic-section">
        <div className="synaptic-section-header">
          <span className="synaptic-eyebrow">CORTICAL MAPPING // SUBSTRATE ARTIFACTS</span>
          <h2>
            ACTIVE <span>SYNAPTIC CLUSTERS</span>
          </h2>
          <p>
            Each project is mapped as a functional cortical circuit, evaluated against physical latency
            and neural memory footprints.
          </p>
        </div>

        <div className="synaptic-clusters-grid">
          {PORTFOLIO_PROJECTS.map((proj, idx) => {
            const isSelected = activeProject.id === proj.id
            return (
              <article
                key={proj.id}
                className={`synaptic-cluster-card ${isSelected ? 'is-focused' : ''}`}
                onClick={() => setActiveProject(proj)}
              >
                <div className="synaptic-card-header">
                  <span className="synaptic-cluster-idx">CIRCUIT 0{idx + 1}</span>
                  <span className="synaptic-domain-pill">{proj.domainCode}</span>
                </div>

                <h3 className="synaptic-cluster-title">{proj.title}</h3>
                <p className="synaptic-cluster-tagline">{proj.tagline}</p>

                {/* Interactive Reactive Project Schematic */}
                <ProjectSchematicVisualizer
                  id={proj.id as any}
                  accentColor="#06b6d4"
                  secondaryColor="#8b5cf6"
                  style={{ width: '100%', height: 160, borderRadius: 8, margin: '14px 0' }}
                />

                <div className="synaptic-metric-row">
                  {proj.metrics.slice(0, 2).map((m, mIdx) => (
                    <div key={mIdx} className="synaptic-metric-stat">
                      <span className="synaptic-metric-label">{m.label}</span>
                      <strong className="synaptic-metric-value">{m.value}</strong>
                    </div>
                  ))}
                </div>

                <p className="synaptic-cluster-summary">{proj.summary}</p>

                <div className="synaptic-card-footer">
                  <div className="synaptic-tag-list">
                    {proj.tags.slice(0, 3).map((t, tIdx) => (
                      <span key={tIdx} className="synaptic-tag-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="synaptic-inspect-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveProject(proj)
                      setDossierOpen(true)
                    }}
                  >
                    SYNAPTIC SPEC ↗
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Section 02: Interactive Neuro-Plasticity Lab */}
      <section className="synaptic-section">
        <div className="synaptic-glass-slab">
          <div className="synaptic-lab-header">
            <span className="synaptic-eyebrow">INTERACTIVE NEUROCHEMISTRY BENCH</span>
            <h2>
              5-HT2A &amp; GLUTAMATE <span>PLASTICITY AGONIST</span>
            </h2>
            <p>
              Modulate neurotransmitter receptor affinity to observe simulated synaptic rewiring,
              increased axonal conduction velocity, and entoptic visual resonance.
            </p>
          </div>

          <div className="synaptic-lab-controls">
            <div className="synaptic-slider-group">
              <label>
                <span>5-HT2A RECEPTOR OCCUPANCY: {neuroAgonistGain}%</span>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={neuroAgonistGain}
                  onChange={(e) => setNeuroAgonistGain(Number(e.target.value))}
                />
              </label>
            </div>

            <div className="synaptic-lab-metrics">
              <div>
                <span>SYNAPTIC CONDUCTION VELOCITY</span>
                <strong className="synaptic-mono-cyan">{(1.2 + neuroAgonistGain * 0.04).toFixed(2)} m/s</strong>
              </div>
              <div>
                <span>LONG-TERM POTENTIATION (LTP)</span>
                <strong className="synaptic-mono-violet">
                  {neuroAgonistGain > 75 ? 'HYPER-PLASTIC (ACTIVE)' : 'HOMEOSTATIC BASELINE'}
                </strong>
              </div>
              <div>
                <span>ENTOPTIC COHERENCE</span>
                <strong>{(0.4 + neuroAgonistGain * 0.006).toFixed(3)}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 03: Cognitive Capabilities Matrix */}
      <section className="synaptic-section">
        <div className="synaptic-section-header">
          <span className="synaptic-eyebrow">COGNITIVE STACK</span>
          <h2>
            CORE <span>SYSTEMS DISCIPLINES</span>
          </h2>
        </div>

        <div className="synaptic-capabilities-grid">
          {ENGINEERING_CAPABILITIES.map((cap, cIdx) => (
            <div key={cIdx} className="synaptic-capability-card">
              <div className="synaptic-cap-num">SYN.0{cIdx + 1}</div>
              <h4>{cap.area}</h4>
              <p>{cap.description}</p>
              <div className="synaptic-cap-skills">
                {cap.skills.map((s, sIdx) => (
                  <span key={sIdx} className="synaptic-skill-pill">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 04: Neural Uplink Footer */}
      <footer className="synaptic-footer">
        <div className="synaptic-footer-container">
          <div className="synaptic-footer-left">
            <span className="synaptic-eyebrow">SYNAPTIC SYNCHRONIZATION</span>
            <h2>CONNECT WITH SIROSIU</h2>
            <p>Direct cognitive communication channel open for engineering, AI architecture, and creative code.</p>
            <div className="synaptic-contact-links">
              <a href={`mailto:${SITE_METADATA.author.email}`} className="synaptic-btn-cyan">
                INITIATE TRANSMISSION: {SITE_METADATA.author.email}
              </a>
              <a
                href={SITE_METADATA.author.github}
                target="_blank"
                rel="noreferrer"
                className="synaptic-btn-outline"
              >
                GITHUB REPOSITORY ↗
              </a>
            </div>
          </div>
          <div className="synaptic-footer-right">
            <div className="synaptic-stamp">
              <span>SIROSIU // PROTOTYPE 4</span>
              <span>CONCEPT 02: SYNAPTIC MIND</span>
              <span>SUBSTRATE: BIOLOGICAL &amp; SILICON COMPUTATION</span>
              <span>60FPS VERIFIED VIA CHROMIUM CDP</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Deep Dossier Modal */}
      {dossierOpen && activeProject && (
        <div className="synaptic-modal-backdrop" onClick={() => setDossierOpen(false)}>
          <div className="synaptic-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="synaptic-modal-header">
              <div>
                <span className="synaptic-eyebrow">
                  CIRCUIT DOSSIER // {activeProject.domainCode} // {activeProject.index}
                </span>
                <h3>{activeProject.title}</h3>
              </div>
              <button
                type="button"
                className="synaptic-modal-close"
                onClick={() => setDossierOpen(false)}
                aria-label="Close Dossier Modal"
              >
                ✕
              </button>
            </div>

            <div className="synaptic-modal-body">
              {/* High-Resolution Interactive Circuit / Physics Schematic */}
              <ProjectSchematicVisualizer
                id={activeProject.id as any}
                accentColor="#06b6d4"
                secondaryColor="#8b5cf6"
                style={{ width: '100%', height: 220, borderRadius: 8, marginBottom: 20 }}
              />

              <div className="synaptic-modal-section">
                <h4>PHYSIOLOGICAL PROBLEM STATEMENT</h4>
                <p>{activeProject.problemStatement || activeProject.summary}</p>
              </div>

              <div className="synaptic-modal-section">
                <h4>ARCHITECTURAL IMPLEMENTATION</h4>
                <p>{activeProject.technicalApproach || activeProject.architectureHighlight}</p>
              </div>

              <div className="synaptic-modal-section">
                <h4>VERIFIED BENCHMARKS &amp; TELEMETRY</h4>
                <div className="synaptic-modal-metrics">
                  {activeProject.metrics.map((m, idx) => (
                    <div key={idx} className="synaptic-modal-stat">
                      <span>{m.label}</span>
                      <strong>{m.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="synaptic-modal-footer">
              <span className="synaptic-modal-hint">Press [ESC] to return to synaptic connectome</span>
              <a
                href={activeProject.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="synaptic-modal-link"
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
export default Concept02Synaptic
