import { useEffect, useRef, useState, useCallback } from 'react'

export default function HandwrittenSignature() {
  const [progress, setProgress] = useState(0)
  const [isWriting, setIsWriting] = useState(true)
  const [motionAllowed, setMotionAllowed] = useState(true)
  const animFrameRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  // ViewBox coordinates (proportioned for header logo placement)
  const svgWidth = 440
  const svgHeight = 78
  const textStartX = 12
  const textEndX = 418
  const textLength = textEndX - textStartX
  const baseY = 54

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    setMotionAllowed(!preference.matches)
    const update = () => setMotionAllowed(!preference.matches)
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  const startAnimation = useCallback(() => {
    if (!motionAllowed) {
      setProgress(1)
      setIsWriting(false)
      return
    }

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    setProgress(0)
    setIsWriting(true)
    startTimeRef.current = 0

    const duration = 2400 // 2.4 seconds smooth handwriting flow

    const animate = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time
      const elapsed = time - startTimeRef.current
      const rawT = Math.min(elapsed / duration, 1)

      // Smooth handwriting easing: gentle start, steady flow, clean finish
      const easedT =
        rawT < 0.5
          ? 4 * rawT * rawT * rawT
          : 1 - Math.pow(-2 * rawT + 2, 3) / 2

      setProgress(easedT)

      if (rawT < 1) {
        animFrameRef.current = requestAnimationFrame(animate)
      } else {
        // As soon as the name is finished, immediately turn off writing mode so no blur box or trailing artifacts linger
        setProgress(1)
        setIsWriting(false)
      }
    }

    const startTimeout = window.setTimeout(() => {
      animFrameRef.current = requestAnimationFrame(animate)
    }, 120)

    return () => window.clearTimeout(startTimeout)
  }, [motionAllowed])

  useEffect(() => {
    const cleanup = startAnimation()
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (cleanup) cleanup()
    }
  }, [startAnimation])

  // Current pen tip coordinates
  const tipX = textStartX + progress * textLength
  // Natural subtle wave along cursive baseline
  const tipY = baseY + Math.sin(progress * Math.PI * 6.5) * 4

  // Reveal width for the smooth mask
  const revealWidth = progress >= 1 ? svgWidth + 50 : textStartX + progress * textLength + 6

  return (
    <div
      className="signature-container"
      onClick={startAnimation}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          startAnimation()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Ankush Malothia signature"
      title="Click to replay signature"
    >
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="signature-svg"
        aria-hidden="true"
      >
        <defs>
          {/* Soft blur for pen tip glow only */}
          <filter id="tip-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Mask for progressive left-to-right reveal */}
          <mask id="header-sig-mask">
            <rect
              x="0"
              y="0"
              width={revealWidth}
              height={svgHeight}
              fill="#ffffff"
            />
          </mask>

          {/* Gradient for electric blue trailing wake behind the tip */}
          <linearGradient id="tip-tail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="85%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Base crisp handwritten text */}
        <text
          x={textStartX}
          y={baseY}
          className={`signature-text-base ${!isWriting ? 'is-finished' : ''}`}
          mask={isWriting && progress < 1 ? 'url(#header-sig-mask)' : undefined}
        >
          Ankush Malothia
        </text>

        {/* Glowing electric blue pen tip and trailing wake — ONLY rendered while actively writing */}
        {isWriting && progress > 0.01 && progress < 0.995 && (
          <g className="signature-active-trail">
            {/* Trailing luminous blue brush streak directly behind the tip */}
            <line
              x1={Math.max(textStartX, tipX - 55)}
              y1={tipY}
              x2={tipX}
              y2={tipY}
              stroke="url(#tip-tail-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#tip-glow-filter)"
            />

            {/* Glowing blue pen stylus tip */}
            <g transform={`translate(${tipX}, ${tipY})`}>
              {/* Outer soft blue aura */}
              <circle r="14" fill="rgba(0, 240, 255, 0.25)" filter="blur(4px)" />
              {/* Focused blue flare */}
              <circle r="6" fill="#38bdf8" />
              {/* White-hot stylus core */}
              <circle r="2.2" fill="#ffffff" />
            </g>
          </g>
        )}
      </svg>
    </div>
  )
}
