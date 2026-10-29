import { useState } from 'react'
import HandwrittenSignature from './HandwrittenSignature'
import ThemeToggleSwitch from './ThemeToggleSwitch'
import InteractiveOceanBackground from './InteractiveOceanBackground'
import InteractiveCloudsBackground from './InteractiveCloudsBackground'
import LiquidGlassBottomNav from './LiquidGlassBottomNav'
import CometCard from './CometCard'
import GlobalSiteFooter from './GlobalSiteFooter'
import { DEMO_PROJECTS, type ProjectItem } from './data/projectsData'

interface ProjectsPageProps {
  navigate: (path: string) => void
  isLight?: boolean
  onToggleTheme?: (isLight: boolean) => void
}

export default function ProjectsPage({
  navigate,
  isLight = false,
  onToggleTheme,
}: ProjectsPageProps) {
  const [activeFilter, setActiveFilter] = useState<string>('ALL')
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)

  const filteredProjects =
    activeFilter === 'ALL'
      ? DEMO_PROJECTS
      : DEMO_PROJECTS.filter((p) => p.domain.toLowerCase().includes(activeFilter.toLowerCase()))

  return (
    <div className="projects-page-root" data-theme={isLight ? 'light' : 'dark'}>
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Dynamic Backgrounds */}
      <div aria-hidden="true">
        <InteractiveOceanBackground isActive={!isLight} />
        <InteractiveCloudsBackground isActive={isLight} />
      </div>

      {/* Banner Landmark: Header */}
      <header className="projects-header" role="banner">
        <a
          href="/"
          className="projects-brand-link"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
          aria-label="Return home - Ankush Malothia"
        >
          <HandwrittenSignature />
        </a>

        <div className="projects-header-center">
          <span className="projects-status-badge">ARCHITECTURAL REPOSITORY</span>
          <span className="projects-divider">//</span>
          <span className="projects-header-title">SELECTED SYSTEMS</span>
        </div>

        <nav className="projects-header-actions" role="navigation" aria-label="Projects navigation">
          {onToggleTheme && (
            <ThemeToggleSwitch isLight={isLight} onToggle={onToggleTheme} />
          )}
          <button
            type="button"
            className="projects-back-btn"
            onClick={() => navigate('/')}
          >
            ← BACK TO HOME
          </button>
        </nav>
      </header>

      {/* Main Content Landmark */}
      <main id="main-content" role="main" tabIndex={-1} className="projects-container">
        {/* Intro Hero */}
        <section className="projects-intro-section">
          <div className="projects-intro-meta">
            <span className="projects-category-pill">01 / REPOSITORY ARCHIVE</span>
            <span className="projects-count">3 PRODUCTION SYSTEMS</span>
          </div>

          <h1 className="projects-main-title">
            From silicon gates<br />to autonomous agents.
          </h1>

          <p className="projects-intro-description">
            High-performance engineering systems across the compute stack—bridging digital logic,
            hardware acceleration, and autonomous intelligence. Explore architectural specifications,
            synthesis metrics, and open source repositories below.
          </p>

          {/* Domain Filter Pills */}
          <div className="projects-filter-bar">
            {['ALL', 'APPLIED AI', 'COMPUTER ARCHITECTURE', 'RF ENGINEERING'].map((filter) => (
              <button
                key={filter}
                type="button"
                className={`projects-filter-btn${activeFilter === filter ? ' is-active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Aceternity Comet 3D Cards Grid */}
        <section className="projects-comet-section" aria-label="Aceternity Comet Cards Grid">
          <div className="comet-grid-container">
            {filteredProjects.map((project) => (
              <CometCard key={project.id} className="comet-card-instance">
                <div className="comet-card-content">
                  {/* Visual Cover Banner with Comet Gradient */}
                  <div
                    className="comet-cover-banner"
                    style={{ background: project.coverGradient }}
                  >
                    <div className="comet-banner-header">
                      <span className="comet-code-tag">{project.domainCode}</span>
                      <span className="comet-status-tag">{project.status}</span>
                    </div>
                    <div className="comet-icon-hero">{project.icon}</div>
                  </div>

                  {/* Card Body */}
                  <div className="comet-card-body">
                    <h3 className="comet-title">{project.title}</h3>
                    <p className="comet-tagline">{project.tagline}</p>

                    {/* Primary Metrics HUD */}
                    <div className="comet-metrics-strip">
                      {project.metrics.slice(0, 3).map((m) => (
                        <div key={m.label} className="comet-metric-item">
                          <span className="comet-metric-k">{m.label}</span>
                          <span className="comet-metric-v">{m.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="comet-tags-row">
                      {project.tags.slice(0, 4).map((t) => (
                        <span key={t} className="comet-tag-badge">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Interactive Buttons */}
                    <div className="comet-card-footer">
                      <button
                        type="button"
                        className="comet-action-details"
                        onClick={() => setSelectedProject(project)}
                      >
                        SPEC DETAILS
                      </button>
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="comet-action-repo"
                      >
                        REPO ↗
                      </a>
                    </div>
                  </div>
                </div>
              </CometCard>
            ))}
          </div>
        </section>
      </main>

      {/* ============================================================== */}
      {/* TECHNICAL SPEC SHEET MODAL / DRAWER                            */}
      {/* ============================================================== */}
      {selectedProject && (
        <div
          className="project-modal-backdrop"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="project-modal-surface"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-header-id">
                <span className="modal-code">{selectedProject.domainCode}</span>
                <span className="modal-title">{selectedProject.title}</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedProject(null)}
                aria-label="Close specification"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {/* Summary */}
              <div className="modal-section">
                <h4 className="modal-sec-title">SYSTEM SUMMARY</h4>
                <p className="modal-sec-text">{selectedProject.summary}</p>
              </div>

              {/* Architecture Detail */}
              <div className="modal-section">
                <h4 className="modal-sec-title">ARCHITECTURAL DESIGN</h4>
                <p className="modal-sec-text">{selectedProject.architectureHighlight}</p>
              </div>

              {/* Engineering Metrics */}
              <div className="modal-section">
                <h4 className="modal-sec-title">BENCHMARKS & VERIFIED METRICS</h4>
                <div className="modal-metrics-grid">
                  {selectedProject.metrics.map((m) => (
                    <div key={m.label} className="modal-metric-card">
                      <span className="modal-metric-label">{m.label}</span>
                      <span className="modal-metric-value">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Contributions */}
              <div className="modal-section">
                <h4 className="modal-sec-title">PERSONAL CONTRIBUTIONS</h4>
                <ul className="modal-bullets">
                  {selectedProject.contributions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Outcomes */}
              <div className="modal-section">
                <h4 className="modal-sec-title">MEASURED OUTCOMES</h4>
                <ul className="modal-bullets">
                  {selectedProject.outcomes.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <a
                href={selectedProject.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-action-primary"
              >
                VISIT REPOSITORY ON GITHUB ↗
              </a>
              <button
                type="button"
                className="modal-action-secondary"
                onClick={() => setSelectedProject(null)}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contentinfo Landmark: Global Engineering Footer */}
      <GlobalSiteFooter isLight={isLight} onToggleTheme={onToggleTheme} />

      {/* Navigation Landmark: Floating Centered Liquid Glass Bottom Navigation Dock */}
      {!selectedProject && (
        <LiquidGlassBottomNav
          initialTab="projects"
          onTabChange={(tab) => {
            if (tab === 'home') navigate('/')
            else if (tab === 'projects') {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            } else if (tab === 'experience') {
              navigate('/#experience')
            } else if (tab === 'about') {
              navigate('/#about')
            } else if (tab === 'contact') {
              navigate('/#contact')
            }
          }}
        />
      )}
    </div>
  )
}
