import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  ThresholdWorldEngine,
  WorldMode,
  STATIONS,
  WorldTelemetry,
} from './ThresholdWorldEngine'
import { WorldAudio } from './WorldAudio'
import './Concept04WorldEntrance.css'

export const Concept04WorldEntrance: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<ThresholdWorldEngine | null>(null)
  const audioRef = useRef<WorldAudio | null>(null)
  const introPanelRef = useRef<HTMLDivElement>(null)

  // Experience & Telemetry State
  const [telemetry, setTelemetry] = useState<WorldTelemetry>({
    mode: 'idle',
    progress: 0,
    u: 0.012,
    distance: 0,
    velocity: 0,
    activeStationIndex: -1,
    activeBeat: '',
    isAtEnd: false,
  })

  // Preloader boot state
  const [bootProgress, setBootProgress] = useState(0)
  const [soundOn, setSoundOn] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)

  // 1. Initialize Audio Engine
  useEffect(() => {
    audioRef.current = new WorldAudio()
    return () => {
      audioRef.current?.dispose()
      audioRef.current = null
    }
  }, [])

  // 2. Initialize 3D Engine
  useEffect(() => {
    if (!containerRef.current) return

    const engine = new ThresholdWorldEngine(
      containerRef.current,
      {
        onTelemetry: (next) => {
          setTelemetry((prev) => {
            if (
              prev.mode === next.mode &&
              prev.activeStationIndex === next.activeStationIndex &&
              prev.activeBeat === next.activeBeat &&
              prev.isAtEnd === next.isAtEnd &&
              Math.abs(prev.u - next.u) < 0.003
            ) {
              return prev
            }
            return next
          })
        },
      },
      (warp) => {
        audioRef.current?.setWarp(warp)
      }
    )
    engineRef.current = engine

    return () => {
      engine.dispose()
      engineRef.current = null
    }
  }, [])

  // 3. Smooth Preloader Boot Progress
  useEffect(() => {
    let frame = 0
    const started = performance.now()
    const duration = 2200
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration)
      const eased = t * t * (3 - 2 * t)
      setBootProgress(Math.round(eased * 100))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  // 4. Mouse Parallax Tilt on Preloader Panel
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const xNorm = (e.clientX / window.innerWidth - 0.5) * 2
      const yNorm = (e.clientY / window.innerHeight - 0.5) * 2

      if (introPanelRef.current) {
        introPanelRef.current.style.setProperty('--tilt-x', `${-yNorm * 3}deg`)
        introPanelRef.current.style.setProperty('--tilt-y', `${xNorm * 4}deg`)
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  // Actions
  const handleEnter = useCallback(() => {
    if (hasEntered || bootProgress < 100) return
    setHasEntered(true)
    audioRef.current?.setSound(true)
    setSoundOn(true)
    engineRef.current?.startPlunge()
  }, [hasEntered, bootProgress])

  const handleSkip = useCallback(() => {
    setHasEntered(true)
    audioRef.current?.setSound(true)
    setSoundOn(true)
    engineRef.current?.skipToJourney()
  }, [])

  const toggleSound = useCallback(() => {
    if (!audioRef.current) return
    const next = audioRef.current.toggleSound()
    setSoundOn(next)
  }, [])

  const handleStationClick = useCallback((index: number) => {
    engineRef.current?.goToStation(index)
  }, [])

  const isIdle = telemetry.mode === 'idle'
  const isJourney = telemetry.mode === 'journey'
  const activeStation =
    telemetry.activeStationIndex >= 0 ? STATIONS[telemetry.activeStationIndex] : null

  return (
    <div className={`universe-root ${isIdle ? 'phase-idle' : 'phase-active'}`}>
      {/* 3D WebGL Canvas Layer */}
      <div ref={containerRef} className="universe-canvas-mount" />

      {/* Atmospheric Vignette & Film Grain */}
      <div className="universe-vignette" aria-hidden="true" />
      <div className="universe-grain" aria-hidden="true" />

      {/* Persistent Minimalist Top Navigation */}
      <header className="c04-topbar">
        <div className="c04-brand">
          <span className="c04-brand-main">ANKUSH MALOTHIA</span>
          <span className="c04-brand-sub">
            SIROSIU <i>//</i> INDEPENDENT SYSTEMS
          </span>
        </div>

        <div className="c04-topbar-center">
          <span className="c04-status-dot" />
          <span className="c04-status-text">
            WORLD SYSTEMS {isIdle ? 'STANDBY' : 'ONLINE'}
          </span>
          {isJourney && (
            <span className="c04-telemetry-readout">
              DIST {telemetry.distance.toString().padStart(3, '0')} · VEL{' '}
              {telemetry.velocity.toFixed(1)}
            </span>
          )}
        </div>

        <div className="c04-topbar-actions">
          <button
            type="button"
            className="c04-text-btn"
            onClick={toggleSound}
            aria-pressed={soundOn}
          >
            {soundOn ? 'Sound on' : 'Sound off'}
          </button>
          <a
            className="c04-text-btn c04-contact-link"
            href="mailto:sirosiu@gmail.com"
          >
            Talk to Ankush ↗
          </a>
        </div>
      </header>

      {/* PHASE 0: PRELOADER OBSERVATION PANEL */}
      <div className={`c04-preloader-overlay ${isIdle ? 'visible' : 'hidden'}`}>
        <div ref={introPanelRef} className="c04-glass-panel">
          <div className="c04-panel-top">
            <span className="c04-mono-lbl">ANKUSH MALOTHIA // SIROSIU</span>
            <span className="c04-mono-lbl c04-dim">SYS.04 // SECTOR HORIZON</span>
          </div>

          <h1 className="c04-hero-heading">
            We build at the edge
            <br />
            of the known universe.
          </h1>

          <div className="c04-progress-row">
            <div className="c04-track-bar">
              <div
                className="c04-track-fill"
                style={{ width: `${bootProgress}%` }}
              />
            </div>
            <div className="c04-track-pct">{bootProgress}%</div>
          </div>

          <div className="c04-action-row">
            <button
              type="button"
              id="enter"
              className={`c04-enter-cta ${bootProgress >= 100 ? 'ready' : ''}`}
              disabled={bootProgress < 100}
              onClick={handleEnter}
            >
              Enter Ankush’s Universe ↗
            </button>
            <button
              type="button"
              className="c04-skip-btn"
              onClick={handleSkip}
            >
              Skip intro
            </button>
          </div>
        </div>
      </div>

      {/* PHASE 1 & 2: NARRATIVE BEAT OVERLAY */}
      <div
        className={`c04-narrative-beat ${telemetry.activeBeat ? 'visible' : ''}`}
        aria-live="polite"
      >
        {telemetry.activeBeat}
      </div>

      {/* PHASE 3: INTERACTIVE JOURNEY HUD */}
      <div className={`c04-journey-hud ${isJourney ? 'visible' : 'hidden'}`}>
        {/* Active Station Card on the Left */}
        <div className={`c04-station-card ${activeStation ? 'visible' : ''}`}>
          <div className="c04-mono-lbl c04-dim">
            {activeStation
              ? `STATION 0${telemetry.activeStationIndex + 1} / 04`
              : ''}
          </div>
          <h2 className="c04-station-title">{activeStation?.title}</h2>
          <div className="c04-station-subtitle">{activeStation?.subtitle}</div>
          <p className="c04-station-desc">{activeStation?.description}</p>
        </div>

        {/* Vertical Progress Rail & Station Dots on the Right */}
        <div className="c04-rail-nav">
          <div className="c04-rail-track">
            <div
              className="c04-rail-fill"
              style={{ height: `${telemetry.progress}%` }}
            />
          </div>
          <div className="c04-rail-dots">
            {STATIONS.map((st, i) => (
              <button
                key={st.title}
                type="button"
                className={`c04-rail-dot ${telemetry.activeStationIndex === i ? 'active' : ''}`}
                title={`Glide to ${st.title}`}
                onClick={() => handleStationClick(i)}
                aria-label={`Glide to Station 0${i + 1}: ${st.title}`}
              >
                <span className="c04-dot-tooltip">{st.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Cue Indicator at Bottom Center */}
        <div
          className={`c04-scroll-cue ${telemetry.u > 0.14 ? 'fade-out' : ''}`}
        >
          <span className="c04-mono-lbl">Scroll to explore</span>
          <i className="c04-cue-line" />
        </div>

        {/* End of Line Contact Card */}
        <div className={`c04-contact-card ${telemetry.isAtEnd ? 'visible' : ''}`}>
          <div className="c04-mono-lbl c04-dim">TERMINUS REACHED</div>
          <h3 className="c04-contact-title">Let’s build something vast.</h3>
          <div className="c04-contact-links">
            <a href="mailto:sirosiu@gmail.com">Email ↗</a>
            <a
              href="https://github.com/Sirosiu"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Concept04WorldEntrance
