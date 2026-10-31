import React, { useEffect, useRef, useState, useCallback } from 'react'
import { ThresholdWorldEngine, WorldMode } from './ThresholdWorldEngine'
import { WorldAudio } from './WorldAudio'
import './Concept04WorldEntrance.css'

const LOADING_MESSAGES: [number, string][] = [
  [0, 'That idea you keep coming back to.'],
  [22, 'You don’t need every answer to begin.'],
  [48, 'Big ideas become real one decision at a time.'],
  [74, 'I’m Harshit. Let’s work out your next step.'],
  [100, 'Bring your idea. Let’s see where it can go.'],
]

export const Concept04WorldEntrance: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<ThresholdWorldEngine | null>(null)
  const audioRef = useRef<WorldAudio | null>(null)

  // Loader state
  const [loadPercent, setLoadPercent] = useState<number>(0)
  const [loadStatus, setLoadStatus] = useState<string>('Finding the first light...')
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

  // 2. Initialize 3D Engine & Realistic Preloader
  useEffect(() => {
    if (!containerRef.current) return

    const engine = new ThresholdWorldEngine(containerRef.current, {
      onLoadProgress: (p, msg) => {
        setLoadPercent((prev) => Math.max(prev, p))
        setLoadStatus(msg)
      },
      onReady: () => {
        // Will be picked up by the timer-based smooth ticker
      },
    })
    engineRef.current = engine

    // Smooth progress simulation ensuring user has time to witness the preloader
    let currentP = 0
    const interval = setInterval(() => {
      currentP += Math.random() * 8 + 3
      if (currentP >= 100) {
        currentP = 100
        clearInterval(interval)
        setLoadPercent(100)
        setIsReady(true)
        setLoadStatus('Bring your idea. Let’s see where it can go.')
      } else {
        setLoadPercent(Math.floor(currentP))
        let matchedMsg = 'Finding the first light...'
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

    // Sound start
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
      [1.0, 4.2, 'Some ideas stay with you.'],
      [4.8, 8.0, 'Let’s see where this one can lead.'],
    ]

    let rafId = 0
    const tickIntro = (now: number) => {
      const elapsed = (now - startTime) / 1000

      const currentBeat = beats.find(([start, end]) => elapsed >= start && elapsed < end)
      if (currentBeat) {
        setIntroLine(currentBeat[2])
        // Fade in & out easing
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

    // Dual mist veil covers the viewport over 850ms
    setTimeout(() => {
      setMode('journey')
      engineRef.current?.setMode('journey')
      window.scrollTo(0, 0)
      setShowScrollCue(true)

      // Veil begins revealing
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
          Talk to Harshit ↗
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
          aria-label="Preparing continuous world"
        >
          <div className="c04-loader-art" aria-hidden="true" />
          <div className="c04-loader-haze" aria-hidden="true" />

          <p className="c04-loader-name">SIROSIU // HARSHIT SINGH</p>
          <h2 className="c04-loader-title">
            Every idea starts
            <br />
            with a little light.
          </h2>

          <div className="c04-loader-bottom">
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
              Enter the world <span>↗</span>
            </button>

            <a className="c04-loader-contact" href="mailto:sirosiu@gmail.com">
              Talk to Harshit ↗
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
          <span>Explore the continuous domain</span>
        </div>
      </button>

      {/* JOURNEY CONTINUOUS STAGES */}
      {mode === 'journey' && (
        <main className="c04-journey-chapters">
          {/* Chapter 01 */}
          <article className="c04-chapter-card">
            <div className="c04-card-inner">
              <span className="c04-card-folio">01 / FEELING</span>
              <h2 className="c04-card-title">Architecture begins where words hesitate.</h2>
              <p className="c04-card-body">
                The first thing someone asks for isn’t always what they need most.
                We discover the core tension before building: how systems speak, how data moves,
                and how humans interact under cognitive load.
              </p>
              <a href="mailto:sirosiu@gmail.com" className="c04-card-action">
                Discuss an architecture ↗
              </a>
            </div>
          </article>

          {/* Chapter 02 */}
          <article className="c04-chapter-card">
            <div className="c04-card-inner">
              <span className="c04-card-folio">02 / POSSIBILITY</span>
              <h2 className="c04-card-title">Transforming high dimensions into living software.</h2>
              <p className="c04-card-body">
                From high-throughput distributed microservices to real-time WebGL spatial shaders
                and self-calibrating neural clusters. Complex systems engineered with effortless elegance.
              </p>
              <a href="https://github.com/sirosiu" target="_blank" rel="noreferrer" className="c04-card-action">
                View GitHub Repositories ↗
              </a>
            </div>
          </article>

          {/* Chapter 03 */}
          <article className="c04-chapter-card">
            <div className="c04-card-inner">
              <span className="c04-card-folio">03 / CLARITY</span>
              <h2 className="c04-card-title">Precision engineering, zero-latency intuition.</h2>
              <p className="c04-card-body">
                Every millisecond matters. Raymarched volumetric atmospheres, 60fps buttery physics,
                and mathematically grounded architectures that scale smoothly across millions of users.
              </p>
              <a href="#explore" className="c04-card-action" onClick={(e) => { e.preventDefault(); handleCueClick(); }}>
                Continue into the deep ↗
              </a>
            </div>
          </article>

          {/* Chapter 04 */}
          <article className="c04-chapter-card">
            <div className="c04-card-inner">
              <span className="c04-card-folio">04 / REALITY</span>
              <h2 className="c04-card-title">Ready to bring your idea into form?</h2>
              <p className="c04-card-body">
                You don’t need an exhaustive plan to begin. Tell me what you want to build or elevate,
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
