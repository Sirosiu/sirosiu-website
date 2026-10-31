import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  PORTFOLIO_PROJECTS,
  ENGINEERING_CAPABILITIES,
  SITE_METADATA,
  ProjectItem,
} from '../../data/portfolioData'
import './LusionStyles.css'

export const Concept03Lusion: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [activeProject, setActiveProject] = useState<ProjectItem>(PORTFOLIO_PROJECTS[0])
  const [dossierOpen, setDossierOpen] = useState(false)
  const [viscosity, setViscosity] = useState<number>(45)
  const [surfaceTension, setSurfaceTension] = useState<number>(75)
  const [fluidImpulse, setFluidImpulse] = useState<number>(0)
  const [audioActive, setAudioActive] = useState(false)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const fluidFilterRef = useRef<BiquadFilterNode | null>(null)

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

  // Tactile Water Droplet Audio Synthesizer
  const triggerWaterPlop = useCallback(
    (freq = 520) => {
      if (!audioActive || !audioCtxRef.current) return
      try {
        const ctx = audioCtxRef.current
        const now = ctx.currentTime
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now)
        osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + 0.06)

        gain.gain.setValueAtTime(0.06, now)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.095)
      } catch (err) {
        console.warn('Audio plop error:', err)
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

        // Gentle sub-bass water resonance
        const osc = ctx.createOscillator()
        const filter = ctx.createBiquadFilter()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(55, ctx.currentTime)

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(180, ctx.currentTime)
        filter.Q.setValueAtTime(4.0, ctx.currentTime)

        gain.gain.setValueAtTime(0.001, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 1.0)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)
        osc.start()

        fluidFilterRef.current = filter
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

  // Modulate fluid audio filter on scroll
  useEffect(() => {
    if (audioActive && fluidFilterRef.current && audioCtxRef.current) {
      const targetFreq = 180 + Math.min(600, scrollVelocity * 12)
      fluidFilterRef.current.frequency.setTargetAtTime(targetFreq, audioCtxRef.current.currentTime, 0.1)
    }
  }, [scrollVelocity, audioActive])

  // 60FPS Lusion-Style Fluid Gel Metaball Simulation
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

    let mouseX = width * 0.5
    let mouseY = height * 0.5
    let targetMouseX = mouseX
    let targetMouseY = mouseY

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX
      targetMouseY = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Fluid droplet vertices (36 radial points for organic gel boundary)
    const vertexCount = 48
    const baseRadius = Math.min(width, height) * 0.26
    const offsets: number[] = new Array(vertexCount).fill(0)
    const velocities: number[] = new Array(vertexCount).fill(0)

    let angle = 0

    const render = () => {
      angle += 0.015 + scrollVelocity * 0.001

      // Smooth mouse follow with heavy fluid inertia
      mouseX += (targetMouseX - mouseX) * 0.06
      mouseY += (targetMouseY - mouseY) * 0.06

      // Glossy dark slate clear with subtle refraction persistence
      ctx.fillStyle = 'rgba(9, 10, 15, 0.32)'
      ctx.fillRect(0, 0, width, height)

      const centerX = width * 0.5 + (mouseX - width * 0.5) * 0.15
      const centerY = height * 0.44 + (mouseY - height * 0.5) * 0.15 + (scrollProgress - 0.5) * 120

      // Squash and stretch based on scroll velocity
      const stretchY = 1.0 + Math.min(0.35, scrollVelocity * 0.018) + fluidImpulse * 0.2
      const stretchX = 1.0 / Math.sqrt(stretchY)

      // Update droplet spring physics
      const tensionK = (surfaceTension / 100) * 0.08 + 0.02
      const dampC = (100 - viscosity) / 100 * 0.08 + 0.88

      for (let i = 0; i < vertexCount; i++) {
        // Neighbor smoothing
        const prev = offsets[(i - 1 + vertexCount) % vertexCount]
        const next = offsets[(i + 1) % vertexCount]
        const force = -tensionK * offsets[i] + tensionK * 0.45 * (prev + next - 2 * offsets[i])

        velocities[i] = (velocities[i] + force) * dampC
        offsets[i] += velocities[i]
      }

      // Render Multi-Layered Gel Membrane
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.scale(stretchX, stretchY)

      // Outer Refractive Caustic Glow
      const glowGrad = ctx.createRadialGradient(0, 0, baseRadius * 0.4, 0, 0, baseRadius * 1.8)
      glowGrad.addColorStop(0, 'rgba(0, 102, 255, 0.25)')
      glowGrad.addColorStop(0.6, 'rgba(224, 231, 255, 0.08)')
      glowGrad.addColorStop(1, 'rgba(9, 10, 15, 0)')

      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(0, 0, baseRadius * 1.8, 0, Math.PI * 2)
      ctx.fill()

      // Primary Fluid Droplet Curve (Catmull-Rom smooth spline)
      ctx.beginPath()
      for (let i = 0; i <= vertexCount; i++) {
        const idx = i % vertexCount
        const theta = (idx / vertexCount) * Math.PI * 2 + angle * 0.2
        const harmonicWobble = Math.sin(theta * 3 + angle * 2) * 12 + Math.cos(theta * 5 - angle) * 8
        const r = baseRadius + offsets[idx] + harmonicWobble

        const vx = Math.cos(theta) * r
        const vy = Math.sin(theta) * r

        if (i === 0) {
          ctx.moveTo(vx, vy)
        } else {
          ctx.lineTo(vx, vy)
        }
      }
      ctx.closePath()

      // Glossy Gel Fill
      const gelGrad = ctx.createLinearGradient(-baseRadius, -baseRadius, baseRadius, baseRadius)
      gelGrad.addColorStop(0, '#1e293b')
      gelGrad.addColorStop(0.35, '#0f172a')
      gelGrad.addColorStop(0.75, '#0284c7')
      gelGrad.addColorStop(1, '#0066ff')

      ctx.fillStyle = gelGrad
      ctx.fill()

      // Specular Highlight Arc
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
      ctx.lineWidth = 2.5
      ctx.shadowColor = '#ffffff'
      ctx.shadowBlur = 14
      ctx.stroke()
      ctx.shadowBlur = 0

      // Internal Caustic Bubble
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.beginPath()
      ctx.ellipse(-baseRadius * 0.35, -baseRadius * 0.35, baseRadius * 0.28, baseRadius * 0.14, -0.6, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()

      // Decay impulse
      if (fluidImpulse > 0.01) {
        setFluidImpulse((imp) => imp * 0.9)
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [viscosity, surfaceTension, fluidImpulse, scrollProgress, scrollVelocity])

  return (
    <div className="lusion-root">
      {/* 60FPS Fluid Gel Canvas */}
      <canvas ref={canvasRef} className="lusion-canvas" aria-hidden="true" />

      {/* Floating Fluid Telemetry Bar */}
      <div className="lusion-hud-fixed">
        <div className="lusion-hud-cell">
          <span className="lusion-hud-label">SURFACE STATE</span>
          <strong className="lusion-mono-blue">ORGANIC VISCO-ELASTIC</strong>
        </div>
        <div className="lusion-hud-cell">
          <span className="lusion-hud-label">SCROLL VELOCITY</span>
          <strong className="lusion-mono-white">{scrollVelocity.toFixed(1)} px/s</strong>
        </div>
        <div className="lusion-hud-cell">
          <span className="lusion-hud-label">REYNOLDS NUMBER ($Re$)</span>
          <strong>{(12.4 + scrollVelocity * 1.8).toFixed(1)} (LAMINAR GEL)</strong>
        </div>
        <div className="lusion-hud-cell lusion-hud-action">
          <button
            type="button"
            className={`lusion-audio-btn ${audioActive ? 'is-active' : ''}`}
            onClick={toggleAudio}
            aria-label="Toggle Fluid Sound"
          >
            <span>{audioActive ? 'FLUID FX: ACTIVE' : 'FLUID FX: MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <header className="lusion-hero-section">
        <div className="lusion-hero-container">
          <div className="lusion-hero-badge">
            <span className="lusion-pulse-dot" />
            <span>03 // LUSION LIQUID MORPH ARCHITECTURE</span>
          </div>

          <h1
            className="lusion-hero-title"
            style={{
              letterSpacing: `${Math.max(0.01, 0.14 - scrollProgress * 0.12)}em`,
              opacity: Math.max(0.2, 1 - scrollProgress * 1.8),
              transform: `translateY(${scrollY * 0.16}px)`,
            }}
          >
            TACTILE DIMENSION &amp; <span className="lusion-text-gradient">ORGANIC LIQUID</span>.
          </h1>

          <p
            className="lusion-hero-lead"
            style={{
              opacity: Math.max(0.15, 1 - scrollProgress * 2.2),
              transform: `translateY(${scrollY * 0.12}px)`,
            }}
          >
            Inspired by the fluid physics of Lusion.co: buttery-smooth 60fps micro-interactions,
            tactile elasticity, squash-and-stretch kinetics, and meticulous digital craft. Scroll to
            witness organic surface deformation.
          </p>

          <div className="lusion-scroll-indicator">
            <span className="lusion-scroll-line" />
            <span className="lusion-scroll-text">SCROLL TO DEFORM GEL MEMBRANE ↓</span>
          </div>
        </div>
      </header>

      {/* Section 01: Liquid Project Plates (Scroll-Driven Reveals) */}
      <section id="lusion-projects" className="lusion-section">
        <div className="lusion-section-header">
          <span className="lusion-eyebrow">FLUID MANIFOLD // SELECTED WORK</span>
          <h2>
            DIMENSIONAL <span>PROJECT PLATES</span>
          </h2>
          <p>
            Engineering artifacts that blend computational rigor with tactile, organic interaction.
            Hover and scroll to trigger gelatinous surface deformation.
          </p>
        </div>

        <div className="lusion-projects-grid">
          {PORTFOLIO_PROJECTS.map((proj, idx) => {
            const isSelected = activeProject.id === proj.id
            return (
              <article
                key={proj.id}
                className={`lusion-project-card ${isSelected ? 'is-focused' : ''}`}
                onClick={() => {
                  triggerWaterPlop(480 + idx * 40)
                  setActiveProject(proj)
                }}
              >
                <div className="lusion-card-header">
                  <span className="lusion-card-idx">PLATE 0{idx + 1}</span>
                  <span className="lusion-domain-pill">{proj.domainCode}</span>
                </div>

                <h3 className="lusion-project-title">{proj.title}</h3>
                <p className="lusion-project-tagline">{proj.tagline}</p>

                <div className="lusion-metric-row">
                  {proj.metrics.slice(0, 2).map((m, mIdx) => (
                    <div key={mIdx} className="lusion-metric-stat">
                      <span className="lusion-metric-label">{m.label}</span>
                      <strong className="lusion-metric-value">{m.value}</strong>
                    </div>
                  ))}
                </div>

                <p className="lusion-project-summary">{proj.summary}</p>

                <div className="lusion-card-footer">
                  <div className="lusion-tag-list">
                    {proj.tags.slice(0, 3).map((t, tIdx) => (
                      <span key={tIdx} className="lusion-tag-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="lusion-inspect-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      triggerWaterPlop(720)
                      setActiveProject(proj)
                      setDossierOpen(true)
                    }}
                  >
                    INSPECT GEL SPEC ↗
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Section 02: Interactive Viscosity & Fluid Lab */}
      <section className="lusion-section">
        <div className="lusion-glass-slab">
          <div className="lusion-lab-header">
            <span className="lusion-eyebrow">INTERACTIVE GEL BENCH</span>
            <h2>
              SURFACE TENSION &amp; <span>VISCOSITY LAB</span>
            </h2>
            <p>
              Adjust fluid parameters to alter the resonance frequency of the central 3D gel
              droplet, or inject a fluid shockwave impulse.
            </p>
          </div>

          <div className="lusion-lab-controls">
            <div className="lusion-sliders-row">
              <label>
                <span>SURFACE TENSION ($T$): {surfaceTension}%</span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={surfaceTension}
                  onChange={(e) => {
                    triggerWaterPlop(540)
                    setSurfaceTension(Number(e.target.value))
                  }}
                />
              </label>

              <label>
                <span>DYNAMIC VISCOSITY ($\mu$): {viscosity}%</span>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={viscosity}
                  onChange={(e) => {
                    triggerWaterPlop(460)
                    setViscosity(Number(e.target.value))
                  }}
                />
              </label>
            </div>

            <div className="lusion-impulse-row">
              <button
                type="button"
                className="lusion-impulse-btn"
                onClick={() => {
                  triggerWaterPlop(640)
                  setFluidImpulse(1.0)
                }}
              >
                INJECT FLUID SHOCKWAVE IMPULSE (⚡)
              </button>
            </div>

            <div className="lusion-lab-metrics">
              <div>
                <span>DAMPING COEFFICIENT ($\zeta$)</span>
                <strong className="lusion-mono-blue">{((viscosity / 100) * 0.42).toFixed(3)}</strong>
              </div>
              <div>
                <span>HARMONIC RESONANCE</span>
                <strong className="lusion-mono-white">
                  {(Math.sqrt(surfaceTension * 12.5)).toFixed(1)} rad/s
                </strong>
              </div>
              <div>
                <span>REFRACTION INDEX ($n$)</span>
                <strong>1.482 (ORGANIC GEL)</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 03: Tactile Capabilities Grid */}
      <section className="lusion-section">
        <div className="lusion-section-header">
          <span className="lusion-eyebrow">CREATIVE CODE &amp; ARCHITECTURE</span>
          <h2>
            CORE <span>TACTILE CAPABILITIES</span>
          </h2>
        </div>

        <div className="lusion-capabilities-grid">
          {ENGINEERING_CAPABILITIES.map((cap, cIdx) => (
            <div key={cIdx} className="lusion-capability-card">
              <div className="lusion-cap-num">GEL.0{cIdx + 1}</div>
              <h4>{cap.area}</h4>
              <p>{cap.description}</p>
              <div className="lusion-cap-skills">
                {cap.skills.map((s, sIdx) => (
                  <span key={sIdx} className="lusion-skill-pill">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 04: Fluid Uplink Footer */}
      <footer className="lusion-footer">
        <div className="lusion-footer-container">
          <div className="lusion-footer-left">
            <span className="lusion-eyebrow">FLUID COLLABORATION</span>
            <h2>TRANSMIT TO SIROSIU</h2>
            <p>Direct communication channel open for creative technology, hardware engineering, and digital products.</p>
            <div className="lusion-contact-links">
              <a href={`mailto:${SITE_METADATA.author.email}`} className="lusion-btn-blue">
                START CONVERSATION: {SITE_METADATA.author.email}
              </a>
              <a
                href={SITE_METADATA.author.github}
                target="_blank"
                rel="noreferrer"
                className="lusion-btn-outline"
              >
                GITHUB REPOSITORY ↗
              </a>
            </div>
          </div>
          <div className="lusion-footer-right">
            <div className="lusion-stamp">
              <span>SIROSIU // PROTOTYPE 4</span>
              <span>CONCEPT 03: LUSION LIQUID</span>
              <span>RENDER: CATMULL-ROM HARMONIC SPLINE</span>
              <span>LOCKED TO 60FPS AT ALL VIEWPORTS</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Deep Dossier Modal */}
      {dossierOpen && activeProject && (
        <div className="lusion-modal-backdrop" onClick={() => setDossierOpen(false)}>
          <div className="lusion-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="lusion-modal-header">
              <div>
                <span className="lusion-eyebrow">
                  PROJECT SPECIFICATION // {activeProject.domainCode}
                </span>
                <h3>{activeProject.title}</h3>
              </div>
              <button
                type="button"
                className="lusion-modal-close"
                onClick={() => setDossierOpen(false)}
                aria-label="Close Dossier Modal"
              >
                ✕
              </button>
            </div>

            <div className="lusion-modal-body">
              <div className="lusion-modal-section">
                <h4>PHYSICAL PROBLEM STATEMENT</h4>
                <p>{activeProject.problemStatement || activeProject.summary}</p>
              </div>

              <div className="lusion-modal-section">
                <h4>ARCHITECTURAL IMPLEMENTATION</h4>
                <p>{activeProject.technicalApproach || activeProject.architectureHighlight}</p>
              </div>

              <div className="lusion-modal-section">
                <h4>MEASURED BENCHMARKS</h4>
                <div className="lusion-modal-metrics">
                  {activeProject.metrics.map((m, idx) => (
                    <div key={idx} className="lusion-modal-stat">
                      <span>{m.label}</span>
                      <strong>{m.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lusion-modal-footer">
              <span className="lusion-modal-hint">Press [ESC] to return to fluid canvas</span>
              <a
                href={activeProject.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="lusion-modal-link"
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
export default Concept03Lusion
