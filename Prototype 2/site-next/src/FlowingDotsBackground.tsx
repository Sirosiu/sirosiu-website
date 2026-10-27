import { useEffect, useRef, useCallback } from 'react'

interface FlowingDotsProps {
  isActive: boolean
  dotColor?: string
  lineColor?: string
  speed?: number
  gridSpacing?: number
}

interface FlowPoint {
  x: number
  y: number
  vx: number
  vy: number
  origX: number
  origY: number
}

export default function FlowingDotsBackground({
  isActive,
  dotColor = '80, 95, 112',
  lineColor = '110, 128, 146',
  speed = 0.0035,
  gridSpacing = 28,
}: FlowingDotsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animIdRef = useRef<number | null>(null)
  const timeRef = useRef<number>(0)
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  })
  const pointsRef = useRef<FlowPoint[]>([])
  const inViewRef = useRef<boolean>(false)

  const noise = (x: number, y: number, t: number): number => {
    const s1 = Math.sin(x * 0.005 + t)
    const s2 = Math.sin(y * 0.005 + t * 0.8)
    const s3 = Math.sin((x + y) * 0.0025 + t * 1.2)
    return (s1 + s2 + s3) / 3
  }

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    const rect = parent.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.max(1, Math.round(rect.width))
    const height = Math.max(1, Math.round(rect.height))

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    // Grid initialization
    const points: FlowPoint[] = []
    const spacing = Math.max(16, gridSpacing)

    for (let x = spacing / 2; x < width; x += spacing) {
      for (let y = spacing / 2; y < height; y += spacing) {
        points.push({
          x,
          y,
          vx: 0,
          vy: 0,
          origX: x,
          origY: y,
        })
      }
    }
    pointsRef.current = points
  }, [gridSpacing])

  useEffect(() => {
    if (!isActive) return

    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    resizeCanvas()

    const onResize = () => resizeCanvas()
    window.addEventListener('resize', onResize)

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
      mouseRef.current.active = true
    }

    const onMouseLeave = () => {
      mouseRef.current.active = false
      mouseRef.current.x = -9999
      mouseRef.current.y = -9999
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)

    // Visibility observer to save CPU when out of view
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        inViewRef.current = entry.isIntersecting
      },
      { threshold: 0.05 }
    )
    observer.observe(container)

    const ctx = canvas.getContext('2d')

    const animate = () => {
      if (inViewRef.current && ctx) {
        timeRef.current += speed
        const t = timeRef.current
        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        const mActive = mouseRef.current.active

        const rect = canvas.getBoundingClientRect()
        const w = rect.width
        const h = rect.height

        ctx.clearRect(0, 0, w, h)

        const points = pointsRef.current
        for (let i = 0; i < points.length; i++) {
          const pt = points[i]

          // Noise angle
          const n = noise(pt.x, pt.y, t)
          const angle = n * Math.PI * 4

          // Flow field vector
          pt.vx += Math.cos(angle) * 0.06
          pt.vy += Math.sin(angle) * 0.06

          // Mouse influence
          if (mActive) {
            const dx = mx - pt.x
            const dy = my - pt.y
            const distSq = dx * dx + dy * dy
            if (distSq < 32400) {
              // 180px radius
              const dist = Math.sqrt(distSq)
              const factor = (1 - dist / 180) * 0.48
              pt.vx -= (dx / (dist || 1)) * factor
              pt.vy -= (dy / (dist || 1)) * factor
            }
          }

          // Damping
          pt.vx *= 0.94
          pt.vy *= 0.94

          // Next position
          const nextX = pt.x + pt.vx
          const nextY = pt.y + pt.vy

          // Velocity speed & subtle alpha
          const vSpeed = Math.sqrt(pt.vx * pt.vx + pt.vy * pt.vy)
          const alpha = Math.min(0.28, vSpeed * 2.5 + 0.10)

          // Draw subtle trajectory hairline
          ctx.beginPath()
          ctx.moveTo(pt.x, pt.y)
          ctx.lineTo(nextX, nextY)
          ctx.strokeStyle = `rgba(${lineColor}, ${alpha * 0.5})`
          ctx.lineWidth = 0.8
          ctx.stroke()

          // Draw delicate dot
          ctx.beginPath()
          ctx.arc(nextX, nextY, 1.4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${dotColor}, ${alpha})`
          ctx.fill()

          pt.x = nextX
          pt.y = nextY

          // Soft spring return to origin
          pt.vx += (pt.origX - pt.x) * 0.012
          pt.vy += (pt.origY - pt.y) * 0.012
        }
      }

      animIdRef.current = requestAnimationFrame(animate)
    }

    animIdRef.current = requestAnimationFrame(animate)

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      observer.disconnect()
    }
  }, [isActive, resizeCanvas, speed, dotColor, lineColor])

  if (!isActive) return null

  return (
    <div
      ref={containerRef}
      className="flowing-dots-backdrop"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="flowing-dots-canvas" />
    </div>
  )
}
