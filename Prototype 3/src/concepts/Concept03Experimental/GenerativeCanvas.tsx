import React, { useEffect, useRef, useState } from 'react'

interface TelemetryData {
  meanVelocity: string
  vorticity: string
  fps: number
  mode: string
}

export const GenerativeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    meanVelocity: '1.84',
    vorticity: '1.420',
    fps: 60,
    mode: 'HARMONIC CURL (∇·v = 0)',
  })
  const [activePreset, setActivePreset] = useState<'laminar' | 'turbulent' | 'quantum'>('turbulent')
  const modeRef = useRef(activePreset)

  useEffect(() => {
    modeRef.current = activePreset
  }, [activePreset])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const container = canvas.parentElement
    if (!container) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let width = (canvas.width = container.clientWidth || 600)
    let height = (canvas.height = container.clientHeight || 500)

    const PARTICLE_COUNT = 2200
    interface Particle {
      x: number
      y: number
      px: number
      py: number
      speed: number
      life: number
    }
    const particles: Particle[] = []
    const pointer = {
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      active: false,
      isAttracting: false,
    }

    // Fast pseudo-simplex trigonometric harmonic potential field
    function potentialField(x: number, y: number, t: number) {
      const mode = modeRef.current
      if (mode === 'laminar') {
        const s1 = 0.0018
        const s2 = 0.0042
        return (
          Math.sin(x * s1 + t * 0.4) * Math.cos(y * s1 - t * 0.3) +
          0.3 * Math.sin(x * s2 - y * s2 + t * 0.6)
        )
      } else if (mode === 'quantum') {
        const s1 = 0.0045
        const s2 = 0.009
        return (
          Math.sin(x * s1 * 1.5 + t * 1.2) * Math.cos(y * s1 * 0.8 - t * 0.9) +
          0.6 * Math.sin((x + y) * s2 + t * 1.4) +
          0.2 * Math.cos(Math.hypot(x - width / 2, y - height / 2) * 0.015 - t * 2.0)
        )
      } else {
        // Turbulent curl (default)
        const s1 = 0.0028
        const s2 = 0.0065
        return (
          Math.sin(x * s1 + t * 0.7) * Math.cos(y * s1 - t * 0.5) +
          0.5 * Math.sin(x * s2 - y * s2 + t * 1.1)
        )
      }
    }

    // Analytical finite-difference Curl derivation for ∇·v = 0
    function getCurl(x: number, y: number, t: number) {
      const eps = 1.5
      const dPsiDy = (potentialField(x, y + eps, t) - potentialField(x, y - eps, t)) / (2 * eps)
      const dPsiDx = (potentialField(x + eps, y, t) - potentialField(x - eps, y, t)) / (2 * eps)
      const multiplier = modeRef.current === 'laminar' ? 320 : modeRef.current === 'quantum' ? 520 : 420
      return { vx: dPsiDy * multiplier, vy: -dPsiDx * multiplier }
    }

    // Initialize particle cloud
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const px = Math.random() * width
      const py = Math.random() * height
      particles.push({
        x: px,
        y: py,
        px: px,
        py: py,
        speed: 0,
        life: Math.random() * 100,
      })
    }

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const nx = e.clientX - rect.left
      const ny = e.clientY - rect.top
      pointer.vx = (nx - pointer.x) * 0.8
      pointer.vy = (ny - pointer.y) * 0.8
      pointer.x = nx
      pointer.y = ny
      pointer.active = true
    }

    const handlePointerDown = () => {
      pointer.isAttracting = true
    }

    const handlePointerUp = () => {
      pointer.isAttracting = false
    }

    const handlePointerLeave = () => {
      pointer.active = false
      pointer.isAttracting = false
    }

    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('pointerleave', handlePointerLeave)

    const handleResize = () => {
      if (!container) return
      width = canvas.width = container.clientWidth
      height = canvas.height = container.clientHeight
      ctx.fillStyle = '#080811'
      ctx.fillRect(0, 0, width, height)
    }

    window.addEventListener('resize', handleResize)

    let t = 0
    let reqId: number
    let lastTime = performance.now()
    let frameCount = 0
    let currentFps = 60

    // Initial background wipe
    ctx.fillStyle = '#080811'
    ctx.fillRect(0, 0, width, height)

    function step(now: number) {
      reqId = requestAnimationFrame(step)
      if (!ctx) return
      t += 0.012

      // FPS Calculation
      frameCount++
      if (now - lastTime >= 1000) {
        currentFps = frameCount
        frameCount = 0
        lastTime = now
      }

      // Trail decay in deep midnight abyss (#080811) with frame accumulation persistence
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(8, 8, 17, 0.08)'
      ctx.fillRect(0, 0, width, height)

      // Additive bloom for intersecting kinetic trajectories
      ctx.globalCompositeOperation = 'lighter'
      let totalEnergy = 0

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i]
        p.px = p.x
        p.py = p.y

        const curl = getCurl(p.x, p.y, t)
        let vx = curl.vx
        let vy = curl.vy

        // Cursor Vortex Singularity
        if (pointer.active) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const distSq = dx * dx + dy * dy
          const radiusSq = pointer.isAttracting ? 90000 : 48000
          if (distSq < radiusSq && distSq > 4) {
            const force = (1 - distSq / radiusSq) * (pointer.isAttracting ? 7.5 : 4.5)
            if (pointer.isAttracting) {
              // Gravitational attraction well + tight spin
              vx += (-dx * 0.08 - dy * 0.06) * force
              vy += (-dy * 0.08 + dx * 0.06) * force
            } else {
              // Tangential swirl + cursor momentum injection
              vx += (-dy * 0.04 + pointer.vx * 0.35) * force
              vy += (dx * 0.04 + pointer.vy * 0.35) * force
            }
          }
        }

        p.x += vx
        p.y += vy
        p.speed = Math.hypot(vx, vy)
        totalEnergy += p.speed

        // Wrap bounds cleanly without sudden discontinuities
        if (p.x < 0) {
          p.x = width
          p.px = width
        } else if (p.x > width) {
          p.x = 0
          p.px = 0
        }
        if (p.y < 0) {
          p.y = height
          p.py = height
        } else if (p.y > height) {
          p.y = 0
          p.py = 0
        }

        // Velocity-mapped Chromatic Dispersion
        if (p.speed > 3.2) {
          // High kinetic energy: Acid Lime (#a3e635) + Coral (#f43f5e) chromatic sub-pixel split
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.55)'
          ctx.lineWidth = 1.2
          ctx.beginPath()
          ctx.moveTo(p.px - 1.2, p.py)
          ctx.lineTo(p.x - 1.2, p.y)
          ctx.stroke()

          ctx.strokeStyle = 'rgba(163, 230, 53, 0.85)'
          ctx.lineWidth = 1.4
          ctx.beginPath()
          ctx.moveTo(p.px, p.py)
          ctx.lineTo(p.x, p.y)
          ctx.stroke()
        } else {
          // Laminar flow: Electric Cobalt (#3b82f6)
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.42)'
          ctx.lineWidth = 1.0
          ctx.beginPath()
          ctx.moveTo(p.px, p.py)
          ctx.lineTo(p.x, p.y)
          ctx.stroke()
        }
      }

      pointer.vx *= 0.88
      pointer.vy *= 0.88

      // Throttled live telemetry state update
      if (Math.random() < 0.12) {
        const meanV = totalEnergy / PARTICLE_COUNT
        const vort = Math.hypot(pointer.vx, pointer.vy) * 0.12 + (modeRef.current === 'quantum' ? 2.14 : 1.42)
        setTelemetry({
          meanVelocity: meanV.toFixed(2),
          vorticity: vort.toFixed(3),
          fps: currentFps,
          mode:
            modeRef.current === 'laminar'
              ? 'LAMINAR HARMONIC'
              : modeRef.current === 'quantum'
              ? 'QUANTUM SINGULARITY'
              : 'DIVERGENCE-FREE CURL (∇·v = 0)',
        })
      }
    }

    reqId = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(reqId)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="experimental-canvas-container" aria-label="Interactive Divergence-Free Curl Noise Fluid Advection Engine">
      <canvas ref={canvasRef} className="experimental-canvas-target" />

      {/* Top HUD Telemetry Bar */}
      <div className="experimental-canvas-top-bar">
        <div className="ex-hud-indicator">
          <span className="ex-hud-dot" />
          <span className="ex-hud-status">ADVECTION ENGINE // LIVE</span>
        </div>
        <div className="ex-hud-mode-pills">
          <button
            type="button"
            className={`ex-mode-btn ${activePreset === 'laminar' ? 'active' : ''}`}
            onClick={() => setActivePreset('laminar')}
          >
            LAMINAR
          </button>
          <button
            type="button"
            className={`ex-mode-btn ${activePreset === 'turbulent' ? 'active' : ''}`}
            onClick={() => setActivePreset('turbulent')}
          >
            TURBULENT
          </button>
          <button
            type="button"
            className={`ex-mode-btn ${activePreset === 'quantum' ? 'active' : ''}`}
            onClick={() => setActivePreset('quantum')}
          >
            QUANTUM
          </button>
        </div>
      </div>

      {/* Floating HUD Telemetry Matrix */}
      <div className="experimental-canvas-hud">
        <div className="ex-telemetry-col">
          <span className="ex-hud-label">SIMULATION SPEC</span>
          <span className="ex-hud-value">2,200 FILAMENTS • {telemetry.mode}</span>
        </div>
        <div className="ex-telemetry-metrics">
          <div className="ex-metric-cell">
            <span className="ex-metric-label">MEAN VELOCITY</span>
            <span className="ex-metric-num">{telemetry.meanVelocity} px/f</span>
          </div>
          <div className="ex-metric-cell">
            <span className="ex-metric-label">VORTICITY ω</span>
            <span className="ex-metric-num">{telemetry.vorticity} rad/s</span>
          </div>
          <div className="ex-metric-cell">
            <span className="ex-metric-label">THROUGHPUT</span>
            <span className="ex-metric-num">{telemetry.fps} FPS</span>
          </div>
        </div>
      </div>

      {/* Interaction Instruction Overlay */}
      <div className="ex-interaction-hint">
        <span>POINTER TO INJECT VORTEX • HOLD CLICK FOR GRAVITATIONAL SINK</span>
      </div>

      {/* Watermark Signature Stamp */}
      <div className="ex-watermark-stamp">
        SIROSIU // EXPERIMENTAL STUDIO // ADVECTION FIELD v3.4
      </div>
    </div>
  )
}
