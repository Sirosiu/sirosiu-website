import React, { useCallback, useRef, useState, useEffect } from 'react'
import { PinnedScrollyStage } from '../../components/PinnedScrollyStage'
import { KerrBlackHoleEngine } from './KerrBlackHoleEngine'

const PALETTES = [
  {
    id: 0,
    name: 'SOLAR AMBER',
    accent: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.45)',
    secondary: '#38bdf8',
  },
  {
    id: 1,
    name: 'HORIZON GOLD',
    accent: '#eab308',
    accentGlow: 'rgba(234, 179, 8, 0.45)',
    secondary: '#fef08a',
  },
  {
    id: 2,
    name: 'TACHYON VIOLET',
    accent: '#a855f7',
    accentGlow: 'rgba(168, 85, 247, 0.45)',
    secondary: '#10b981',
  },
  {
    id: 3,
    name: 'MONOCHROME',
    accent: '#ffffff',
    accentGlow: 'rgba(255, 255, 255, 0.35)',
    secondary: '#94a3b8',
  },
]

export const Concept01Cosmic: React.FC = () => {
  const engineRef = useRef<KerrBlackHoleEngine | null>(null)
  const [paletteIndex, setPaletteIndex] = useState(0)
  const [isAudioActive, setIsAudioActive] = useState(false)
  const eqCanvasRef = useRef<HTMLCanvasElement>(null)

  const activePalette = PALETTES[paletteIndex]

  // Render WebGL engine
  const renderCanvas = useCallback((container: HTMLDivElement) => {
    const engine = new KerrBlackHoleEngine({
      container,
      spin: 0.94,
      inclination: 1.38,
      initialPalette: paletteIndex,
    })
    engineRef.current = engine
    return () => {
      engine.dispose()
      engineRef.current = null
    }
  }, [])

  // Sync palette index to active engine
  const handleSelectPalette = (idx: number) => {
    setPaletteIndex(idx)
    if (engineRef.current) {
      engineRef.current.setPalette(idx)
    }
  }

  // Toggle Web Audio 43Hz drone
  const handleToggleAudio = () => {
    if (engineRef.current) {
      const active = engineRef.current.toggleAudio()
      setIsAudioActive(active)
    }
  }

  // Live animated mini equalizer on audio pill
  useEffect(() => {
    let animId: number
    const canvas = eqCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const freqData = new Uint8Array(16)

    const drawEq = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (engineRef.current && isAudioActive) {
        engineRef.current.getAudioFrequencyData(freqData)
      } else {
        freqData.fill(0)
      }

      const barCount = 6
      const barWidth = 3
      const gap = 2

      for (let i = 0; i < barCount; i++) {
        let val = isAudioActive ? freqData[i * 2] / 255 : 0.15
        if (!isAudioActive) {
          val = 0.15 + 0.1 * Math.sin(performance.now() * 0.003 + i)
        }
        const h = Math.max(2, val * canvas.height)
        const x = i * (barWidth + gap)
        const y = canvas.height - h

        ctx.fillStyle = isAudioActive ? '#38bdf8' : 'rgba(148, 163, 184, 0.4)'
        ctx.fillRect(x, y, barWidth, h)
      }

      animId = requestAnimationFrame(drawEq)
    }

    animId = requestAnimationFrame(drawEq)
    return () => cancelAnimationFrame(animId)
  }, [isAudioActive])

  // Hotkey listener for palettes: Shift+1..4 or P to cycle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return
      if (e.key === 'p' || e.key === 'P') {
        setPaletteIndex((prev) => {
          const next = (prev + 1) % PALETTES.length
          if (engineRef.current) engineRef.current.setPalette(next)
          return next
        })
      }
      if (e.key === 'm' || e.key === 'M') {
        handleToggleAudio()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* Astrometric Observatory Telemetry HUD */}
      <div className="cosmic-hud-layer" aria-hidden="true">
        <div className="cosmic-hud-corner cosmic-hud-tl">
          <span>OBSERVATORY: </span>
          <span className="cosmic-hud-value">PALOMAR-KERR DEEP FIELD</span>
          <br />
          <span>COORDINATES: RA 17h 45m 40s / DEC -29° 00' 28"</span>
        </div>

        <div className="cosmic-hud-corner cosmic-hud-tr">
          <span>KERR METRIC: </span>
          <span className="cosmic-hud-value">a* = 0.940</span>
          <span> // ISCO: </span>
          <span className="cosmic-hud-value">r = 1.42 r_s</span>
          <br />
          <span>HAWKING EVAPORATION: </span>
          <span className="cosmic-hud-value">T_H = 61.7 nK</span>
        </div>

        <div className="cosmic-hud-corner cosmic-hud-bl">
          <span>GRAVITATIONAL TIME DILATION: </span>
          <span className="cosmic-hud-value">γ = 2.45</span>
          <br />
          <span>DOPPLER BEAMING: </span>
          <span className="cosmic-hud-value">z = +0.48 [BLUE-SHIFT LIMB]</span>
        </div>

        <div className="cosmic-hud-corner cosmic-hud-br">
          <span>POLAR JETS: </span>
          <span className="cosmic-hud-value">BLANDFORD-ZNAJEK MHD</span>
          <br />
          <span>HELICAL B-FIELD: </span>
          <span className="cosmic-hud-value">10^8 TESLA // SYNCHROTRON ACTIVE</span>
        </div>
      </div>

      {/* Floating Cosmic Controls Dock: 4 Palettes & Audio Drone Toggle */}
      <div className="cosmic-controls-dock" role="toolbar" aria-label="Cosmic Observatory Controls">
        {/* 4 Selectable Color Palettes */}
        <div className="cosmic-palette-group" title="Select Relativistic Color Palette [Key: P]">
          {PALETTES.map((pal) => (
            <button
              key={pal.id}
              type="button"
              className={`cosmic-palette-btn ${paletteIndex === pal.id ? 'is-active' : ''}`}
              onClick={() => handleSelectPalette(pal.id)}
              aria-pressed={paletteIndex === pal.id}
            >
              <span className="cosmic-swatch-dot" style={{ backgroundColor: pal.accent }} />
              <span>{pal.name}</span>
            </button>
          ))}
        </div>

        {/* 43Hz Sub-bass Gravitational Drone Audio Toggle */}
        <button
          type="button"
          className={`cosmic-audio-btn ${isAudioActive ? 'is-active' : ''}`}
          onClick={handleToggleAudio}
          title="Toggle 43Hz Sub-Bass Gravitational Drone [Key: M]"
          aria-pressed={isAudioActive}
        >
          <canvas ref={eqCanvasRef} width={28} height={12} className="cosmic-audio-eq-canvas" />
          <span>{isAudioActive ? '43Hz AUDIO: ON' : 'AUDIO: OFF'}</span>
        </button>
      </div>

      {/* Main Pinned Scrollytelling Stage */}
      <PinnedScrollyStage
        conceptId={1}
        accentColor={activePalette.accent}
        accentGlow={activePalette.accentGlow}
        secondaryColor={activePalette.secondary}
        renderCanvas={renderCanvas}
        customHeroEyebrow="[ CONCEPT 01 // KERR BLACK HOLE OBSERVATORY ]"
        customHeroLead="Relativistic singularity raymarcher featuring twin helical Blandford-Znajek magnetic tornadoes, multi-ring Keplerian accretion turbulence, and gravitational Einstein arc lensing. Scroll to trigger elastic horizon expansion."
        customEpilogueLead="Orbital singularity stable. Transmission uplink locked on Lagrange point L2. Available for mission-critical autonomous AI systems, distributed routing, and high-performance computing architectures."
      />
    </>
  )
}

export default Concept01Cosmic
