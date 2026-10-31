import { useEffect, useRef, useState } from 'react'

export default function EdaPointerController() {
  const reticleRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Only activate for precise pointers (mouse/trackpad), never on touch devices
    const mediaQuery = window.matchMedia('(pointer: fine)')
    setEnabled(mediaQuery.matches)

    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches)
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!enabled) return

    let targetX = window.innerWidth * 0.5
    let targetY = window.innerHeight * 0.5
    let currX = targetX
    let currY = targetY
    let activeTag = ''
    let isHoveringInteractive = false
    let rafId = 0
    let isPointerInside = false

    const root = document.documentElement
    root.classList.add('has-eda-cursor')

    const onMouseMove = (e: MouseEvent) => {
      isPointerInside = true
      targetX = e.clientX
      targetY = e.clientY

      // Update global CSS custom properties for Spotlight 1px border illumination
      root.style.setProperty('--cursor-x', `${targetX}px`)
      root.style.setProperty('--cursor-y', `${targetY}px`)

      // Inspect target lineage for contextual telemetry tag
      const targetEl = e.target as HTMLElement | null
      const tagHolder = targetEl?.closest('[data-eda-tag]')
      const nextTag = tagHolder?.getAttribute('data-eda-tag') || ''

      const interactive = Boolean(
        targetEl?.closest('a, button, input, textarea, select, [role="button"], [role="tab"]')
      )

      if (nextTag !== activeTag || interactive !== isHoveringInteractive) {
        activeTag = nextTag
        isHoveringInteractive = interactive

        if (labelRef.current && reticleRef.current) {
          labelRef.current.textContent = activeTag
          reticleRef.current.classList.toggle('has-telemetry', Boolean(activeTag))
          reticleRef.current.classList.toggle('is-interactive', isHoveringInteractive && !activeTag)
        }
      }
    }

    const onMouseDown = () => {
      reticleRef.current?.classList.add('is-down')
    }

    const onMouseUp = () => {
      reticleRef.current?.classList.remove('is-down')
    }

    const onMouseLeave = () => {
      isPointerInside = false
      if (reticleRef.current) {
        reticleRef.current.style.opacity = '0'
      }
    }

    const onMouseEnter = () => {
      isPointerInside = true
      if (reticleRef.current) {
        reticleRef.current.style.opacity = '1'
      }
    }

    const tick = () => {
      rafId = requestAnimationFrame(tick)
      currX += (targetX - currX) * 0.24
      currY += (targetY - currY) * 0.24

      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${currX}px, ${currY}px, 0)`
        if (isPointerInside) {
          reticleRef.current.style.opacity = '1'
        }
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    rafId = requestAnimationFrame(tick)

    return () => {
      root.classList.remove('has-eda-cursor')
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      cancelAnimationFrame(rafId)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={reticleRef} className="eda-reticle" aria-hidden="true">
      <span className="eda-crosshair">
        <span className="reticle-bracket">[</span>
        <span className="reticle-plus">+</span>
        <span className="reticle-bracket">]</span>
      </span>
      <span ref={labelRef} className="eda-telemetry-tag" />
    </div>
  )
}
