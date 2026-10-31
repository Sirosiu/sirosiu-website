import React, { useEffect, useRef, useState, useCallback } from 'react'
import { ThresholdWorldEngine, WorldMode } from './ThresholdWorldEngine'
import { WorldAudio } from './WorldAudio'
import './Concept04WorldEntrance.css'

const LOADING_MESSAGES: [number, string][] = [
  [0, 'Aligning deep space observatories & orbital telemetry...'],
  [24, 'Igniting relativistic warp drive & Kerr accretion disc...'],
  [48, 'Mapping gravitational lensing & stellar coordinate grid...'],
  [72, 'Synchronizing Ankush Malothia’s core architecture systems...'],
  [100, 'Cosmic portal locked. Step into Ankush’s universe.'],
]

export const Concept04WorldEntrance: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<ThresholdWorldEngine | null>(null)
  const audioRef = useRef<WorldAudio | null>(null)
  const bottomPanelRef = useRef<HTMLDivElement>(null)

  // Loader state
  const [loadPercent, setLoadPercent] = useState<number>(0)
  const [loadStatus, setLoadStatus] = useState<string>('Aligning deep space observatories & orbital telemetry...')
  const [isReady, setIsReady] = useState<boolean>(false)
  const [isDeparting, setIsDeparting] = useState<boolean>(false)
  const [isLoaderHidden, setIsLoaderHidden] = useState<boolean>(false)

  // Experience Mode
  const [mode, setMode] = useState<WorldMode>('loading')
  const [soundOn, setSoundOn] = useState<boolean>(false)
  const [introLine, setIntroLine] = useState<string>('')
  const [introLineOpacity, setIntroLineOpacity] = useState<number>(0)

  // Veil Transition State
  const [veilClass, setVeilClass] = useState<string>('')

  // Scroll cue state
  const [showScrollCue, setShowScrollCue] = useState<boolean>(false)

  // 1. Initialize Audio Engine
  useEffect(() => {
    audioRef.current = new WorldAudio()
    return () => {
      audioRef.current?.dispose()
      audioRef.current = null
    }
  }, [])

  // 1b. Interactive Pointer Parallax Tilt
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const xNorm = (e.clientX / window.innerWidth - 0.5) * 2.0
      const yNorm = (e.clientY / window.innerHeight - 0.5) * 2.0
      engineRef.current?.setPointer(xNorm, yNorm)

      if (bottomPanelRef.current) {
        const tiltX = (xNorm * 9).toFixed(2)
        const tiltY = (-yNorm * 9).toFixed(2)
        bottomPanelRef.current.style.setProperty('--tilt-x', `${tiltX}deg`)
        bottomPanelRef.current.style.setProperty('--tilt-y', `${tiltY}deg`)
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  // 2. Initialize 3D Engine & Paced Preloader
  useEffect(() => {
    if (!containerRef.current) return

    const engine = new ThresholdWorldEngine(containerRef.current, {
      onLoadProgress: (p, msg) => {
        setLoadPercent((prev) => Math.max(prev, p))
        setLoadStatus(msg)
      },
      onReady: () => {
        setIsReady(true)
        setLoadPercent(100)
        setLoadStatus('Cosmic portal locked. Step into Ankush’s universe.')
      },
    })
    engineRef.current = engine

    // Paced progress simulation ensuring smooth visual progression
    let currentP = 0
    const interval = setInterval(() => {
      currentP += Math.random() * 8 + 3
      if (currentP >= 100) {
        currentP = 100
        clearInterval(interval)
        setLoadPercent(100)
        setIsReady(true)
        setLoadStatus('Cosmic portal locked. Step into Ankush’s universe.')
      } else {
        setLoadPercent(Math.floor(currentP))
        let matchedMsg = 'Aligning deep space observatories & orbital telemetry...'
        for (let i = LOADING_MESSAGES.length - 1; i >= 0; i--) {
          if (currentP >= LOADING_MESSAGES[i][0]) {
            matchedMsg = LOADING_MESSAGES[i][1]
            break
          }
        }
        setLoadStatus(matchedMsg)
      }
    }, 110)

    return () => {
      clearInterval(interval)
      engine.dispose()
      engineRef.current = null
    }
  }, [])

  // 3. Start Intro Fly-Through
  const handleStartIntro = useCallback(() => {
    if (!isReady || mode !== 'loading') return

    audioRef.current?.play().then((playing) => {
      if (playing) setSoundOn(true)
    })

    setIsDeparting(true)
    setMode('intro')
    engineRef.current?.setMode('intro')

    // Fade out preloader over 900ms
    setTimeout(() => {
      setIsLoaderHidden(true)
    }, 900)

    // Run intro narrative timeline
    const startTime = performance.now()
    const beats: [number, number, string][] = [
      [1.0, 4.2, 'In the silence of deep space, complex systems find perfect clarity.'],
      [4.8, 8.0, 'I architect software that spans light-years. Welcome to my domain.'],
    ]

    let rafId = 0
    const tickIntro = (now: number) => {
      const elapsed = (now - startTime) / 1000

      const currentBeat = beats.find(([start, end]) => elapsed >= start && elapsed < end)
      if (currentBeat) {
        setIntroLine(currentBeat[2])
        const fadeIn = Math.min(1, (elapsed - currentBeat[0]) / 0.65)
        const fadeOut = Math.min(1, (currentBeat[1] - elapsed) / 0.65)
        setIntroLineOpacity(Math.max(0, Math.min(fadeIn, fadeOut)))
      } else {
        setIntroLineOpacity(0)
      }

      if (elapsed >= 8.3) {
        endIntro()
      } else {
        rafId = requestAnimationFrame(tickIntro)
      }
    }

    rafId = requestAnimationFrame(tickIntro)
  }, [isReady, mode])

  // 4. End Intro & Veil Crossfade
  const endIntro = useCallback(() => {
    if (mode === 'journey') return

    setIntroLineOpacity(0)
    setVeilClass('cover')

    setTimeout(() => {
      setMode('journey')
      engineRef.current?.setMode('journey')
      window.scrollTo(0, 0)
      setShowScrollCue(true)

      setVeilClass('cover reveal')

      setTimeout(() => {
        setVeilClass('')
      }, 1400)
    }, 850)
  }, [mode])

  // 5. Sound Toggle
  const toggleSound = () => {
    if (!audioRef.current) return
    const isPlaying = audioRef.current.toggle()
    setSoundOn(isPlaying)
  }

  // 6. Scroll listener for Journey Mode
  useEffect(() => {
    if (mode !== 'journey') return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll))

      engineRef.current?.setScrollProgress(progress)

      if (scrollY > 50) {
        setShowScrollCue(false)
      } else {
        setShowScrollCue(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mode])

  const handleCueClick = () => {
    window.scrollBy({
      top: Math.max(220, window.innerHeight * 0.42),
      behavior: 'smooth',
    })
  }

  return (
    <div className="concept04-world-root">
      {/* 3D WebGL Three.js Container */}
      <div ref={containerRef} className="threshold-canvas-container" />

      {/* Persistent Top Navigation Bar */}
      <header className="c04-topbar">
        <button
          id="sound"
          className="c04-top-btn"
          onClick={toggleSound}
          aria-pressed={soundOn}
        >
          {soundOn ? 'Sound on · mute' : 'Sound off · play'}
        </button>

        <a className="c04-top-btn" href="mailto:sirosiu@gmail.com">
          Talk to Ankush ↗
        </a>

        {mode === 'intro' && (
          <button id="skipIntro" className="c04-top-btn" onClick={endIntro}>
            Begin the journey ↗
          </button>
        )}
      </header>

      {/* PHASE 0: PRELOADER OVERLAY (#loader) */}
      {!isLoaderHidden && (
        <section
          id="loader"
          className={`c04-loader ${isDeparting ? 'departing' : ''}`}
          aria-label="Preparing Ankush Malothia celestial cosmos"
        >
          <div className="c04-loader-badge" aria-hidden="true">
            <span className="c04-badge-dot" />
            <span>SECTOR 04 // CARINA NEBULAR COMPLEX · RA 10h 45m 03s · DEC -59° 52′ 04″</span>
          </div>

          <div className="c04-loader-art" aria-hidden="true" />
          <div className="c04-loader-haze" aria-hidden="true" />

          <p className="c04-loader-name">ANKUSH MALOTHIA // SIROSIU</p>
          <h2 className="c04-loader-title">
            We build at the edge
            <br />
            of the known universe.
          </h2>

          <div ref={bottomPanelRef} className="c04-loader-bottom">
            <div className="c04-loader-number">
              <span id="percent">{loadPercent}</span>
              <small>%</small>
            </div>

            <div
              id="loadMeter"
              className="c04-loader-track"
              role="progressbar"
              aria-valuenow={loadPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <i
                id="loadFill"
                className="c04-loader-fill"
                style={{ width: `${loadPercent}%` }}
              />
            </div>

            <p id="loadStatus" className="c04-loader-status" role="status">
              {loadStatus}
            </p>

            <button
              id="enter"
              className="c04-enter-btn"
              disabled={!isReady}
              onClick={handleStartIntro}
            >
              Enter Ankush's Universe <span>↗</span>
            </button>

            <a className="c04-loader-contact" href="mailto:sirosiu@gmail.com">
              Talk to Ankush ↗
            </a>

            <p className="c04-loader-small">
              Enter with sound. You can turn it off anytime.
            </p>
          </div>
        </section>
      )}

      {/* PHASE 1 & 2: INTRO FLY-THROUGH NARRATIVE (#intro) */}
      <section
        id="intro"
        className={`c04-intro-overlay ${mode !== 'intro' ? 'hidden' : ''}`}
      >
        <p
          id="introLine"
          className="c04-intro-line"
          style={{
            opacity: introLineOpacity,
            filter: `blur(${(1 - introLineOpacity) * 6}px)`,
          }}
        >
          {introLine}
        </p>
      </section>

      {/* PHASE 3: THE CLOUD MIST VEIL (#worldVeil) */}
      <div id="worldVeil" className={`c04-world-veil ${veilClass}`} aria-hidden="true">
        <i />
        <i />
        <span />
      </div>

      {/* PHASE 4: JOURNEY MODE SCROLL CUE */}
      <button
        id="scrollCue"
        className={`c04-scroll-cue ${showScrollCue && mode === 'journey' ? 'is-visible' : ''}`}
        onClick={handleCueClick}
        aria-label="Scroll down to move forward"
      >
        <div className="c04-scroll-cue-icon">
          <div className="c04-scroll-cue-trace" />
          <svg className="c04-scroll-cue-chevron" viewBox="0 0 16 10">
            <path d="M2 3l6 4 6-4" />
          </svg>
        </div>
        <div className="c04-scroll-cue-label">
          Scroll down to move forward
          <span>Traverse Ankush's celestial highway</span>
        </div>
      </button>

      {/* JOURNEY CONTINUOUS CHAPTER STAGES */}
      {mode === 'journey' && (
        <main className="c04-journey-chapters">
          {/* Chapter 01 */}
          <article className="c04-chapter-card">
            <div className="c04-card-inner">
              <span className="c04-card-folio">ORBITAL STATION 01 // HYPERION</span>
              <h2 className="c04-card-title">Sub-millisecond latency across planetary clusters.</h2>
              <p className="c04-card-body">
                Zero-copy RingBuffer streaming, lock-free concurrency, and deterministic throughput
                engineered by Ankush Malothia to handle millions of real-time transactions with sub-millisecond p99.
              </p>
              <a href="mailto:sirosiu@gmail.com" className="c04-card-action">
                Inspect Hyperion Engine ↗
              </a>
            </div>
          </article>

          {/* Chapter 02 */}
          <article className="c04-chapter-card">
            <div className="c04-card-inner">
              <span className="c04-card-folio">ORBITAL STATION 02 // ARGON</span>
              <h2 className="c04-card-title">Autonomous intelligence with deterministic precision.</h2>
              <p className="c04-card-body">
                Multi-agent orchestration engines designed by Ankush Malothia, self-calibrating across
                high-dimensional tool pipelines and sandboxed execution runtimes.
              </p>
              <a href="https://github.com/sirosiu" target="_blank" rel="noreferrer" className="c04-card-action">
                Explore Argon Architecture ↗
              </a>
            </div>
          </article>

          {/* Chapter 03 */}
          <article className="c04-chapter-card">
            <div className="c04-card-inner">
              <span className="c04-card-folio">ORBITAL STATION 03 // AETHER</span>
              <h2 className="c04-card-title">Raymarched spatial shaders & zero-latency WebGPU.</h2>
              <p className="c04-card-body">
                Volumetric relativistic simulations, real-time physics, and mathematically grounded graphics
                that push browser hardware to its physical limits.
              </p>
              <a href="#explore" className="c04-card-action" onClick={(e) => { e.preventDefault(); handleCueClick(); }}>
                Continue down the ribbon ↗
              </a>
            </div>
          </article>

          {/* Chapter 04 */}
          <article className="c04-chapter-card">
            <div className="c04-card-inner">
              <span className="c04-card-folio">ORBITAL STATION 04 // CHRONOS</span>
              <h2 className="c04-card-title">Ready to build something extraordinary?</h2>
              <p className="c04-card-body">
                You don’t need an exhaustive plan to begin. Tell Ankush Malothia what you want to build or elevate,
                and we will carve the path together.
              </p>
              <a href="mailto:sirosiu@gmail.com" className="c04-card-action">
                Start a Conversation ↗
              </a>
            </div>
          </article>
        </main>
      )}
    </div>
  )
}

export default Concept04WorldEntrance
