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
import { SpatialSculpture } from './SpatialSculpture'
import './SpatialStyles.css'

export const Concept01Spatial: React.FC = () => {
  return (
    <div className="spatial-viewport" data-concept="spatial-precision">
      {/* Navigation */}
      <header className="spatial-header">
        <div className="spatial-container spatial-header-inner">
          <a href="#hero" className="spatial-wordmark">
            <span className="spatial-wordmark-dot" />
            SIROSIU
          </a>
          <nav className="spatial-nav-links" aria-label="Spatial Navigation">
            <a href="#work" className="spatial-nav-link">01. WORK</a>
            <a href="#lab" className="spatial-nav-link">02. LAB</a>
            <a href="#capabilities" className="spatial-nav-link">03. CAPABILITIES</a>
            <a href="#about" className="spatial-nav-link">04. ABOUT</a>
            <a href="#writing" className="spatial-nav-link">05. WRITING</a>
            <a href="#now" className="spatial-nav-link">06. NOW</a>
            <a href="#contact" className="spatial-nav-link">07. CONTACT</a>
          </nav>
          <a href="#contact" className="spatial-cta-btn">
            <span>GET IN TOUCH</span>
            <IconArrowRight size={14} />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="spatial-hero">
        <div className="spatial-container">
          <div className="spatial-hero-grid">
            <div className="spatial-hero-content">
              <div className="spatial-datum-tag">
                <span>[ SPATIAL PRECISION // 01 ]</span>
                <span>•</span>
                <span>SYSTEMS ARCHITECT & APPLIED AI</span>
              </div>
              <h1 className="spatial-headline">{CORE_MESSAGING.headline}</h1>
              <p className="spatial-supporting">{CORE_MESSAGING.supporting}</p>
              <div className="spatial-hero-actions">
                <a href="#work" className="spatial-btn-primary">
                  <span>Explore Selected Work</span>
                  <IconArrowRight size={16} />
                </a>
                <a href="#about" className="spatial-btn-secondary">
                  <span>Engineering Philosophy</span>
                </a>
              </div>
            </div>

            {/* 3D Physical Artifact Sculpture */}
            <div className="spatial-hero-visual">
              <SpatialSculpture />
            </div>
          </div>
        </div>
      </section>

      {/* Selected Projects */}
      <section id="work" className="spatial-section">
        <div className="spatial-container">
          <div className="spatial-section-header">
            <div>
              <span className="spatial-section-eyebrow">// SECTION 01</span>
              <h2 className="spatial-section-title">Selected Projects</h2>
            </div>
            <span className="spatial-section-meta">[ 06 VERIFIED WORKS ]</span>
          </div>

          <div className="spatial-projects-grid">
            {PORTFOLIO_PROJECTS.map((project) => (
              <article key={project.id} className="spatial-card">
                <div className="spatial-card-top">
                  <span className="spatial-card-code">{project.domainCode}</span>
                  <span
                    className={`spatial-card-status ${
                      project.status === 'Built' ? 'is-built' : ''
                    }`}
                  >
                    {project.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="spatial-card-title">{project.title}</h3>
                <p className="spatial-card-desc">{project.tagline}</p>

                <div className="spatial-metrics-row">
                  {project.metrics.slice(0, 4).map((metric, idx) => (
                    <div key={idx} className="spatial-metric-item">
                      <span className="spatial-metric-label">{metric.label}</span>
                      <span className="spatial-metric-val">{metric.value}</span>
                    </div>
                  ))}
                </div>

                <div className="spatial-card-footer">
                  <div className="spatial-tags">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="spatial-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="spatial-link"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <span>CODE</span>
                    <IconArrowUpRight size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Lab / Experiments */}
      <section id="lab" className="spatial-section">
        <div className="spatial-container">
          <div className="spatial-section-header">
            <div>
              <span className="spatial-section-eyebrow">// SECTION 02</span>
              <h2 className="spatial-section-title">Lab & Experiments</h2>
            </div>
            <span className="spatial-section-meta">[ ACTIVE R&D INDEX ]</span>
          </div>

          <div className="spatial-lab-grid">
            {LAB_EXPERIMENTS.map((exp) => (
              <div key={exp.id} className="spatial-lab-card">
                <div className="spatial-lab-top">
                  <span>{exp.index}</span>
                  <span>{exp.category}</span>
                </div>
                <h3 className="spatial-lab-title">{exp.title}</h3>
                <p className="spatial-lab-desc">{exp.description}</p>
                <div className="spatial-tags">
                  {exp.tech.map((t, idx) => (
                    <span key={idx} className="spatial-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Capabilities */}
      <section id="capabilities" className="spatial-section">
        <div className="spatial-container">
          <div className="spatial-section-header">
            <div>
              <span className="spatial-section-eyebrow">// SECTION 03</span>
              <h2 className="spatial-section-title">Technical Capabilities</h2>
            </div>
            <span className="spatial-section-meta">[ CORE PROFICIENCIES ]</span>
          </div>

          <div className="spatial-capabilities-grid">
            {CAPABILITY_GROUPS.map((grp) => (
              <div key={grp.code} className="spatial-cap-col">
                <h3 className="spatial-cap-cat">{grp.category}</h3>
                <p className="spatial-cap-summary">{grp.summary}</p>
                <ul className="spatial-cap-list">
                  {grp.skills.map((s, idx) => (
                    <li key={idx} className="spatial-cap-item">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="spatial-section">
        <div className="spatial-container">
          <div className="spatial-section-header">
            <div>
              <span className="spatial-section-eyebrow">// SECTION 04</span>
              <h2 className="spatial-section-title">About & Philosophy</h2>
            </div>
            <span className="spatial-section-meta">[ CREATIVE ENGINEERING ]</span>
          </div>

          <div className="spatial-about-grid">
            <div className="spatial-manifesto-text">
              <p>
                SIROSIU operates at the tangible intersection where low-level physical computation,
                microarchitectural logic, and modern autonomous intelligence converge.
              </p>
              <p>
                I believe in disciplined engineering: writing cycle-accurate RTL, modeling
                electromagnetic fields from Maxwell’s equations, and orchestrating local neural
                runtimes that respect user sovereignty and privacy.
              </p>
              <p>
                Every project is an artifact built to withstand scrutiny: tested against compliance
                suites, measured in nanoseconds and millivolts, and presented with dimensional
                clarity.
              </p>
            </div>

            <div className="spatial-manifesto-box">
              <blockquote className="spatial-manifesto-quote">
                “Building systems that are rigorous in computation and tactile in experience.”
              </blockquote>
              <div className="spatial-datum-tag" style={{ margin: 0 }}>
                LOCATION: NEW DELHI, INDIA // REMOTE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Writing / Insights */}
      <section id="writing" className="spatial-section">
        <div className="spatial-container">
          <div className="spatial-section-header">
            <div>
              <span className="spatial-section-eyebrow">// SECTION 05</span>
              <h2 className="spatial-section-title">Writing & Insights</h2>
            </div>
            <span className="spatial-section-meta">[ 03 ESSAYS ]</span>
          </div>

          <div className="spatial-writing-list">
            {ARTICLES.map((art) => (
              <a key={art.id} href={art.link} className="spatial-writing-item">
                <div className="spatial-writing-left">
                  <span className="spatial-writing-idx">{art.index}</span>
                  <div>
                    <h3 className="spatial-writing-title">{art.title}</h3>
                    <p className="spatial-card-desc" style={{ margin: '0.4rem 0 0', fontSize: '0.875rem' }}>
                      {art.summary}
                    </p>
                  </div>
                </div>
                <div className="spatial-writing-meta">
                  <span>{art.date}</span> • <span>{art.readTime}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Now Section */}
      <section id="now" className="spatial-section">
        <div className="spatial-container">
          <div className="spatial-section-header">
            <div>
              <span className="spatial-section-eyebrow">// SECTION 06</span>
              <h2 className="spatial-section-title">Now / Current Focus</h2>
            </div>
            <span className="spatial-section-meta">[ OCT 2026 LOG ]</span>
          </div>

          <div className="spatial-contact-grid">
            <div className="spatial-now-card">
              {NOW_FOCUS.map((item, idx) => (
                <div key={idx} className="spatial-now-item">
                  <div className="spatial-now-head">
                    <span>{item.title}</span>
                    <span className="spatial-now-tag">{item.tag}</span>
                  </div>
                  <p className="spatial-now-desc">{item.description}</p>
                </div>
              ))}
            </div>

            <div id="contact" className="spatial-now-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 700 }}>
                Initiate Inquiry
              </h3>
              <p style={{ color: 'var(--sp-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Open for collaborative systems research, autonomous agent architectures, and high-performance hardware-software co-design.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a
                  href="mailto:ankushmalothia@gmail.com"
                  className="spatial-btn-primary"
                  style={{ justifyContent: 'center' }}
                >
                  <span>ankushmalothia@gmail.com</span>
                  <IconArrowUpRight size={15} />
                </a>
                <a
                  href="https://github.com/Sirosiu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spatial-btn-secondary"
                  style={{ justifyContent: 'center' }}
                >
                  <IconGithub size={16} />
                  <span>github.com/Sirosiu</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="spatial-footer">
        <div className="spatial-container spatial-footer-inner">
          <div>
            <span>SIROSIU © 2026 // SPATIAL PRECISION EXPLORATION</span>
          </div>
          <div>
            <span>CLOUDFLARE WORKERS • THREE.JS • REACT 19</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
