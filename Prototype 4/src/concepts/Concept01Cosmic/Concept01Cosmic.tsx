import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  PORTFOLIO_PROJECTS,
  LAB_EXPERIMENTS,
  ENGINEERING_CAPABILITIES,
  SITE_METADATA,
  ProjectItem,
} from '../../data/portfolioData'
import './CosmicStyles.css'

export const Concept01Cosmic: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [activeProject, setActiveProject] = useState<ProjectItem>(PORTFOLIO_PROJECTS[0])
  const [dossierOpen, setDossierOpen] = useState(false)
  const [schwarzschildRadius, setSchwarzschildRadius] = useState<number>(45)
  const [warpFactor, setWarpFactor] = useState<number>(1.0)
  const [audioActive, setAudioActive] = useState(false)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const droneGainRef = useRef<GainNode | null>(null)
  const droneOscRef = useRef<OscillatorNode | null>(null)

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

  // Audio drone initialization
  const toggleAudio = useCallback(() => {
    if (!audioActive) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const ctx = new AudioCtx()
        audioCtxRef.current = ctx

        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const filter = ctx.createBiquadFilter()

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(43.65, ctx.currentTime) // F0 fundamental deep cosmic drone

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(140, ctx.currentTime)
        filter.Q.setValueAtTime(3.5, ctx.currentTime)

        gain.gain.setValueAtTime(0.001, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 1.2)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)
        osc.start()

        droneOscRef.current = osc
        droneGainRef.current = gain
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

  // Modulate drone frequency by scroll progress
  useEffect(() => {
    if (audioActive && droneOscRef.current && audioCtxRef.current) {
      const targetFreq = 43.65 + scrollProgress * 32.0 + Math.min(20, scrollVelocity * 0.5)
      droneOscRef.current.frequency.setTargetAtTime(targetFreq, audioCtxRef.current.currentTime, 0.1)
    }
  }, [scrollProgress, scrollVelocity, audioActive])

  // 60FPS Celestial Starfield & Gravitational Lens Canvas
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

    // Star cluster definition
    interface Star {
      x: number
      y: number
      z: number
      size: number
      baseColor: string
      spectralType: 'O' | 'B' | 'A' | 'G' | 'M'
    }

    const starCount = 950
    const stars: Star[] = []
    const spectralColors = {
      O: '#93c5fd',
      B: '#bfdbfe',
      A: '#f8fafc',
      G: '#fef08a',
      M: '#f87171',
    }

    for (let i = 0; i < starCount; i++) {
      const types: ('O' | 'B' | 'A' | 'G' | 'M')[] = ['O', 'B', 'A', 'G', 'M']
      const spec = types[Math.floor(Math.random() * types.length)]
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * 1000 + 1,
        size: Math.random() * 1.5 + 0.4,
        baseColor: spectralColors[spec],
        spectralType: spec,
      })
    }

    let angle = 0

    const render = () => {
      angle += 0.003 + scrollVelocity * 0.0008

      // Deep void clear with cosmic accretion persistence
      ctx.fillStyle = 'rgba(3, 3, 7, 0.25)'
      ctx.fillRect(0, 0, width, height)

      const centerX = width * 0.5
      const centerY = height * (0.42 + scrollProgress * 0.16)
      const currentRadius = schwarzschildRadius * (1 + scrollVelocity * 0.02)

      // 1. Render Gravitational Accretion Disk (Background Half)
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(angle * 0.6)

      const gradDiskBack = ctx.createRadialGradient(0, 0, currentRadius * 0.8, 0, 0, currentRadius * 3.4)
      gradDiskBack.addColorStop(0, 'rgba(0, 0, 0, 0.95)')
      gradDiskBack.addColorStop(0.3, 'rgba(245, 158, 11, 0.45)')
      gradDiskBack.addColorStop(0.65, 'rgba(180, 83, 9, 0.18)')
      gradDiskBack.addColorStop(1, 'rgba(3, 3, 7, 0)')

      ctx.fillStyle = gradDiskBack
      ctx.beginPath()
      ctx.ellipse(0, 0, currentRadius * 3.4, currentRadius * 1.15, 0.22, Math.PI, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // 2. Render Starfield with Relativistic Light Deflection
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]

        // Warp star depth by scroll speed
        star.z -= 0.6 + scrollVelocity * 0.15
        if (star.z <= 1) {
          star.z = 1000
          star.x = (Math.random() - 0.5) * width * 2
          star.y = (Math.random() - 0.5) * height * 2
        }

        const k = 400 / star.z
        let px = star.x * k + centerX
        let py = star.y * k + centerY

        // Einstein Gravitational Lensing Deflection Vector
        const dx = px - centerX
        const dy = py - centerY
        const distSq = dx * dx + dy * dy
        const dist = Math.sqrt(distSq)

        if (dist > 1.0) {
          // Relativistic bending angle theta ~ 4GM / (c^2 * r)
          const deflection = (currentRadius * currentRadius * 4.2) / (distSq + 1200)
          px += (dx / dist) * deflection
          py += (dy / dist) * deflection
        }

        // Draw star if within viewport bounds
        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const depthAlpha = Math.min(1, (1000 - star.z) / 750)
          const starRadius = Math.max(0.6, star.size * k * 0.45)

          ctx.fillStyle = star.baseColor
          ctx.globalAlpha = depthAlpha * (0.6 + Math.sin(angle * 3 + i) * 0.3)
          ctx.beginPath()
          ctx.arc(px, py, starRadius, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1.0

      // 3. Render Event Horizon Shadow (Black Hole Singularity)
      ctx.save()
      ctx.translate(centerX, centerY)

      // Event horizon core shadow
      const horizonGrad = ctx.createRadialGradient(0, 0, currentRadius * 0.2, 0, 0, currentRadius)
      horizonGrad.addColorStop(0, '#000000')
      horizonGrad.addColorStop(0.85, '#010103')
      horizonGrad.addColorStop(1, 'rgba(245, 158, 11, 0.4)')

      ctx.fillStyle = horizonGrad
      ctx.beginPath()
      ctx.arc(0, 0, currentRadius, 0, Math.PI * 2)
      ctx.fill()

      // Photon Sphere Ring (Einstein Ring Glow)
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)'
      ctx.lineWidth = 1.5 + scrollVelocity * 0.1
      ctx.shadowColor = '#f59e0b'
      ctx.shadowBlur = 18 + scrollVelocity * 2
      ctx.beginPath()
      ctx.arc(0, 0, currentRadius * 1.08, 0, Math.PI * 2)
      ctx.stroke()
      ctx.shadowBlur = 0

      // 4. Accretion Disk (Foreground Half)
      ctx.rotate(angle * 0.6)
      const gradDiskFront = ctx.createRadialGradient(0, 0, currentRadius * 0.8, 0, 0, currentRadius * 3.4)
      gradDiskFront.addColorStop(0, 'rgba(0, 0, 0, 0.95)')
      gradDiskFront.addColorStop(0.35, 'rgba(251, 191, 36, 0.55)')
      gradDiskFront.addColorStop(0.7, 'rgba(217, 119, 6, 0.22)')
      gradDiskFront.addColorStop(1, 'rgba(3, 3, 7, 0)')

      ctx.fillStyle = gradDiskFront
      ctx.beginPath()
      ctx.ellipse(0, 0, currentRadius * 3.4, currentRadius * 1.15, 0.22, 0, Math.PI)
      ctx.fill()

      ctx.restore()

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [schwarzschildRadius, scrollProgress, scrollVelocity])

  // Calculated celestial scrub coordinates
  const raHours = Math.floor(18 + scrollProgress * 5) % 24
  const raMins = Math.floor((scrollProgress * 60) % 60)
  const raSecs = Math.floor((scrollProgress * 3600) % 60)
  const decDeg = ( -23.4 - scrollProgress * 42.1 ).toFixed(2)
  const redshiftZ = (0.0042 + scrollProgress * 0.082).toFixed(4)
  const lightDistLy = (4.2 + scrollProgress * 1280).toFixed(1)

  return (
    <div className="cosmic-root">
      {/* 60FPS Interactive Celestial Background Canvas */}
      <canvas ref={canvasRef} className="cosmic-canvas" aria-hidden="true" />

      {/* Floating Celestial Telemetry HUD (Fixed Header) */}
      <div className="cosmic-hud-fixed">
        <div className="cosmic-hud-cell">
          <span className="cosmic-hud-label">COSMIC EPOCH</span>
          <strong className="cosmic-mono-gold">J2000.0 // DEEP VOID</strong>
        </div>
        <div className="cosmic-hud-cell">
          <span className="cosmic-hud-label">CELESTIAL RA / DEC</span>
          <strong>
            {raHours}h {raMins}m {raSecs}s / {decDeg}°
          </strong>
        </div>
        <div className="cosmic-hud-cell">
          <span className="cosmic-hud-label">RELATIVISTIC REDSHIFT</span>
          <strong className="cosmic-mono-blue">z = {redshiftZ}</strong>
        </div>
        <div className="cosmic-hud-cell">
          <span className="cosmic-hud-label">PROPER DISTANCE</span>
          <strong>{lightDistLy} LY</strong>
        </div>
        <div className="cosmic-hud-cell cosmic-hud-action">
          <button
            type="button"
            className={`cosmic-audio-btn ${audioActive ? 'is-active' : ''}`}
            onClick={toggleAudio}
            aria-label="Toggle Cosmic Drone Sound"
          >
            <span>{audioActive ? 'DRONE: ACTIVE [43Hz]' : 'DRONE: MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Hero Section: Gravitational Horizon */}
      <header className="cosmic-hero-section">
        <div className="cosmic-hero-container">
          <div className="cosmic-hero-badge">
            <span className="cosmic-pulse-dot" />
            <span>01 // GRAVITATIONAL PARALLAX ARCHITECTURE</span>
          </div>

          <h1
            className="cosmic-hero-title"
            style={{
              letterSpacing: `${Math.max(0.04, 0.22 - scrollProgress * 0.18)}em`,
              opacity: Math.max(0.2, 1 - scrollProgress * 1.8),
              transform: `translateY(${scrollY * 0.18}px)`,
            }}
          >
            BEYOND THE <span className="cosmic-text-gradient">EVENT HORIZON</span>.
          </h1>

          <p
            className="cosmic-hero-lead"
            style={{
              opacity: Math.max(0.15, 1 - scrollProgress * 2.2),
              transform: `translateY(${scrollY * 0.12}px)`,
            }}
          >
            SIROSIU is Ankush Malothia’s creative engineering studio operating at the bleeding-edge
            intersection of hardware acceleration, relativistic wave dynamics, on-device intelligence,
            and high-craft digital products. Scroll to explore orbital mission dossiers.
          </p>

          <div className="cosmic-scroll-indicator">
            <span className="cosmic-scroll-line" />
            <span className="cosmic-scroll-text">SCROLL TO COLLAPSE HORIZON ↓</span>
          </div>
        </div>
      </header>

      {/* Section 01: Pinned Orbital Mission Dossiers (Scroll-Driven Reveal) */}
      <section id="cosmic-missions" className="cosmic-section">
        <div className="cosmic-section-header">
          <span className="cosmic-eyebrow">MISSION ARCHIVES // FLIGHT CATALOG</span>
          <h2>
            ORBITAL <span>PROJECT DOSSIERS</span>
          </h2>
          <p>
            Each mission represents a verified engineering artifact engineered from first physical
            principles. As you scroll, orbital trajectory coordinates lock into focus.
          </p>
        </div>

        <div className="cosmic-missions-grid">
          {PORTFOLIO_PROJECTS.map((proj, idx) => {
            const isSelected = activeProject.id === proj.id
            return (
              <article
                key={proj.id}
                className={`cosmic-mission-card ${isSelected ? 'is-focused' : ''}`}
                onClick={() => {
                  setActiveProject(proj)
                }}
              >
                <div className="cosmic-card-orbit-header">
                  <span className="cosmic-orbit-idx">TRAJECTORY 0{idx + 1}</span>
                  <span className="cosmic-domain-pill">{proj.domainCode}</span>
                </div>

                <h3 className="cosmic-mission-title">{proj.title}</h3>
                <p className="cosmic-mission-tagline">{proj.tagline}</p>

                <div className="cosmic-metric-row">
                  {proj.metrics.slice(0, 2).map((m, mIdx) => (
                    <div key={mIdx} className="cosmic-metric-stat">
                      <span className="cosmic-metric-label">{m.label}</span>
                      <strong className="cosmic-metric-value">{m.value}</strong>
                    </div>
                  ))}
                </div>

                <p className="cosmic-mission-summary">{proj.summary}</p>

                <div className="cosmic-card-footer">
                  <div className="cosmic-tag-list">
                    {proj.tags.slice(0, 3).map((t, tIdx) => (
                      <span key={tIdx} className="cosmic-tag-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="cosmic-inspect-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveProject(proj)
                      setDossierOpen(true)
                    }}
                  >
                    MISSION SPECS ↗
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Section 02: Interactive Gravitational Lens Lab */}
      <section className="cosmic-section cosmic-lab-section">
        <div className="cosmic-glass-slab">
          <div className="cosmic-lab-header">
            <span className="cosmic-eyebrow">INTERACTIVE RELATIVITY LAB</span>
            <h2>
              SCHWARZSCHILD <span>GRAVITATIONAL LENS</span>
            </h2>
            <p>
              Directly manipulate the event horizon radius ($R_s$) and observe real-time light ray
              deflection of background star clusters via geodesic ray-bending.
            </p>
          </div>

          <div className="cosmic-lab-controls">
            <div className="cosmic-slider-group">
              <label>
                <span>EVENT HORIZON RADIUS ($R_s$): {schwarzschildRadius} px</span>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={schwarzschildRadius}
                  onChange={(e) => setSchwarzschildRadius(Number(e.target.value))}
                />
              </label>
            </div>

            <div className="cosmic-lab-metrics">
              <div>
                <span>EQUIVALENT MASS ($M_\odot$)</span>
                <strong>{(schwarzschildRadius * 4.2e6).toLocaleString()} M☉</strong>
              </div>
              <div>
                <span>PHOTON SPHERE RADIUS</span>
                <strong className="cosmic-mono-gold">{(schwarzschildRadius * 1.5).toFixed(1)} px</strong>
              </div>
              <div>
                <span>TIME DILATION ($\gamma$)</span>
                <strong className="cosmic-mono-blue">{(1 / Math.sqrt(1 - 0.72)).toFixed(2)}×</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 03: Engineering Capabilities Matrix */}
      <section className="cosmic-section">
        <div className="cosmic-section-header">
          <span className="cosmic-eyebrow">TECHNICAL MATRIX</span>
          <h2>
            CORE <span>ORBITAL CAPABILITIES</span>
          </h2>
        </div>

        <div className="cosmic-capabilities-grid">
          {ENGINEERING_CAPABILITIES.map((cap, cIdx) => (
            <div key={cIdx} className="cosmic-capability-card">
              <div className="cosmic-cap-num">SYS.0{cIdx + 1}</div>
              <h4>{cap.area}</h4>
              <p>{cap.description}</p>
              <div className="cosmic-cap-skills">
                {cap.skills.map((s, sIdx) => (
                  <span key={sIdx} className="cosmic-skill-pill">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 04: Transmission Uplink Footer */}
      <footer className="cosmic-footer">
        <div className="cosmic-footer-container">
          <div className="cosmic-footer-left">
            <span className="cosmic-eyebrow">INTERSTELLAR COMMUNICATIONS</span>
            <h2>TRANSMIT TO ORBIT</h2>
            <p>Direct mission uplink open for collaborative engineering, founders, and research.</p>
            <div className="cosmic-contact-links">
              <a href={`mailto:${SITE_METADATA.author.email}`} className="cosmic-btn-gold">
                INITIATE UPLINK: {SITE_METADATA.author.email}
              </a>
              <a
                href={SITE_METADATA.author.github}
                target="_blank"
                rel="noreferrer"
                className="cosmic-btn-outline"
              >
                GITHUB REPOSITORY ↗
              </a>
            </div>
          </div>
          <div className="cosmic-footer-right">
            <div className="cosmic-stamp">
              <span>SIROSIU // PROTOTYPE 4</span>
              <span>CONCEPT 01: COSMIC HORIZON</span>
              <span>COORDINATES: 31.3260° N, 75.5762° E</span>
              <span>LOCKED TO 60FPS CHROMIUM CDP</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Full-Screen Deep Mission Dossier Modal */}
      {dossierOpen && activeProject && (
        <div className="cosmic-modal-backdrop" onClick={() => setDossierOpen(false)}>
          <div className="cosmic-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cosmic-modal-header">
              <div>
                <span className="cosmic-eyebrow">
                  MISSION SPECS // {activeProject.domainCode} // {activeProject.index}
                </span>
                <h3>{activeProject.title}</h3>
              </div>
              <button
                type="button"
                className="cosmic-modal-close"
                onClick={() => setDossierOpen(false)}
                aria-label="Close Dossier Modal"
              >
                ✕
              </button>
            </div>

            <div className="cosmic-modal-body">
              <div className="cosmic-modal-section">
                <h4>PHYSICAL PROBLEM STATEMENT</h4>
                <p>{activeProject.problemStatement || activeProject.summary}</p>
              </div>

              <div className="cosmic-modal-section">
                <h4>ARCHITECTURAL APPROACH</h4>
                <p>{activeProject.technicalApproach || activeProject.architectureHighlight}</p>
              </div>

              <div className="cosmic-modal-section">
                <h4>MEASURED HARDWARE &amp; INFERENCE BENCHMARKS</h4>
                <div className="cosmic-modal-metrics">
                  {activeProject.metrics.map((m, idx) => (
                    <div key={idx} className="cosmic-modal-stat">
                      <span>{m.label}</span>
                      <strong>{m.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="cosmic-modal-footer">
              <span className="cosmic-modal-hint">Press [ESC] to return to orbital view</span>
              <a
                href={activeProject.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="cosmic-modal-link"
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
export default Concept01Cosmic
