import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  PORTFOLIO_PROJECTS,
  ENGINEERING_CAPABILITIES,
  SITE_METADATA,
  ProjectItem,
} from '../../data/portfolioData'
import './LaserStyles.css'

export const Concept05Laser: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [activeProject, setActiveProject] = useState<ProjectItem>(PORTFOLIO_PROJECTS[0])
  const [dossierOpen, setDossierOpen] = useState(false)
  const [numericalAperture, setNumericalAperture] = useState<number>(0.33)
  const [wavelengthNm, setWavelengthNm] = useState<number>(13.5) // EUV 13.5nm
  const [audioActive, setAudioActive] = useState(false)

  const audioCtxRef = useRef<AudioContext | null>(null)

  // Track scroll position & velocity
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

  // High-frequency tactile laser click
  const triggerLaserClick = useCallback(
    (freq = 1420) => {
      if (!audioActive || !audioCtxRef.current) return
      try {
        const ctx = audioCtxRef.current
        const now = ctx.currentTime
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(freq, now)
        osc.frequency.exponentialRampToValueAtTime(freq * 0.2, now + 0.035)

        gain.gain.setValueAtTime(0.04, now)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.042)
      } catch (err) {
        console.warn('Audio click error:', err)
      }
    },
    [audioActive]
  )

  const toggleAudio = useCallback(() => {
    if (!audioActive) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const ctx = new AudioCtx()
        audioCtxRef.current = ctx
        setAudioActive(true)
      } catch (err) {
        console.warn('Audio start error:', err)
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
        audioCtxRef.current = null
      }
      setAudioActive(false)
    }
  }, [audioActive])

  // 60FPS Laser Circuit Vector Tracing Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    let beamPos = 0

    const render = () => {
      beamPos = (scrollProgress * 2.5 + performance.now() * 0.0004) % 1.0

      // Matte dark graphite clear with phosphor persistence
      ctx.fillStyle = 'rgba(11, 13, 16, 0.28)'
      ctx.fillRect(0, 0, width, height)

      // 1. Draw Orthographic CAD Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)'
      ctx.lineWidth = 1
      const gridSize = 40
      ctx.beginPath()
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.stroke()

      // 2. Draw Integrated Circuit Silicon Die Boundary
      const dieW = Math.min(width * 0.65, 680)
      const dieH = Math.min(height * 0.55, 460)
      const dieX = (width - dieW) * 0.5
      const dieY = height * 0.45 - dieH * 0.5 + (scrollProgress - 0.5) * 80

      ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)'
      ctx.lineWidth = 1.2
      ctx.strokeRect(dieX, dieY, dieW, dieH)

      // 3. Draw Laser Toolpath Traces (Vector Interconnects)
      const pathSegments = 16
      ctx.strokeStyle = '#22c55e'
      ctx.lineWidth = 1.6
      ctx.shadowColor = '#22c55e'
      ctx.shadowBlur = 10

      ctx.beginPath()
      for (let i = 0; i < pathSegments; i++) {
        const segX = dieX + (dieW / pathSegments) * i
        const segY = dieY + (i % 2 === 0 ? 40 : dieH - 40)
        if (i === 0) ctx.moveTo(segX, segY)
        else ctx.lineTo(segX, segY)
      }
      ctx.stroke()

      // 4. Draw Active Laser Beam Head
      const activeIdx = Math.floor(beamPos * pathSegments)
      const headX = dieX + (dieW / pathSegments) * activeIdx
      const headY = dieY + (activeIdx % 2 === 0 ? 40 : dieH - 40)

      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 18
      ctx.beginPath()
      ctx.arc(headX, headY, 3.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Crosshair Reticle on Laser Head
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(headX - 16, headY)
      ctx.lineTo(headX + 16, headY)
      ctx.moveTo(headX, headY - 16)
      ctx.lineTo(headX, headY + 16)
      ctx.stroke()

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [scrollProgress, scrollVelocity])

  // Rayleigh Resolution Limit: CD = k1 * (lambda / NA), where k1 ~ 0.35
  const rayleighCdNm = (0.35 * (wavelengthNm / numericalAperture)).toFixed(2)

  return (
    <div className="laser-root">
      {/* 60FPS Laser CAD Background Canvas */}
      <canvas ref={canvasRef} className="laser-canvas" aria-hidden="true" />

      {/* Fixed Silicon Telemetry HUD Header */}
      <div className="laser-hud-fixed">
        <div className="laser-hud-cell">
          <span className="laser-hud-label">LITHOGRAPHY SUBSTRATE</span>
          <strong className="laser-mono-green">300mm SILICON WAFER</strong>
        </div>
        <div className="laser-hud-cell">
          <span className="laser-hud-label">CRITICAL DIMENSION (CD)</span>
          <strong className="laser-mono-cyan">{rayleighCdNm} nm (RAYLEIGH LIMIT)</strong>
        </div>
        <div className="laser-hud-cell">
          <span className="laser-hud-label">PHOTON SOURCE</span>
          <strong>{wavelengthNm} nm (EUV EXCIMER)</strong>
        </div>
        <div className="laser-hud-cell">
          <span className="laser-hud-label">NUMERICAL APERTURE</span>
          <strong>NA = {numericalAperture.toFixed(2)}</strong>
        </div>
        <div className="laser-hud-cell laser-hud-action">
          <button
            type="button"
            className={`laser-audio-btn ${audioActive ? 'is-active' : ''}`}
            onClick={toggleAudio}
            aria-label="Toggle Laser Audio Clicks"
          >
            <span>{audioActive ? 'SONIC: ACTIVE' : 'SONIC: MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <header className="laser-hero-section">
        <div className="laser-hero-container">
          <div className="laser-hero-badge">
            <span className="laser-pulse-dot" />
            <span>05 // HIGH-PRECISION SILICON DRAFTING BENCH</span>
          </div>

          <h1
            className="laser-hero-title"
            style={{
              letterSpacing: `${Math.max(0.02, 0.16 - scrollProgress * 0.12)}em`,
              opacity: Math.max(0.2, 1 - scrollProgress * 1.8),
              transform: `translateY(${scrollY * 0.16}px)`,
            }}
          >
            ATOMIC PRECISION &amp; <span className="laser-text-gradient">SILICON LOGIC</span>.
          </h1>

          <p
            className="laser-hero-lead"
            style={{
              opacity: Math.max(0.15, 1 - scrollProgress * 2.2),
              transform: `translateY(${scrollY * 0.12}px)`,
            }}
          >
            Engineering physical silicon, millimeter-wave electromagnetic waveguides, and synthesizable
            digital architectures. Scroll to scrub photolithography laser toolpaths across verified
            hardware dies.
          </p>

          <div className="laser-scroll-indicator">
            <span className="laser-scroll-line" />
            <span className="laser-scroll-text">SCROLL TO ADVANCE LASER TOOLPATH ↓</span>
          </div>
        </div>
      </header>

      {/* Section 01: Silicon Die Project Blocks */}
      <section id="laser-projects" className="laser-section">
        <div className="laser-section-header">
          <span className="laser-eyebrow">WAFER MASKS // VERIFIED HARDWARE DIES</span>
          <h2>
            SYSTEM <span>DIE BLOCKS</span>
          </h2>
          <p>
            Six verified hardware systems, ranging from 185MHz RISC-V pipelined cores to 28GHz
            phased antenna arrays on Rogers substrates.
          </p>
        </div>

        <div className="laser-projects-grid">
          {PORTFOLIO_PROJECTS.map((proj, idx) => {
            const isSelected = activeProject.id === proj.id
            return (
              <article
                key={proj.id}
                className={`laser-project-card ${isSelected ? 'is-focused' : ''}`}
                onClick={() => {
                  triggerLaserClick(1100 + idx * 80)
                  setActiveProject(proj)
                }}
              >
                <div className="laser-card-header">
                  <span className="laser-die-num">DIE MASK // 0{idx + 1}</span>
                  <span className="laser-domain-pill">{proj.domainCode}</span>
                </div>

                <h3 className="laser-project-title">{proj.title}</h3>
                <p className="laser-project-tagline">{proj.tagline}</p>

                <div className="laser-metric-row">
                  {proj.metrics.slice(0, 2).map((m, mIdx) => (
                    <div key={mIdx} className="laser-metric-stat">
                      <span className="laser-metric-label">{m.label}</span>
                      <strong className="laser-metric-value">{m.value}</strong>
                    </div>
                  ))}
                </div>

                <p className="laser-project-summary">{proj.summary}</p>

                <div className="laser-card-footer">
                  <div className="laser-tag-list">
                    {proj.tags.slice(0, 3).map((t, tIdx) => (
                      <span key={tIdx} className="laser-tag-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="laser-inspect-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      triggerLaserClick(1650)
                      setActiveProject(proj)
                      setDossierOpen(true)
                    }}
                  >
                    DIE SPECIFICATION ↗
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Section 02: Interactive Photolithography Bench */}
      <section className="laser-section">
        <div className="laser-glass-slab">
          <div className="laser-lab-header">
            <span className="laser-eyebrow">INTERACTIVE PHOTOLITHOGRAPHY LAB</span>
            <h2>
              RAYLEIGH RESOLUTION &amp; <span>NUMERICAL APERTURE</span>
            </h2>
            <p>
              Directly calibrate excimer laser wavelength and lens numerical aperture to determine
              the minimum printable silicon transistor pitch ($CD$).
            </p>
          </div>

          <div className="laser-lab-controls">
            <div className="laser-sliders-row">
              <label>
                <span>NUMERICAL APERTURE (NA): {numericalAperture.toFixed(2)}</span>
                <input
                  type="range"
                  min="0.25"
                  max="0.55"
                  step="0.01"
                  value={numericalAperture}
                  onChange={(e) => {
                    triggerLaserClick(850)
                    setNumericalAperture(Number(e.target.value))
                  }}
                />
              </label>

              <label>
                <span>LASER WAVELENGTH ($\lambda$): {wavelengthNm} nm</span>
                <input
                  type="range"
                  min="13.5"
                  max="193"
                  step="0.5"
                  value={wavelengthNm}
                  onChange={(e) => {
                    triggerLaserClick(980)
                    setWavelengthNm(Number(e.target.value))
                  }}
                />
              </label>
            </div>

            <div className="laser-lab-metrics">
              <div>
                <span>MINIMUM FEATURE SIZE ($CD$)</span>
                <strong className="laser-mono-green">{rayleighCdNm} nm</strong>
              </div>
              <div>
                <span>PROCESS FACTOR ($k_1$)</span>
                <strong className="laser-mono-cyan">0.350 (IMMERSION LIMIT)</strong>
              </div>
              <div>
                <span>SUBSTRATE PLANARITY</span>
                <strong>&lt; 0.15 nm RMS</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 03: Silicon Capabilities Grid */}
      <section className="laser-section">
        <div className="laser-section-header">
          <span className="laser-eyebrow">CORE DISCIPLINES</span>
          <h2>
            HARDWARE &amp; <span>SYSTEMS DOMAINS</span>
          </h2>
        </div>

        <div className="laser-capabilities-grid">
          {ENGINEERING_CAPABILITIES.map((cap, cIdx) => (
            <div key={cIdx} className="laser-capability-card">
              <div className="laser-cap-num">RTL.0{cIdx + 1}</div>
              <h4>{cap.area}</h4>
              <p>{cap.description}</p>
              <div className="laser-cap-skills">
                {cap.skills.map((s, sIdx) => (
                  <span key={sIdx} className="laser-skill-pill">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 04: Hardware Uplink Footer */}
      <footer className="laser-footer">
        <div className="laser-footer-container">
          <div className="laser-footer-left">
            <span className="laser-eyebrow">HARDWARE COMMUNICATIONS</span>
            <h2>TRANSMIT TO SIROSIU</h2>
            <p>Direct channel open for chip architecture, RF antenna design, and machine learning systems.</p>
            <div className="laser-contact-links">
              <a href={`mailto:${SITE_METADATA.author.email}`} className="laser-btn-green">
                SEND TELEMETRY: {SITE_METADATA.author.email}
              </a>
              <a
                href={SITE_METADATA.author.github}
                target="_blank"
                rel="noreferrer"
                className="laser-btn-outline"
              >
                GITHUB REPOSITORY ↗
              </a>
            </div>
          </div>
          <div className="laser-footer-right">
            <div className="laser-stamp">
              <span>SIROSIU // PROTOTYPE 4</span>
              <span>CONCEPT 05: LASER BLUEPRINT</span>
              <span>STANDARDS: IEEE 802.11 &amp; RISC-V RV32I</span>
              <span>CERTIFIED 60FPS UNDER CHROMIUM CDP</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Deep Dossier Modal */}
      {dossierOpen && activeProject && (
        <div className="laser-modal-backdrop" onClick={() => setDossierOpen(false)}>
          <div className="laser-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="laser-modal-header">
              <div>
                <span className="laser-eyebrow">
                  DIE SPECIFICATION // {activeProject.domainCode}
                </span>
                <h3>{activeProject.title}</h3>
              </div>
              <button
                type="button"
                className="laser-modal-close"
                onClick={() => setDossierOpen(false)}
                aria-label="Close Dossier Modal"
              >
                ✕
              </button>
            </div>

            <div className="laser-modal-body">
              <div className="laser-modal-section">
                <h4>PHYSICAL PROBLEM STATEMENT</h4>
                <p>{activeProject.problemStatement || activeProject.summary}</p>
              </div>

              <div className="laser-modal-section">
                <h4>ARCHITECTURAL IMPLEMENTATION</h4>
                <p>{activeProject.technicalApproach || activeProject.architectureHighlight}</p>
              </div>

              <div className="laser-modal-section">
                <h4>VERIFIED HARDWARE BENCHMARKS</h4>
                <div className="laser-modal-metrics">
                  {activeProject.metrics.map((m, idx) => (
                    <div key={idx} className="laser-modal-stat">
                      <span>{m.label}</span>
                      <strong>{m.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="laser-modal-footer">
              <span className="laser-modal-hint">Press [ESC] to return to laser bench</span>
              <a
                href={activeProject.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="laser-modal-link"
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
export default Concept05Laser
