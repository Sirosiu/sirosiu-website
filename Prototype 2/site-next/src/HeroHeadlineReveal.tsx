import { useEffect, useState, useRef } from 'react'

export type HeadlineEffect = 'typewriter' | 'editorial-blur' | 'matrix-decode' | 'kinetic-mask'

const MASTER_HEADLINE = 'From silicon gates to autonomous agents.'
const WORDS = MASTER_HEADLINE.split(' ')

interface HeroHeadlineRevealProps {
  onReady?: () => void
}

export default function HeroHeadlineReveal({ onReady }: HeroHeadlineRevealProps) {
  const [effect, setEffect] = useState<HeadlineEffect>(() => {
    if (typeof window === 'undefined') return 'editorial-blur'
    try {
      const saved = localStorage.getItem('sirosiu-headline-effect') as HeadlineEffect
      if (saved === 'typewriter' || saved === 'editorial-blur' || saved === 'matrix-decode' || saved === 'kinetic-mask') {
        return saved
      }
    } catch {}
    return 'editorial-blur'
  })

  // Typewriter state
  const [typedText, setTypedText] = useState('')
  const [isTypingDone, setIsTypingDone] = useState(false)

  // Matrix decode state
  const [decodedText, setDecodedText] = useState('')
  const [isDecodeDone, setIsDecodeDone] = useState(false)

  // Trigger animation key to re-trigger on effect change
  const [animKey, setAnimKey] = useState(0)
  const onReadyCalledRef = useRef(false)

  const notifyReady = () => {
    if (!onReadyCalledRef.current) {
      onReadyCalledRef.current = true
      onReady?.()
    }
  }

  // 1. Typewriter Effect: Types once smoothly, stops, and removes the blinking cursor completely
  useEffect(() => {
    if (effect !== 'typewriter') return

    setTypedText('')
    setIsTypingDone(false)

    let startTime: number | null = null
    let animId: number
    const charDelay = 36 // 36ms per character (~1.48s total)
    const totalChars = MASTER_HEADLINE.length

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const charCount = Math.min(totalChars, Math.floor(elapsed / charDelay))

      setTypedText(MASTER_HEADLINE.slice(0, charCount))

      if (charCount < totalChars) {
        animId = requestAnimationFrame(step)
      } else {
        // Typing is completed: wait 280ms, then remove the blinking caret completely
        window.setTimeout(() => {
          setIsTypingDone(true)
          notifyReady()
        }, 280)
      }
    }

    animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [effect, animKey])

  // 2. Matrix Opcode Decode Effect: Alphanumeric hardware scramble resolving left-to-right
  useEffect(() => {
    if (effect !== 'matrix-decode') return

    setDecodedText('')
    setIsDecodeDone(false)
    const glyphs = '01010101XYZRV32IGEMM0x80F4A9'
    let startTime: number | null = null
    let animId: number
    const duration = 1350 // 1.35s total resolve time

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min(1, (timestamp - startTime) / duration)
      const solvedCount = Math.floor(progress * MASTER_HEADLINE.length)

      const scrambled = MASTER_HEADLINE.split('')
        .map((char, idx) => {
          if (char === ' ') return ' '
          if (idx < solvedCount) return MASTER_HEADLINE[idx]
          return glyphs[Math.floor(Math.random() * glyphs.length)]
        })
        .join('')

      setDecodedText(scrambled)

      if (progress < 1) {
        animId = requestAnimationFrame(step)
      } else {
        setDecodedText(MASTER_HEADLINE)
        setIsDecodeDone(true)
        notifyReady()
      }
    }

    animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [effect, animKey])

  // For Editorial Blur & Kinetic Mask, notify ready after entrance
  useEffect(() => {
    if (effect === 'editorial-blur' || effect === 'kinetic-mask') {
      const timer = window.setTimeout(() => {
        notifyReady()
      }, 700)
      return () => window.clearTimeout(timer)
    }
  }, [effect, animKey])

  const pillRefs = useRef<(HTMLButtonElement | null)[]>([])
  const EFFECTS: HeadlineEffect[] = ['typewriter', 'editorial-blur', 'matrix-decode', 'kinetic-mask']

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        nextIndex = (index + 1) % EFFECTS.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        nextIndex = (index - 1 + EFFECTS.length) % EFFECTS.length
        break
      case 'Home':
        e.preventDefault()
        nextIndex = 0
        break
      case 'End':
        e.preventDefault()
        nextIndex = EFFECTS.length - 1
        break
      default:
        break
    }

    if (nextIndex !== null) {
      handleSelectEffect(EFFECTS[nextIndex])
      pillRefs.current[nextIndex]?.focus()
    }
  }

  const handleSelectEffect = (next: HeadlineEffect) => {
    setEffect(next)
    try {
      localStorage.setItem('sirosiu-headline-effect', next)
    } catch {}
    setAnimKey((k) => k + 1)
  }

  return (
    <div className="headline-reveal-wrapper">
      {/* Effect Selector Ribbon (Allows user to test all 4 options live) */}
      <div className="headline-effect-switcher" aria-label="Headline Reveal Animation Options">
        <span className="effect-switcher-label">HEADLINE EFFECT:</span>
        <div className="effect-pills-row" role="tablist" aria-orientation="horizontal">
          <button
            ref={(el) => { pillRefs.current[0] = el }}
            type="button"
            role="tab"
            aria-selected={effect === 'typewriter'}
            tabIndex={effect === 'typewriter' ? 0 : -1}
            onClick={() => handleSelectEffect('typewriter')}
            onKeyDown={(e) => handleKeyDown(e, 0)}
            className={`effect-pill ${effect === 'typewriter' ? 'is-active' : ''}`}
            title="Clean terminal type-in once, then cursor disappears completely"
          >
            1: TYPEWRITER (NO LOOP)
          </button>
          <button
            ref={(el) => { pillRefs.current[1] = el }}
            type="button"
            role="tab"
            aria-selected={effect === 'editorial-blur'}
            tabIndex={effect === 'editorial-blur' ? 0 : -1}
            onClick={() => handleSelectEffect('editorial-blur')}
            onKeyDown={(e) => handleKeyDown(e, 1)}
            className={`effect-pill ${effect === 'editorial-blur' ? 'is-active' : ''}`}
            title="Smooth staggered word blur and upward slide"
          >
            2: EDITORIAL BLUR
          </button>
          <button
            ref={(el) => { pillRefs.current[2] = el }}
            type="button"
            role="tab"
            aria-selected={effect === 'matrix-decode'}
            tabIndex={effect === 'matrix-decode' ? 0 : -1}
            onClick={() => handleSelectEffect('matrix-decode')}
            onKeyDown={(e) => handleKeyDown(e, 2)}
            className={`effect-pill ${effect === 'matrix-decode' ? 'is-active' : ''}`}
            title="Hardware opcode unscramble resolving left-to-right"
          >
            3: SILICON DECODE
          </button>
          <button
            ref={(el) => { pillRefs.current[3] = el }}
            type="button"
            role="tab"
            aria-selected={effect === 'kinetic-mask'}
            tabIndex={effect === 'kinetic-mask' ? 0 : -1}
            onClick={() => handleSelectEffect('kinetic-mask')}
            onKeyDown={(e) => handleKeyDown(e, 3)}
            className={`effect-pill ${effect === 'kinetic-mask' ? 'is-active' : ''}`}
            title="Kinetic mask wipe sliding up from baseline"
          >
            4: KINETIC MASK
          </button>
        </div>
      </div>

      {/* Render Active Headline */}
      <h1 id="hero-title" className={`hero-headline-display effect-${effect}`} key={animKey}>
        {/* OPTION 1: Clean Typewriter with Auto-Removed Caret */}
        {effect === 'typewriter' && (
          <>
            <span>{typedText}</span>
            {/* Caret is visible ONLY while typing; fades out and removes completely when finished */}
            {!isTypingDone && <span className="hero-caret" aria-hidden="true" />}
          </>
        )}

        {/* OPTION 2: Editorial Staggered Word Blur & Lift */}
        {effect === 'editorial-blur' && (
          <span className="editorial-words-line">
            {WORDS.map((word, wIdx) => (
              <span
                key={wIdx}
                className="editorial-blur-word"
                style={{
                  animationDelay: `${wIdx * 90}ms`,
                }}
              >
                {word}
                {wIdx < WORDS.length - 1 ? '\u00A0' : ''}
              </span>
            ))}
          </span>
        )}

        {/* OPTION 3: Silicon Matrix Opcode Decode */}
        {effect === 'matrix-decode' && (
          <span className="matrix-decode-text">
            {decodedText || MASTER_HEADLINE}
            {!isDecodeDone && <span className="decode-glitch-pip" />}
          </span>
        )}

        {/* OPTION 4: Kinetic Baseline Mask Wipe */}
        {effect === 'kinetic-mask' && (
          <span className="kinetic-mask-line">
            {WORDS.map((word, wIdx) => (
              <span key={wIdx} className="kinetic-word-mask">
                <span
                  className="kinetic-word-inner"
                  style={{
                    animationDelay: `${wIdx * 75}ms`,
                  }}
                >
                  {word}
                </span>
                {wIdx < WORDS.length - 1 ? '\u00A0' : ''}
              </span>
            ))}
          </span>
        )}
      </h1>
    </div>
  )
}
