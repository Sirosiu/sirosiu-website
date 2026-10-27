import { useEffect, useRef, useState } from 'react'

type TrailNode = { x: number; y: number; vx: number; vy: number }
type Trail = { spring: number; friction: number; nodes: TrailNode[] }

const TRAIL_COUNT = 20
const NODE_COUNT = 50

function createTrails(x: number, y: number): Trail[] {
  return Array.from({ length: TRAIL_COUNT }, (_, index) => ({
    spring: 0.4 + (index / TRAIL_COUNT) * 0.025,
    friction: 0.498 + Math.random() * 0.01,
    nodes: Array.from({ length: NODE_COUNT }, () => ({ x, y, vx: 0, vy: 0 })),
  }))
}

export default function CanvasCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [motionAllowed, setMotionAllowed] = useState(true)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setMotionAllowed(!preference.matches)
    updatePreference()
    preference.addEventListener('change', updatePreference)
    return () => preference.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    if (!motionAllowed) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: true, desynchronized: true })
    if (!canvas || !ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let active = false
    let pointerInside = false
    let pointerX = -100
    let pointerY = -100
    let huePhase = Math.random() * Math.PI * 2
    let previousFrameAt = 0
    let lastMoveAt = 0
    let trails: Trail[] = []
    const root = document.documentElement

    // Ensure native cursor is suppressed on mount
    root.classList.add('has-canvas-cursor')
    document.body.classList.add('has-canvas-cursor')

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
    }

    const startAt = (x: number, y: number) => {
      pointerX = x
      pointerY = y
      trails = createTrails(x, y)
      active = true
    }

    const drawTrail = (trail: Trail) => {
      const nodes = trail.nodes
      const head = nodes[0]
      head.vx += (pointerX - head.x) * trail.spring
      head.vy += (pointerY - head.y) * trail.spring
      let spring = trail.spring

      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index]
        const previous = nodes[index - 1]

        if (previous) {
          node.vx += (previous.x - node.x) * spring
          node.vy += (previous.y - node.y) * spring
          node.vx += previous.vx * 0.22
          node.vy += previous.vy * 0.22
        }

        node.vx *= trail.friction
        node.vy *= trail.friction
        node.x += node.vx
        node.y += node.vy
        spring *= 0.985
      }

      ctx.beginPath()
      ctx.moveTo(nodes[0].x, nodes[0].y)
      for (let index = 1; index < nodes.length - 1; index += 1) {
        const current = nodes[index]
        const next = nodes[index + 1]
        ctx.quadraticCurveTo(
          current.x,
          current.y,
          (current.x + next.x) * 0.5,
          (current.y + next.y) * 0.5,
        )
      }
      const end = nodes[nodes.length - 1]
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
    }

    const render = (now: number) => {
      frame = 0
      if (!active) return

      const idleFor = now - lastMoveAt

      // Mark the guiding dot as still when pointer has stopped moving
      if (idleFor >= 500 && dotRef.current && pointerInside) {
        dotRef.current.classList.add('is-still')
      }

      // After idle period, clear trail canvas and pause RAF, but guiding dot remains permanently visible
      if (idleFor >= 1400) {
        ctx.clearRect(0, 0, width, height)
        active = false
        return
      }

      const fade = idleFor <= 600 ? 1 : Math.max(0, 1 - (idleFor - 600) / 800)
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      ctx.globalAlpha = fade
      // Higher saturation & lightness for high contrast and vibrant color on both dark and light themes
      ctx.strokeStyle = `hsla(${285 + Math.sin(huePhase) * 85}, 70%, 60%, 0.32)`
      ctx.lineWidth = 1

      for (const trail of trails) drawTrail(trail)

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      const frameScale = previousFrameAt ? Math.min((now - previousFrameAt) / 16.67, 3) : 1
      huePhase += 0.0015 * frameScale
      previousFrameAt = now
      frame = window.requestAnimationFrame(render)
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      pointerInside = true
      pointerX = event.clientX
      pointerY = event.clientY

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`
        dotRef.current.classList.add('is-visible')
        dotRef.current.classList.remove('is-still')

        const target = event.target as Element | null
        const isInteractive = Boolean(
          target?.closest('a, button, [role="button"], input, textarea, select, label'),
        )
        dotRef.current.classList.toggle('is-hovering', isInteractive)
      }

      root.classList.add('has-canvas-cursor')
      document.body.classList.add('has-canvas-cursor')

      if (!active) startAt(pointerX, pointerY)
      lastMoveAt = performance.now()
      schedule()
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      if (dotRef.current) dotRef.current.classList.add('is-pressed')
    }

    const onPointerUp = () => {
      if (dotRef.current) dotRef.current.classList.remove('is-pressed')
    }

    const onBlur = () => {
      pointerInside = false
      if (dotRef.current) {
        dotRef.current.classList.remove('is-visible')
        dotRef.current.classList.remove('is-still')
      }
      root.classList.remove('has-canvas-cursor')
      document.body.classList.remove('has-canvas-cursor')
      if (!active) {
        ctx.clearRect(0, 0, width, height)
        return
      }
      lastMoveAt = performance.now() - 680
      schedule()
    }

    const onPointerLeave = (event: MouseEvent) => {
      // Only remove if exiting the browser window boundaries
      if (
        !event.relatedTarget &&
        (event.clientY <= 0 ||
          event.clientX <= 0 ||
          event.clientX >= window.innerWidth ||
          event.clientY >= window.innerHeight)
      ) {
        onBlur()
      }
    }

    const onScroll = () => {
      if (pointerInside && dotRef.current) {
        const el = document.elementFromPoint(pointerX, pointerY)
        const isInteractive = Boolean(
          el?.closest('a, button, [role="button"], input, textarea, select, label'),
        )
        dotRef.current.classList.toggle('is-hovering', isInteractive)
      }
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        active = false
        pointerInside = false
        if (dotRef.current) {
          dotRef.current.classList.remove('is-visible')
          dotRef.current.classList.remove('is-still')
        }
        root.classList.remove('has-canvas-cursor')
        document.body.classList.remove('has-canvas-cursor')
        if (frame) window.cancelAnimationFrame(frame)
        frame = 0
        ctx.clearRect(0, 0, width, height)
      }
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    document.documentElement.addEventListener('mouseleave', onPointerLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      root.classList.remove('has-canvas-cursor')
      document.body.classList.remove('has-canvas-cursor')
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      document.documentElement.removeEventListener('mouseleave', onPointerLeave)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('blur', onBlur)
      document.addEventListener('visibilitychange', onVisibilityChange)
    }
  }, [motionAllowed])

  if (!motionAllowed) return null

  return (
    <>
      <canvas ref={canvasRef} className="canvas-cursor" aria-hidden="true" />
      <div ref={dotRef} className="canvas-cursor-dot" aria-hidden="true">
        <div className="canvas-cursor-dot-inner" />
        <div className="canvas-cursor-dot-ring" />
      </div>
    </>
  )
}
