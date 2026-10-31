import React, { useEffect, useState } from 'react'
import { CONCEPT_META, ConceptId } from '../data/portfolioData'
import { IconInfo } from './icons/Icons'

interface ConceptSwitcherProps {
  activeConcept: ConceptId
  onSelectConcept: (concept: ConceptId) => void
}

export const ConceptSwitcher: React.FC<ConceptSwitcherProps> = ({
  activeConcept,
  onSelectConcept,
}) => {
  const [showInfo, setShowInfo] = useState(false)
  const currentMeta = CONCEPT_META[activeConcept]

  // Keyboard shortcut listener: 1, 2, 3, 4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }
      if (e.key === '1') onSelectConcept(1)
      if (e.key === '2') onSelectConcept(2)
      if (e.key === '3') onSelectConcept(3)
      if (e.key === '4') onSelectConcept(4)
      if (e.key === 'i' || e.key === 'I' || (e.key === 'Escape' && showInfo)) {
        setShowInfo((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSelectConcept, showInfo])

  return (
    <>
      <header className="concept-switcher-bar" role="region" aria-label="Concept Controller">
        <div className="concept-switcher-container">
          {/* Brand & Active Pill */}
          <div className="switcher-meta-group">
            <span className="switcher-brand">SIROSIU</span>
            <span className="switcher-divider">/</span>
            <span className="switcher-prototype-tag">PROTOTYPE 3</span>
            <span className="switcher-pill-badge" data-concept-active={activeConcept}>
              Concept {currentMeta.number}: {currentMeta.name}
            </span>
          </div>

          {/* Switcher Buttons */}
          <nav className="switcher-nav-group" aria-label="Select Concept">
            {([1, 2, 3, 4] as ConceptId[]).map((id) => {
              const meta = CONCEPT_META[id]
              const isActive = activeConcept === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelectConcept(id)}
                  className={`switcher-btn ${isActive ? 'is-active' : ''}`}
                  data-concept-id={id}
                  aria-pressed={isActive}
                  title={`Switch to Concept ${meta.number}: ${meta.name} (Press '${id}')`}
                >
                  <span className="switcher-btn-num">{meta.number}</span>
                  <span className="switcher-btn-name">{meta.name}</span>
                </button>
              )
            })}

            {/* Info / Compare Button */}
            <button
              type="button"
              onClick={() => setShowInfo((prev) => !prev)}
              className={`switcher-info-btn ${showInfo ? 'is-open' : ''}`}
              aria-label="View Concept Comparison Matrix"
              title="Compare all 4 design concepts (Press 'i')"
            >
              <IconInfo size={15} />
              <span className="switcher-info-text">Compare</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Comparison Modal / Sheet */}
      {showInfo && (
        <div
          className="switcher-modal-backdrop"
          onClick={() => setShowInfo(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Concept Exploration Overview"
        >
          <div className="switcher-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">GOOGLE STITCH DESIGN EXPLORATIONS</span>
                <h2 className="modal-title">SIROSIU Prototype 3 — 4 Visual Concepts</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowInfo(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <p className="modal-description">
              Compare all 4 independent design directions exploring the intersection of technology, engineering,
              intelligence, and creative experimentation for <strong>sirosiu.com</strong>.
            </p>

            <div className="modal-grid">
              {([1, 2, 3, 4] as ConceptId[]).map((id) => {
                const meta = CONCEPT_META[id]
                const isActive = activeConcept === id
                return (
                  <div
                    key={id}
                    className={`modal-concept-card ${isActive ? 'is-selected' : ''}`}
                    onClick={() => {
                      onSelectConcept(id)
                      setShowInfo(false)
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onSelectConcept(id)
                        setShowInfo(false)
                      }
                    }}
                  >
                    <div className="card-top">
                      <span className="card-num">0{id}</span>
                      {isActive && <span className="active-tag">CURRENT VIEW</span>}
                    </div>
                    <h3 className="card-name">{meta.name}</h3>
                    <p className="card-personality"><strong>Personality:</strong> {meta.personality}</p>
                    <p className="card-aesthetic">{meta.aesthetic}</p>
                    <div className="palette-swatches">
                      {meta.palette.map((color, idx) => (
                        <span
                          key={idx}
                          className="swatch"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="card-switch-action"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectConcept(id)
                        setShowInfo(false)
                      }}
                    >
                      {isActive ? 'Currently Viewing' : `Switch to Concept ${meta.number}`}
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="modal-footer">
              <span className="keyboard-tip">Tip: Press keys <strong>1</strong>, <strong>2</strong>, <strong>3</strong>, <strong>4</strong> on your keyboard to instantly switch concepts at any time.</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
