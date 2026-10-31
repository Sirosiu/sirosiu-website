import React, { useState } from 'react'
import { IconArrowUpRight } from '../../components/icons/Icons'

export const EditorialCover: React.FC = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    setTilt({ x: x * 6, y: y * 6 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div
      className="editorial-hero-plate"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)',
      }}
    >
      <div className="editorial-plate-meta">
        <span>COVER PLATE // FOLIO Nº 03</span>
        <span>SIROSIU • AUTUMN 2026</span>
      </div>

      <blockquote className="editorial-plate-quote">
        “We do not simply build software; we construct lasting digital instruments where form reveals structure.”
      </blockquote>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', margin: '2rem 0', borderTop: '1px solid var(--ed-border)', paddingTop: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--ed-ink-muted)', display: 'block' }}>PRIMARY MEDIUM</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>RTL • Shaders • Local AI</span>
        </div>
        <div>
          <span style={{ fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--ed-ink-muted)', display: 'block' }}>EDITORIAL INDEX</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>06 Case Studies</span>
        </div>
      </div>

      <div className="editorial-plate-author">
        <div className="editorial-stamp">S</div>
        <div>
          <strong style={{ display: 'block', fontSize: '0.95rem' }}>SIROSIU EDITORIAL DESK</strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--ed-ink-muted)' }}>Systems Architect & Creative Technologist</span>
        </div>
      </div>
    </div>
  )
}
