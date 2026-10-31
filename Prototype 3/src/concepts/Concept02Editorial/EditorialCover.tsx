import React, { useState } from 'react'
import { IconArrowUpRight } from '../../components/icons/Icons'

export const EditorialCover: React.FC = () => {
  const [activeCitation, setActiveCitation] = useState<number | null>(null)

  return (
    <div className="editorial-cover-stage">
      {/* Halftone Architectural Plate */}
      <div className="editorial-plate-box">
        <div className="editorial-plate-header">
          <span>FIG. 1.04 // ARCHITECTURAL SCHEMATIC PLATE</span>
          <span>FOLIO Nº 03 • 2026</span>
        </div>

        {/* Bespoke SVG Halftone / Architectural Diagram Plate */}
        <div className="editorial-halftone-graphic" aria-hidden="true">
          <svg viewBox="0 0 400 240" className="editorial-plate-svg">
            {/* Grid coordinate lines */}
            <line x1="20" y1="20" x2="380" y2="20" stroke="#18181b" strokeWidth="0.5" strokeDasharray="2 4" />
            <line x1="20" y1="120" x2="380" y2="120" stroke="#18181b" strokeWidth="0.5" strokeDasharray="2 4" />
            <line x1="20" y1="220" x2="380" y2="220" stroke="#18181b" strokeWidth="0.5" strokeDasharray="2 4" />
            <line x1="200" y1="10" x2="200" y2="230" stroke="#c84b31" strokeWidth="0.75" />

            {/* Concentric Geometric Concentric Slabs (Swiss Monograph) */}
            <rect x="50" y="40" width="300" height="150" fill="none" stroke="#18181b" strokeWidth="1.5" />
            <rect x="80" y="60" width="240" height="110" fill="none" stroke="#18181b" strokeWidth="0.75" strokeDasharray="4 4" />
            <rect x="120" y="80" width="160" height="70" fill="rgba(200, 75, 49, 0.08)" stroke="#c84b31" strokeWidth="1" />

            {/* Registration crosshairs */}
            <circle cx="200" cy="115" r="3" fill="#c84b31" />
            <circle cx="200" cy="115" r="28" fill="none" stroke="#c84b31" strokeWidth="0.5" />
            <circle cx="200" cy="115" r="48" fill="none" stroke="#18181b" strokeWidth="0.5" strokeDasharray="1 3" />

            {/* Archival typography inside plate */}
            <text x="56" y="54" fontFamily="JetBrains Mono" fontSize="7" fill="#18181b" letterSpacing="0.1em">DATUM: ELEVATION α</text>
            <text x="286" y="54" fontFamily="JetBrains Mono" fontSize="7" fill="#c84b31" letterSpacing="0.1em">SCALE 1:1.618</text>
            <text x="126" y="118" fontFamily="Newsreader" fontStyle="italic" fontSize="11" fill="#18181b">Silicon Topography</text>
            <text x="56" y="184" fontFamily="JetBrains Mono" fontSize="6.5" fill="#52525b">COORD: 28.6139° N / 77.2090° E</text>
          </svg>
        </div>

        <div className="editorial-plate-caption-table">
          <div className="caption-row">
            <span className="caption-key">PLATE DESIGNATION</span>
            <span className="caption-val">04-TIER COMPUTE TELEMETRY DIE</span>
          </div>
          <div className="caption-row">
            <span className="caption-key">PRIMARY MEDIUM</span>
            <span className="caption-val">RISC-V RTL • GPGPU SHADERS • LOCAL AI</span>
          </div>
          <div className="caption-row">
            <span className="caption-key">ENGRAVING REF</span>
            <span className="caption-val">ZÜRICH—JALANDHAR MONOGRAPH // 2026</span>
          </div>
        </div>
      </div>

      {/* Interactive Citation Notes Drawer */}
      <div className="editorial-citations-block">
        <div className="citations-header">
          <span className="editorial-stamp">S</span>
          <div>
            <strong>EDITORIAL FOOTNOTES</strong>
            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--c2-ink-muted)' }}>
              Hover references below to inspect
            </span>
          </div>
        </div>

        <div className="citations-list">
          <div
            className={`citation-item ${activeCitation === 1 ? 'is-active' : ''}`}
            onMouseEnter={() => setActiveCitation(1)}
            onMouseLeave={() => setActiveCitation(null)}
          >
            <span className="citation-num">[1]</span>
            <p>
              Hardware-Software Symmetry: Digital logic and user interface are treated as two ends of a single continuum.
            </p>
          </div>
          <div
            className={`citation-item ${activeCitation === 2 ? 'is-active' : ''}`}
            onMouseEnter={() => setActiveCitation(2)}
            onMouseLeave={() => setActiveCitation(null)}
          >
            <span className="citation-num">[2]</span>
            <p>
              Local-First Sovereignty: Neural inference executed strictly on edge silicon without telemetry egress.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
