import React from 'react'
import {
  ARTICLES,
  CAPABILITY_GROUPS,
  CORE_MESSAGING,
  LAB_EXPERIMENTS,
  NOW_FOCUS,
  PORTFOLIO_PROJECTS,
} from '../../data/portfolioData'
import { IconArrowRight, IconArrowUpRight, IconGithub } from '../../components/icons/Icons'
import { EditorialCover } from './EditorialCover'
import './EditorialStyles.css'

export const Concept02Editorial: React.FC = () => {
  return (
    <div className="editorial-viewport" data-concept="editorial">
      {/* Editorial Masthead */}
      <header className="editorial-masthead">
        <div className="editorial-container">
          <div className="editorial-masthead-top">
            <span>VOL. 03 // ISSUE 2026</span>
            <span>CREATIVE ENGINEERING & COMPUTATIONAL CRAFT</span>
            <span>SIROSIU.COM</span>
          </div>
          <div className="editorial-masthead-bar">
            <a href="#hero" className="editorial-titlemark">
              SIROSIU <em>Journal</em>
            </a>
            <nav className="editorial-nav-list" aria-label="Editorial Navigation">
              <a href="#features" className="editorial-nav-link">Selected Work</a>
              <a href="#lab" className="editorial-nav-link">Lab</a>
              <a href="#capabilities" className="editorial-nav-link">Capabilities</a>
              <a href="#narrative" className="editorial-nav-link">Narrative</a>
              <a href="#essays" className="editorial-nav-link">Essays</a>
              <a href="#now" className="editorial-nav-link">Now</a>
              <a href="#inquiries" className="editorial-nav-link">Inquiries</a>
            </nav>
            <a href="#inquiries" className="editorial-inquire-btn">
              <span>Initiate Dialogue</span>
              <IconArrowRight size={13} />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="editorial-hero">
        <div className="editorial-container">
          <div className="editorial-issue-badge">
            <span className="editorial-issue-line" />
            <span>FEATURED EDITORIAL ESSAY // CONCEPT 02</span>
          </div>

          <h1 className="editorial-headline-display">
            Building <em>thoughtful experiences</em> at the intersection of technology, engineering, and design.
          </h1>

          <div className="editorial-hero-asymmetric">
            <div className="editorial-supporting-col">
              <p className="editorial-supporting-lead">
                {CORE_MESSAGING.supporting}
              </p>
              <div className="editorial-curator-note">
                <strong>Curatorial Perspective:</strong> Operating across hardware description
                languages, local neural runtimes, high-frequency electromagnetic modeling, and tactile
                browser graphics to transform theoretical abstractions into verifiable software.
              </div>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <a href="#features" className="editorial-inquire-btn" style={{ padding: '0.75rem 1.75rem' }}>
                  <span>Read Feature Stories</span>
                  <IconArrowRight size={14} />
                </a>
                <a href="#narrative" className="editorial-btn-link">
                  <span>About SIROSIU</span>
                </a>
              </div>
            </div>

            <EditorialCover />
          </div>
        </div>
      </section>

      {/* Feature Stories (Selected Work) */}
      <section id="features" className="editorial-section">
        <div className="editorial-container">
          <div className="editorial-section-header">
            <div>
              <span className="editorial-section-tag">CATALOGUE OF WORKS</span>
              <h2 className="editorial-section-title">Selected Case Studies</h2>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--ed-ink-muted)' }}>
              [ 06 MONOGRAPHS ]
            </span>
          </div>

          <div className="editorial-stories">
            {PORTFOLIO_PROJECTS.map((proj) => (
              <article key={proj.id} className="editorial-story">
                <div className="editorial-story-sidebar">
                  <div className="editorial-story-index">№ {proj.index}</div>
                  <div className="editorial-story-domain">{proj.domain}</div>
                  <div>
                    <span style={{ color: 'var(--ed-ink-muted)' }}>CODE: </span>
                    <strong style={{ color: 'var(--ed-ink)' }}>{proj.domainCode}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--ed-ink-muted)' }}>STATUS: </span>
                    <strong style={{ color: 'var(--ed-accent)' }}>{proj.status}</strong>
                  </div>

                  <div className="editorial-story-metrics">
                    {proj.metrics.slice(0, 3).map((m, idx) => (
                      <div key={idx} className="editorial-story-metric-item">
                        <span>{m.label}</span>
                        <span className="editorial-story-metric-val">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="editorial-story-content">
                  <h3>{proj.title}</h3>
                  <p className="editorial-story-tagline">{proj.tagline}</p>
                  <p className="editorial-story-body">{proj.summary}</p>
                  <div className="editorial-story-actions">
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-btn-link"
                    >
                      <span>Examine Repository</span>
                      <IconArrowUpRight size={14} />
                    </a>
                    {proj.demoUrl && (
                      <a href={proj.demoUrl} className="editorial-btn-link">
                        <span>Launch Artifact</span>
                        <IconArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Lab / Dispatches */}
      <section id="lab" className="editorial-section">
        <div className="editorial-container">
          <div className="editorial-section-header">
            <div>
              <span className="editorial-section-tag">EXPERIMENTAL DISPATCHES</span>
              <h2 className="editorial-section-title">The Laboratory</h2>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--ed-ink-muted)' }}>
              [ ACTIVE R&D ]
            </span>
          </div>

          <div className="editorial-lab-list">
            {LAB_EXPERIMENTS.map((exp) => (
              <div key={exp.id} className="editorial-lab-item">
                <div className="editorial-lab-meta">
                  <span>{exp.index}</span>
                  <span>{exp.category}</span>
                </div>
                <h3 className="editorial-lab-title">{exp.title}</h3>
                <p className="editorial-lab-desc">{exp.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {exp.tech.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.75rem',
                        fontFamily: 'JetBrains Mono, monospace',
                        background: 'var(--ed-bg-surface-elevated)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '2px',
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

      {/* Narrative / About */}
      <section id="narrative" className="editorial-section">
        <div className="editorial-container">
          <div className="editorial-section-header">
            <div>
              <span className="editorial-section-tag">ENGINEERING PHILOSOPHY</span>
              <h2 className="editorial-section-title">On Craft & Computation</h2>
            </div>
          </div>

          <div className="editorial-narrative-layout">
            <div className="editorial-narrative-text">
              <p className="drop-cap">
                Computation is not an immaterial abstraction; it is a physical craft constrained by
                silicon area, thermal envelopes, propagation delays, and the physics of free space.
              </p>
              <p>
                Too often, contemporary software engineering defaults to layers of bloated
                indirection, obscuring the underlying machines. My philosophy is grounded in
                intellectual rigor: mastering the digital logic beneath the compiler, simulating
                electromagnetics from first principles, and deploying private, localized artificial
                intelligence that serves human intent directly.
              </p>
              <p>
                When engineering is paired with meticulous typography, intentional whitespace, and
                tactile feedback, software ceases to be a mundane utility and becomes an evocative,
                enduring artifact.
              </p>
            </div>

            <div className="editorial-side-col">
              <blockquote className="editorial-pullquote">
                “True craft is the quiet refusal to conceal poor foundations beneath superficial veneer.”
              </blockquote>
              <div style={{ fontSize: '0.85rem', color: 'var(--ed-ink-secondary)', lineHeight: 1.6 }}>
                <strong>Ankush Malothia (Sirosiu)</strong> is a systems architect and creative
                technologist based in New Delhi. Working with founders, research labs, and ambitious
                teams worldwide.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Capabilities */}
      <section id="capabilities" className="editorial-section">
        <div className="editorial-container">
          <div className="editorial-section-header">
            <div>
              <span className="editorial-section-tag">DISCIPLINARY MATRIX</span>
              <h2 className="editorial-section-title">Core Capabilities</h2>
            </div>
          </div>

          <div className="editorial-cap-grid">
            {CAPABILITY_GROUPS.map((grp) => (
              <div key={grp.code} className="editorial-cap-block">
                <h3 className="editorial-cap-title">{grp.category}</h3>
                <p className="editorial-cap-desc">{grp.summary}</p>
                <ul className="editorial-cap-tags">
                  {grp.skills.map((s, idx) => (
                    <li key={idx}>— {s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publication Essays */}
      <section id="essays" className="editorial-section">
        <div className="editorial-container">
          <div className="editorial-section-header">
            <div>
              <span className="editorial-section-tag">PUBLICATIONS & MONOGRAPHS</span>
              <h2 className="editorial-section-title">Writing & Insights</h2>
            </div>
          </div>

          <div>
            {ARTICLES.map((art) => (
              <a key={art.id} href={art.link} className="editorial-writing-row">
                <span className="editorial-article-date">{art.date}</span>
                <div>
                  <h3 className="editorial-article-title">{art.title}</h3>
                  <p className="editorial-article-desc">{art.summary}</p>
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--ed-accent)' }}>
                  {art.readTime}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Now & Inquiries */}
      <section id="now" className="editorial-section">
        <div className="editorial-container">
          <div className="editorial-section-header">
            <div>
              <span className="editorial-section-tag">CONTEMPORARY DISPATCH</span>
              <h2 className="editorial-section-title">Current Endeavors</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {NOW_FOCUS.map((item, idx) => (
              <div key={idx} style={{ background: 'var(--ed-bg-surface)', padding: '2rem', border: '1px solid var(--ed-border)' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--ed-accent)', display: 'block', marginBottom: '0.5rem' }}>
                  {item.tag}
                </span>
                <h3 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--ed-ink-secondary)', lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiries / Contact & Footer */}
      <footer id="inquiries" className="editorial-footer">
        <div className="editorial-container editorial-footer-grid">
          <div>
            <span className="editorial-section-tag">COMMISSIONS & COLLABORATION</span>
            <h2 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '2.5rem', margin: '0.5rem 0 1rem 0' }}>
              Initiate an Editorial Inquiry
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--ed-ink-secondary)', maxWidth: '520px', lineHeight: 1.6, marginBottom: '2rem' }}>
              Open for advisory roles, custom hardware accelerator explorations, and specialized AI systems engineering.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="mailto:ankushmalothia@gmail.com"
                className="editorial-inquire-btn"
                style={{ padding: '0.85rem 1.85rem' }}
              >
                <span>ankushmalothia@gmail.com</span>
                <IconArrowUpRight size={15} />
              </a>
              <a
                href="https://github.com/Sirosiu"
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-inquire-btn"
                style={{ background: 'transparent', color: 'var(--ed-ink)', border: '1px solid var(--ed-ink)' }}
              >
                <IconGithub size={16} />
                <span>github.com/Sirosiu</span>
              </a>
            </div>
          </div>

          <div style={{ borderLeft: '1px solid var(--ed-border)', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>COLOPHON</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--ed-ink-muted)', lineHeight: 1.6 }}>
                Typeset in Newsreader and Inter. Rendered natively on Cloudflare Workers edge runtime.
                Concept 02 explores typography-led editorial storytelling.
              </p>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--ed-ink-muted)' }}>
              SIROSIU © MMXXVI • ALL RIGHTS RESERVED
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
