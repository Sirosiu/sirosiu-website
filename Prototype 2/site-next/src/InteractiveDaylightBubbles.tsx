import { useEffect, useRef } from 'react'

interface DaylightBubblesProps {
  isActive: boolean
}

class Bubble {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  maxRadius: number
  life: number
  maxLife: number
  phase: number
  wobbleSpeed: number
  popping: boolean
  popLife: number

  constructor(x: number, y: number, isMicro = false) {
    this.x = x
    this.y = y
    this.phase = Math.random() * Math.PI * 2
    this.wobbleSpeed = 0.04 + Math.random() * 0.05
    this.maxLife = isMicro ? Math.floor(40 + Math.random() * 35) : Math.floor(65 + Math.random() * 75)
    this.life = this.maxLife
    this.radius = isMicro ? 2 + Math.random() * 2 : 4 + Math.random() * 4.5
    this.maxRadius = this.radius * (1.2 + Math.random() * 0.5)
    this.vx = (Math.random() - 0.5) * (isMicro ? 0.7 : 1.2)
    this.vy = -(0.9 + Math.random() * (isMicro ? 0.9 : 1.6))
    this.popping = false
    this.popLife = 6
  }

  update(): boolean {
    if (this.popping) {
      this.popLife--
      this.radius *= 1.15
      return this.popLife > 0
    }

    this.life--
    if (this.life <= 0 || this.y < -30) {
      this.popping = true
      return true
    }

    // Natural buoyancy & air drift
    this.phase += this.wobbleSpeed
    this.x += this.vx + Math.sin(this.phase) * 0.35
    this.y += this.vy
    this.vy -= 0.006 // subtle upward acceleration

    // Smooth growth as air expands
    const expansion = (this.maxRadius - this.radius) * 0.03
    this.radius += expansion

    return true
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = this.popping
      ? (this.popLife / 6) * 0.4
      : Math.min(0.72, (this.life / this.maxLife) * 1.1)

    if (alpha <= 0.01) return

    ctx.save()

    if (this.popping) {
      // Pop ring
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.7})`
      ctx.lineWidth = 0.9
      ctx.stroke()
    } else {
      // Bubble body with soft daylight sky tint
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(224, 242, 254, ${alpha * 0.32})`
      ctx.fill()

      // Iridescent perimeter
      ctx.strokeStyle = `rgba(14, 165, 233, ${alpha * 0.8})`
      ctx.lineWidth = 1.1
      ctx.stroke()

      // Tiny glossy specular highlight reflection
      const hlX = this.x - this.radius * 0.35
      const hlY = this.y - this.radius * 0.35
      const hlR = Math.max(0.8, this.radius * 0.22)
      ctx.beginPath()
      ctx.arc(hlX, hlY, hlR, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.92})`
      ctx.fill()
    }

    ctx.restore()
  }
}

export default function InteractiveDaylightBubbles({ isActive }: DaylightBubblesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const bubblesRef = useRef<Bubble[]>([])
  const animIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    // Spawn bubbles on click within the hero section
    const onClick = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 0.7) return

      const count = 7 + Math.floor(Math.random() * 5)
      for (let i = 0; i < count; i++) {
        const offsetDist = Math.random() * 22
        const offsetAngle = Math.random() * Math.PI * 2
        bubblesRef.current.push(
          new Bubble(
            e.clientX + Math.cos(offsetAngle) * offsetDist,
            e.clientY + Math.sin(offsetAngle) * offsetDist
          )
        )
      }
    }
    window.addEventListener('click', onClick)

    // Clear bubbles when user scrolls down to avoid floating over work section
    const onScroll = () => {
      if (window.scrollY > 80 && bubblesRef.current.length > 0) {
        bubblesRef.current = []
        if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Attach micro-bubble stream on CTA hover
    const interactiveSelectors = [
      '.hero-logo-signature',
      '.hero-nav-talk',
      '.hero-scroll',
      '.hero-portrait-tag',
    ]

    let streamInterval: number | null = null

    const startStream = (el: Element) => {
      if (window.scrollY > window.innerHeight * 0.7) return
      if (streamInterval) clearInterval(streamInterval)
      streamInterval = window.setInterval(() => {
        const rect = el.getBoundingClientRect()
        const x = rect.left + Math.random() * rect.width
        const y = rect.top + Math.random() * rect.height
        bubblesRef.current.push(new Bubble(x, y, true))
      }, 140)
    }

    const stopStream = () => {
      if (streamInterval) {
        clearInterval(streamInterval)
        streamInterval = null
      }
    }

    const attachedElements: Element[] = []
    const setupInteractiveHovers = () => {
      interactiveSelectors.forEach((sel) => {
        const els = document.querySelectorAll(sel)
        els.forEach((el) => {
          attachedElements.push(el)
          el.addEventListener('mouseenter', () => startStream(el))
          el.addEventListener('mouseleave', stopStream)
        })
      })
    }

    const timer = setTimeout(setupInteractiveHovers, 300)

    const animate = () => {
      const list = bubblesRef.current
      if (list.length > 0) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        for (let i = list.length - 1; i >= 0; i--) {
          const b = list[i]
          const alive = b.update()
          if (!alive) {
            list.splice(i, 1)
          } else {
            b.draw(ctx)
          }
        }
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      }

      animIdRef.current = requestAnimationFrame(animate)
    }

    animIdRef.current = requestAnimationFrame(animate)

    return () => {
      clearTimeout(timer)
      stopStream()
      window.removeEventListener('resize', resize)
      window.removeEventListener('click', onClick)
      window.removeEventListener('scroll', onScroll)
      attachedElements.forEach((el) => {
        el.removeEventListener('mouseenter', () => startStream(el))
        el.removeEventListener('mouseleave', stopStream)
      })
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current)
      bubblesRef.current = []
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className="daylight-bubbles-canvas"
      aria-hidden="true"
    />
  )
}
