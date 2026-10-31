import React from 'react'
import {
  ARTICLES,
  CAPABILITY_GROUPS,
  CORE_MESSAGING,
  LAB_EXPERIMENTS,
  NOW_FOCUS,
  PORTFOLIO_PROJECTS,
} from '../../data/portfolioData'
import { IconArrowRight, IconArrowUpRight, IconGithub, IconSparkles } from '../../components/icons/Icons'
import { GenerativeCanvas } from './GenerativeCanvas'
import './ExperimentalStyles.css'

export const Concept03Experimental: React.FC = () => {
  return (
    <div className="experimental-viewport" data-concept="experimental">
      {/* Experimental Header */}
      <header className="experimental-header">
        <div className="experimental-container experimental-header-inner">
          <a href="#hero" className="experimental-logo">
            <span>SIROSIU</span>
            <span className="experimental-logo-tag">// EXP.LAB</span>
          </a>
          <nav className="experimental-nav" aria-label="Experimental Navigation">
            <a href="#projects" className="experimental-nav-link">[ WORK ]</a>
            <a href="#lab" className="experimental-nav-link">[ LAB ]</a>
            <a href="#capabilities" className="experimental-nav-link">[ CAPABILITIES ]</a>
            <a href="#manifesto" className="experimental-nav-link">[ MANIFESTO ]</a>
            <a href="#writing" className="experimental-nav-link">[ WRITING ]</a>
            <a href="#now" className="experimental-nav-link">[ NOW ]</a>
            <a href="#contact" className="experimental-nav-link">[ INITIATE ]</a>
          </nav>
          <a href="#contact" className="experimental-btn-neon">
            <IconSparkles size={14} />
            <span>START DIALOGUE</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="experimental-hero">
        <div className="experimental-container">
          <div className="experimental-hero-grid">
            <div>
              <div className="experimental-badge">
                <span>CONCEPT 03 // GENERATIVE SYSTEMS & CODE</span>
              </div>
              <h1 className="experimental-headline">
                <span className="text-gradient">{CORE_MESSAGING.headline}</span>
              </h1>
              <p className="experimental-supporting">{CORE_MESSAGING.supporting}</p>
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                <a href="#projects" className="experimental-btn-neon" style={{ padding: '0.8rem 1.75rem' }}>
                  <span>Explore Experiments</span>
                  <IconArrowRight size={16} />
                </a>
                <a
                  href="#manifesto"
                  className="experimental-nav-link"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.8rem 1rem' }}
                >
                  <span>Read Studio Manifesto</span>
                  <IconArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Generative Interactive Canvas */}
            <GenerativeCanvas />
          </div>
        </div>
      </section>

      {/* Interactive Projects */}
      <section id="projects" className="experimental-section">
        <div className="experimental-container">
          <div className="experimental-section-head">
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--ex-lime)' }}>
                // PHASE 01 — DEPLOYED SYSTEMS
              </span>
              <h2 className="experimental-section-title">Visual Experiments & Works</h2>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--ex-text-muted)' }}>
              [ 06 CASE ARTIFACTS ]
            </span>
          </div>

          <div className="experimental-projects-grid">
            {PORTFOLIO_PROJECTS.map((p) => (
              <article key={p.id} className="experimental-card">
                <div className="experimental-card-tag">
                  {p.domainCode} • {p.status.toUpperCase()}
                </div>
                <h3 className="experimental-card-title">{p.title}</h3>
                <p className="experimental-card-desc">{p.tagline}</p>

                <div className="experimental-metrics">
                  {p.metrics.slice(0, 4).map((m, idx) => (
                    <div key={idx} className="experimental-metric-item">
                      <span>{m.label}</span>
                      <span>{m.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {p.tags.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.7rem',
                          fontFamily: 'JetBrains Mono, monospace',
                          color: 'var(--ex-text-muted)',
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="experimental-btn-neon"
                    style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem' }}
                  >
                    <span>SOURCE</span>
                    <IconArrowUpRight size={12} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Lab / Generative Explorations */}
      <section id="lab" className="experimental-section">
        <div className="experimental-container">
          <div className="experimental-section-head">
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--ex-coral)' }}>
                // PHASE 02 — THE INCUBATOR
              </span>
              <h2 className="experimental-section-title">Lab Explorations</h2>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--ex-text-muted)' }}>
              [ COMPUTATIONAL TOYS & BENCHES ]
            </span>
          </div>

          <div className="experimental-lab-grid">
            {LAB_EXPERIMENTS.map((exp) => (
              <div key={exp.id} className="experimental-lab-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--ex-cobalt)' }}>
                  <span>{exp.index}</span>
                  <span>{exp.status}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{exp.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--ex-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {exp.description}
                </p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {exp.tech.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.7rem',
                        fontFamily: 'JetBrains Mono, monospace',
                        padding: '0.2rem 0.5rem',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.25)',
                        borderRadius: '3px',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="experimental-section">
        <div className="experimental-container">
          <div className="experimental-section-head">
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--ex-lime)' }}>
                // PHASE 03 — CAPABILITIES MATRIX
              </span>
              <h2 className="experimental-section-title">Creative & Technical Systems</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {CAPABILITY_GROUPS.map((g) => (
              <div
                key={g.code}
                style={{
                  background: 'var(--ex-bg-surface)',
                  padding: '2rem',
                  borderRadius: '6px',
                  border: '1px solid var(--ex-border)',
                }}
              >
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--ex-lime)', marginBottom: '0.5rem' }}>
                  {g.code}
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>{g.category}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--ex-text-secondary)', marginBottom: '1.25rem' }}>{g.summary}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {g.skills.map((s, idx) => (
                    <li key={idx} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--ex-text-muted)' }}>
                      <span style={{ color: 'var(--ex-cobalt)', marginRight: '0.5rem' }}>//</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Manifesto / About */}
      <section id="manifesto" className="experimental-section">
        <div className="experimental-container">
          <div className="experimental-section-head">
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--ex-cobalt)' }}>
                // PHASE 04 — STUDIO PHILOSOPHY
              </span>
              <h2 className="experimental-section-title">The Experimental Manifesto</h2>
            </div>
          </div>

          <div className="experimental-manifesto-grid">
            <div>
              <p className="experimental-manifesto-p">
                We believe that the most fertile creative breakthroughs happen when deep engineering
                discipline meets uninhibited computational curiosity.
              </p>
              <p className="experimental-manifesto-p">
                Technology is not just a tool for optimization — it is a reactive medium. From
                synthesizing hardware pipeline hazards to writing real-time GPU particle physics and
                curating localized autonomous agents, we treat code as an active artistic canvas.
              </p>
              <p className="experimental-manifesto-p">
                We test every assumption, simulate physical boundaries, and deliver works that feel
                alive, intelligent, and unmistakably distinct.
              </p>
            </div>

            <div className="experimental-interactive-box">
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--ex-coral)', display: 'block', marginBottom: '1rem' }}>
                LIVE STUDIO AXIOM
              </span>
              <p style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.4, margin: '0 0 1.5rem 0' }}>
                “Do not merely use technology; probe its edges to discover what it can become.”
              </p>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--ex-text-muted)' }}>
                ANKUSH MALOTHIA // SIROSIU CREATIVE LAB
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Writing / Insights */}
      <section id="writing" className="experimental-section">
        <div className="experimental-container">
          <div className="experimental-section-head">
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--ex-lime)' }}>
                // PHASE 05 — TRANSMISSIONS
              </span>
              <h2 className="experimental-section-title">Writing & Research</h2>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {ARTICLES.map((art) => (
              <a
                key={art.id}
                href={art.link}
                className="experimental-writing-item"
              >
                <div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--ex-lime)', display: 'block', marginBottom: '0.35rem' }}>
                    {art.index} • {art.category}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.35rem 0' }}>{art.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--ex-text-secondary)', margin: 0 }}>{art.summary}</p>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--ex-text-muted)', whiteSpace: 'nowrap' }}>
                  {art.date}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Now Focus */}
      <section id="now" className="experimental-section">
        <div className="experimental-container">
          <div className="experimental-section-head">
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--ex-cobalt)' }}>
                // PHASE 06 — CURRENT SIGNALS
              </span>
              <h2 className="experimental-section-title">Now / Live Endeavors</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {NOW_FOCUS.map((item, idx) => (
              <div key={idx} style={{ background: 'var(--ex-bg-surface)', padding: '1.75rem', border: '1px solid var(--ex-border)', borderRadius: '6px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--ex-lime)', display: 'block', marginBottom: '0.5rem' }}>
                  ACTIVE // {item.tag}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--ex-text-secondary)', lineHeight: 1.6 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Footer */}
      <footer id="contact" className="experimental-footer">
        <div className="experimental-container">
          <div style={{ maxWidth: '640px', marginBottom: '4rem' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--ex-coral)' }}>
              // CONNECT WITH THE STUDIO
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 800, margin: '0.5rem 0 1.25rem 0', wordBreak: 'break-word' }}>
              Initiate an Experimental Collaboration
            </h2>
            <p style={{ color: 'var(--ex-text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Available for technical consulting, custom graphics engines, localized autonomous AI pipelines, and bespoke hardware designs.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="mailto:ankushmalothia@gmail.com" className="experimental-btn-neon" style={{ padding: '0.85rem 1.85rem' }}>
                <span>ankushmalothia@gmail.com</span>
                <IconArrowUpRight size={14} />
              </a>
              <a
                href="https://github.com/Sirosiu"
                target="_blank"
                rel="noopener noreferrer"
                className="experimental-btn-neon"
                style={{ borderColor: 'var(--ex-border)', color: '#fff' }}
              >
                <IconGithub size={16} />
                <span>github.com/Sirosiu</span>
              </a>
            </div>
          </div>

          <div className="experimental-footer-inner">
            <div>
              <span>SIROSIU © 2026 • CONCEPT 03: EXPERIMENTAL / GENERATIVE</span>
            </div>
            <div>
              <span>WEBGL • THREE.JS • REACT 19 • CLOUDFLARE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
