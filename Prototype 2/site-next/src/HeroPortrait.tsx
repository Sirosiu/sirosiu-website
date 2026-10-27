import { useEffect, useRef, useState } from 'react'

export default function HeroPortrait() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [motionAllowed, setMotionAllowed] = useState(true)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotionAllowed(!preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!motionAllowed) return

    let targetRotX = 0
    let targetRotY = 0
    let currentRotX = 0
    let currentRotY = 0
    let targetTransX = 0
    let targetTransY = 0
    let currentTransX = 0
    let currentTransY = 0
    let frameId = 0

    const el = containerRef.current
    if (!el) return

    const onPointerMove = (e: MouseEvent | PointerEvent) => {
      const halfW = window.innerWidth / 2
      const halfH = window.innerHeight / 2
      const normX = (e.clientX - halfW) / Math.max(1, halfW)
      const normY = (e.clientY - halfH) / Math.max(1, halfH)

      targetRotY = normX * 8
      targetRotX = -normY * 6
      targetTransX = normX * 10
      targetTransY = normY * 8
    }

    const onMouseLeave = () => {
      targetRotX = 0
      targetRotY = 0
      targetTransX = 0
      targetTransY = 0
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)

    const animate = () => {
      currentRotX += (targetRotX - currentRotX) * 0.08
      currentRotY += (targetRotY - currentRotY) * 0.08
      currentTransX += (targetTransX - currentTransX) * 0.08
      currentTransY += (targetTransY - currentTransY) * 0.08

      if (el) {
        el.style.transform = `perspective(1000px) translate3d(${currentTransX.toFixed(2)}px, ${currentTransY.toFixed(2)}px, 0) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`
      }

      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [motionAllowed])

  return (
    <div className="hero-portrait-stage" aria-label="Portrait of Sirosiu">
      <div ref={containerRef} className="hero-portrait-wrap">
        {/* Silhouette Cut-out in Full Natural Color */}
        <picture className="hero-portrait-picture">
          <source srcSet="/assets/images/sirosiu-portrait.webp" type="image/webp" />
          <img
            src="/assets/images/sirosiu-portrait.png"
            alt="Sirosiu portrait"
            className="hero-portrait-img"
            width={2400}
            height={2389}
            loading="eager"
            decoding="async"
          />
        </picture>

        {/* Subtle decorative editorial badge */}
        <div className="hero-portrait-tag" aria-hidden="true">
          <span className="hero-portrait-dot" />
          <span>SIROSIU</span>
        </div>
      </div>
    </div>
  )
}
