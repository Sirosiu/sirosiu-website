import { useEffect, useRef, useState } from 'react'

export default function SmoothCursorFollower() {
  const followerRef = useRef<HTMLDivElement>(null)
  const leadRef = useRef<HTMLDivElement>(null)
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
    let isStill = true
    let lastMoveTime = performance.now()
    let frameId = 0

    const followerEl = followerRef.current
    const leadEl = leadRef.current

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      lastMoveTime = performance.now()
      isStill = false

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
        target && target.closest('a, button, [role="button"], input, textarea, select, .hero-sandbox-badge')
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

    // Physics update loop
    const animate = () => {
      if (isVisible && followerEl && leadEl) {
        // Immediate positioning for lead point
        leadEl.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`

        // Spring lag physics for follower
        const dx = targetX - followerX
        const dy = targetY - followerY
        const ease = isHovering ? 0.22 : 0.16
        followerX += dx * ease
        followerY += dy * ease

        const speed = Math.hypot(dx, dy)
        const now = performance.now()

        // Check still state
        if (speed < 0.25 && now - lastMoveTime > 90) {
          if (!isStill) {
            isStill = true
            followerEl.classList.add('is-still')
          }
        } else {
          if (isStill) {
            isStill = false
            followerEl.classList.remove('is-still')
          }
        }

        // Dynamic velocity stretch & rotation (the signature Smooth Follower effect)
        let angle = 0
        let stretch = 1.0
        let squeeze = 1.0

        if (!isHovering && !isStill && speed > 1.2) {
          angle = Math.atan2(dy, dx)
          stretch = Math.min(1.0 + speed * 0.016, 1.65)
          squeeze = 1.0 / Math.sqrt(stretch)
        }

        const scaleModifier = isMouseDown ? 0.75 : 1.0
        followerEl.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) rotate(${angle}rad) scale(${stretch * scaleModifier}, ${squeeze * scaleModifier})`
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
      {/* Central Lead Point (Immediate track with zero lag) */}
      <div ref={leadRef} className="smooth-cursor-lead" aria-hidden="true">
        <div className="smooth-cursor-lead-dot" />
      </div>

      {/* Smooth Follower (Physics trailing ring with velocity stretch & magnetic hover) */}
      <div ref={followerRef} className="smooth-cursor-follower" aria-hidden="true">
        <div className="smooth-cursor-follower-ring" />
        <div className="smooth-cursor-follower-glow" />
      </div>
    </>
  )
}
