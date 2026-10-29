import { useEffect, useState } from 'react'
import type { CursorMode } from './SmoothCursorFollower'

interface CursorSelectorProps {
  variant?: 'nav' | 'footer'
}

export default function CursorSelector({ variant = 'nav' }: CursorSelectorProps) {
  const [mode, setMode] = useState<CursorMode>(() => {
    if (typeof window === 'undefined') return 'lens'
    try {
      const saved = localStorage.getItem('sirosiu-cursor-mode')
      if (saved === 'reticle' || saved === 'minimal' || saved === 'lens') return saved
    } catch {}
    return 'lens'
  })

  useEffect(() => {
    const onModeChange = (e: Event) => {
      const custom = e as CustomEvent<CursorMode>
      if (custom.detail) setMode(custom.detail)
    }
    window.addEventListener('sirosiu-cursor-mode', onModeChange)
    return () => window.removeEventListener('sirosiu-cursor-mode', onModeChange)
  }, [])

  const setCursorMode = (nextMode: CursorMode) => {
    setMode(nextMode)
    try {
      localStorage.setItem('sirosiu-cursor-mode', nextMode)
    } catch {}
    window.dispatchEvent(new CustomEvent('sirosiu-cursor-mode', { detail: nextMode }))
  }

  const cycleMode = () => {
    const modes: CursorMode[] = ['lens', 'reticle', 'minimal']
    const nextIdx = (modes.indexOf(mode) + 1) % modes.length
    setCursorMode(modes[nextIdx])
  }

  if (variant === 'nav') {
    return (
      <button
        type="button"
        onClick={cycleMode}
        className={`hero-nav-cursor-pill cursor-mode-${mode}`}
        title={`Current cursor: ${mode.toUpperCase()} (Click to cycle)`}
        aria-label={`Current cursor: ${mode}. Click to change.`}
      >
        <span className="cursor-pill-glyph" aria-hidden="true">
          {mode === 'lens' ? '◎' : mode === 'reticle' ? '⌖' : '•'}
        </span>
        <span className="cursor-pill-text">
          <span className="cursor-pill-dim">CURSOR:</span> {mode.toUpperCase()}
        </span>
      </button>
    )
  }

  return (
    <div className="footer-cursor-mode-control" aria-label="Cursor Style Options">
      <span className="footer-control-label">CURSOR ENGINE:</span>
      <div className="cursor-options-pill-group" role="radiogroup">
        {(['lens', 'reticle', 'minimal'] as const).map((m) => {
          const isActive = mode === m
          const glyph = m === 'lens' ? '◎' : m === 'reticle' ? '⌖' : '•'
          return (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setCursorMode(m)}
              className={`cursor-pill-btn ${isActive ? 'is-active' : ''}`}
            >
              <span className="pill-glyph" aria-hidden="true">{glyph}</span>
              <span className="pill-name">{m.toUpperCase()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
