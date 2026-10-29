import { useEffect, useRef, useState } from 'react'

export type CursorMode = 'lens' | 'reticle' | 'minimal'

export default function SmoothCursorFollower() {
  const followerRef = useRef<HTMLDivElement>(null)
  const leadRef = useRef<HTMLDivElement>(null)
  const [motionAllowed, setMotionAllowed] = useState(true)
  const [mode, setMode] = useState<CursorMode>(() => {
    if (typeof window === 'undefined') return 'lens'
    try {
      const saved = localStorage.getItem('sirosiu-cursor-mode')
      if (saved === 'reticle' || saved === 'minimal' || saved === 'lens') return saved
    } catch {}
    return 'lens'
  })

  // Listen for external mode changes
  useEffect(() => {
    const onModeChange = (e: Event) => {
      const custom = e as CustomEvent<CursorMode>
      if (custom.detail) setMode(custom.detail)
    }
    window.addEventListener('sirosiu-cursor-mode', onModeChange)
    return () => window.removeEventListener('sirosiu-cursor-mode', onModeChange)
  }, [])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setMotionAllowed(!preference.matches)
    updatePreference()
    preference.addEventListener('change', updatePreference)
    return () => preference.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    if (!motionAllowed) return

    const root = document.documentElement
    root.classList.add('has-smooth-cursor')
    document.body.classList.add('has-smooth-cursor')

    let targetX = -100
    let targetY = -100
    let followerX = -100
    let followerY = -100
    let isVisible = false
    let isHovering = false
    let isMouseDown = false
    let frameId = 0

    const followerEl = followerRef.current
    const leadEl = leadRef.current

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY

      if (!isVisible) {
        isVisible = true
        followerX = targetX
        followerY = targetY
        if (followerEl) followerEl.classList.add('is-visible')
        if (leadEl) leadEl.classList.add('is-visible')
      }

      // Check if hovering interactive target
      const target = e.target as HTMLElement | null
      const interactive = Boolean(
        target &&
          target.closest(
            'a, button, [role="button"], input, textarea, select, .ic-chip-unit, .home-project-card, .skill-pillar-card, .experience-card'
          )
      )

      if (interactive !== isHovering) {
        isHovering = interactive
        if (followerEl) {
          followerEl.classList.toggle('is-hovering', isHovering)
        }
        if (leadEl) {
          leadEl.classList.toggle('is-hovering', isHovering)
        }
      }
    }

    const onPointerDown = () => {
      isMouseDown = true
      if (followerEl) followerEl.classList.add('is-pressed')
      if (leadEl) leadEl.classList.add('is-pressed')
    }

    const onPointerUp = () => {
      isMouseDown = false
      if (followerEl) followerEl.classList.remove('is-pressed')
      if (leadEl) leadEl.classList.remove('is-pressed')
    }

    const onMouseLeave = () => {
      isVisible = false
      if (followerEl) followerEl.classList.remove('is-visible')
      if (leadEl) leadEl.classList.remove('is-visible')
    }

    const onMouseEnter = () => {
      isVisible = true
      if (followerEl) followerEl.classList.add('is-visible')
      if (leadEl) leadEl.classList.add('is-visible')
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    // Physics update loop: High-fidelity damped tracking without elastic distortion
    const animate = () => {
      if (isVisible && followerEl && leadEl) {
        // Zero-lag immediate track for center lead point
        leadEl.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`

        // Tight, responsive spring ease for follower (no sluggish dragging)
        const dx = targetX - followerX
        const dy = targetY - followerY
        const ease = isHovering ? 0.36 : 0.28
        followerX += dx * ease
        followerY += dy * ease

        const scale = isMouseDown ? 0.84 : 1.0
        // Clean translation with subtle press scale — NO awkward stretch/tilt
        followerEl.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) scale(${scale})`
      }

      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      root.classList.remove('has-smooth-cursor')
      document.body.classList.remove('has-smooth-cursor')
    }
  }, [motionAllowed])

  if (!motionAllowed) return null

  return (
    <>
      {/* Central Precision Lead Point (Immediate track, zero lag) */}
      <div ref={leadRef} className={`smooth-cursor-lead cursor-mode-${mode}`} aria-hidden="true">
        <div className="smooth-cursor-lead-dot" />
      </div>

      {/* Follower Aura (Aperture Lens or Hardware Reticle) */}
      {mode !== 'minimal' && (
        <div
          ref={followerRef}
          className={`smooth-cursor-follower cursor-mode-${mode}`}
          aria-hidden="true"
        >
          {mode === 'lens' && (
            <>
              <div className="smooth-cursor-follower-ring" />
              <div className="smooth-cursor-follower-glow" />
            </>
          )}

          {mode === 'reticle' && (
            <div className="smooth-cursor-reticle">
              <span className="reticle-tick tick-tl" />
              <span className="reticle-tick tick-tr" />
              <span className="reticle-tick tick-bl" />
              <span className="reticle-tick tick-br" />
            </div>
          )}
        </div>
      )}
    </>
  )
}
