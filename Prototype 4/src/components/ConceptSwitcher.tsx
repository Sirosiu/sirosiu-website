import React, { useEffect, useState } from 'react'
import { CONCEPT_META, ConceptId } from '../data/portfolioData'

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

  // Keyboard shortcut listener: 1, 2, 3, 4, 5
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }
      if (e.key === '1') onSelectConcept(1)
      if (e.key === '2') onSelectConcept(2)
      if (e.key === '3') onSelectConcept(3)
      if (e.key === '4') onSelectConcept(4)
      if (e.key === '5') onSelectConcept(5)
      if (e.key === 'i' || e.key === 'I' || (e.key === 'Escape' && showInfo)) {
        setShowInfo((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSelectConcept, showInfo])

  const conceptsList: ConceptId[] = [1, 2, 3, 4, 5]

  return (
    <>
      <header className="p4-switcher-bar" role="region" aria-label="Prototype 4 Concept Controller">
        <div className="p4-switcher-container">
          {/* Brand & Active Pill */}
          <div className="p4-switcher-left">
            <span className="p4-switcher-brand">SIROSIU</span>
            <span className="p4-switcher-divider">/</span>
            <span className="p4-switcher-tag">PROTOTYPE 4</span>
            <span className="p4-switcher-active-pill">
              {currentMeta.number} // {currentMeta.name.toUpperCase()}
            </span>
          </div>

          {/* Switcher Buttons */}
          <nav className="p4-switcher-nav" aria-label="5 Scroll-Driven Concepts">
            {conceptsList.map((id) => {
              const meta = CONCEPT_META[id]
              const isActive = activeConcept === id
              return (
                <button
                  key={id}
                  type="button"
                  className={`p4-switcher-btn ${isActive ? 'is-active' : ''}`}
                  onClick={() => onSelectConcept(id)}
                  aria-pressed={isActive}
                  title={`${meta.number}: ${meta.name} — ${meta.personality}`}
                >
                  <span className="p4-btn-num">{meta.number}</span>
                  <span className="p4-btn-name">{meta.name}</span>
                </button>
              )
            })}
          </nav>

          {/* Right Info Button */}
          <div className="p4-switcher-right">
            <button
              type="button"
              className={`p4-info-toggle ${showInfo ? 'is-open' : ''}`}
              onClick={() => setShowInfo((v) => !v)}
              aria-label="Toggle Concept Specifications"
              title="Toggle Concept Details [Key: I]"
            >
              <span>{showInfo ? 'CLOSE [ESC]' : 'SPECS [I]'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Info Drawer Modal */}
      {showInfo && (
        <div className="p4-specs-modal" onClick={() => setShowInfo(false)}>
          <div className="p4-specs-card" onClick={(e) => e.stopPropagation()}>
            <div className="p4-specs-header">
              <div>
                <span className="p4-specs-badge">PROTOTYPE 4 SPECIFICATION</span>
                <h3>5 MINIMAL ELEGANT SCROLL-DRIVEN ARCHITECTURES</h3>
              </div>
              <button
                type="button"
                className="p4-specs-close"
                onClick={() => setShowInfo(false)}
              >
                ✕
              </button>
            </div>

            <div className="p4-specs-grid">
              {conceptsList.map((id) => {
                const meta = CONCEPT_META[id]
                const isActive = activeConcept === id
                return (
                  <div
                    key={id}
                    className={`p4-spec-box ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      onSelectConcept(id)
                      setShowInfo(false)
                    }}
                  >
                    <div className="p4-spec-box-top">
                      <span className="p4-spec-num">{meta.number}</span>
                      <strong className="p4-spec-name">{meta.name}</strong>
                      {isActive && <span className="p4-spec-tag">CURRENT ACTIVE</span>}
                    </div>
                    <p className="p4-spec-personality">{meta.personality}</p>
                    <div className="p4-spec-aesthetic">{meta.aesthetic}</div>
                    <div className="p4-spec-palette">
                      {meta.palette.map((color, idx) => (
                        <span
                          key={idx}
                          className="p4-swatch"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="p4-specs-footer">
              <span>Switch live via numbers <strong>1, 2, 3, 4, 5</strong> or top dock.</span>
              <span>All 5 concepts feature zero horizontal overflow, 60fps locked scroll-to-reveal physics.</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
