import { useState, useEffect, useRef } from 'react'
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
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const modalSurfaceRef = useRef<HTMLDivElement>(null)
  const lastTriggerRef = useRef<HTMLElement | null>(null)

  // Synchronize Page-Specific Canonical & Social Metadata
  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Selected Engineering Systems & Architectures | Ankush Malothia'

    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    const prevCanonical = linkCanonical ? linkCanonical.href : ''
    if (!linkCanonical) {
      linkCanonical = document.createElement('link')
      linkCanonical.rel = 'canonical'
      document.head.appendChild(linkCanonical)
    }
    linkCanonical.href = 'https://sirosiu.com/projects'

    return () => {
      document.title = prevTitle
      if (linkCanonical) {
        linkCanonical.href = prevCanonical || 'https://sirosiu.com/'
      }
    }
  }, [])

  // Deep-linking: Support opening modal directly via URL hash or ?project= query param
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash.replace('#', '')
    const params = new URLSearchParams(window.location.search)
    const targetId = params.get('project') || hash
    if (targetId) {
      const matched = DEMO_PROJECTS.find(
        (p) => p.id === targetId || p.domainCode.toLowerCase() === targetId.toLowerCase()
      )
      if (matched) {
        setSelectedProject(matched)
      }
    }
  }, [])

  // Modal Focus Trap, Auto-Focus & Escape Key Handler
  useEffect(() => {
    if (!selectedProject) return

    // Auto-focus close button when modal opens
    closeBtnRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null)
        return
      }

      // Trap Tab key inside the modal
      if (e.key === 'Tab' && modalSurfaceRef.current) {
        const focusable = modalSurfaceRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      // Return focus to triggering button when modal closes
      if (lastTriggerRef.current) {
        lastTriggerRef.current.focus()
        lastTriggerRef.current = null
      }
    }
  }, [selectedProject])

  const filteredProjects =
    activeFilter === 'ALL'
      ? DEMO_PROJECTS
      : DEMO_PROJECTS.filter((p) => {
          if (activeFilter === 'APPLIED AI') {
            return (
              p.domain.toLowerCase().includes('applied ai') ||
              p.domain.toLowerCase().includes('machine learning')
            )
          }
          if (activeFilter === 'CREATIVE ENGINEERING') {
            return p.domain.toLowerCase().includes('creative')
          }
          return p.domain.toLowerCase().includes(activeFilter.toLowerCase())
        })

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
            <span className="projects-count">{filteredProjects.length} SYSTEM ARCHITECTURES</span>
          </div>

          <h1 className="projects-main-title">
            From silicon gates<br />to autonomous agents.
          </h1>

          <p className="projects-intro-description">
            High-performance engineering systems across the compute stack—bridging digital logic,
            hardware acceleration, and autonomous intelligence. Explore architectural specifications,
            synthesis metrics, and open source repositories below.
          </p>

          {/* Domain Filter Pills with aria-pressed */}
          <div className="projects-filter-bar" role="group" aria-label="Filter projects by engineering domain">
            {['ALL', 'APPLIED AI', 'COMPUTER ARCHITECTURE', 'RF ENGINEERING', 'CREATIVE ENGINEERING'].map((filter) => (
              <button
                key={filter}
                type="button"
                aria-pressed={activeFilter === filter}
                className={`projects-filter-btn${activeFilter === filter ? ' is-active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Aceternity Comet 3D Cards Grid */}
        <section className="projects-comet-section" aria-label="Selected Projects Grid">
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

                    {/* Interactive Buttons (No broken 404 links) */}
                    <div className="comet-card-footer">
                      <button
                        type="button"
                        className="comet-action-details"
                        onClick={(e) => {
                          lastTriggerRef.current = e.currentTarget
                          setSelectedProject(project)
                        }}
                      >
                        SPEC DETAILS
                      </button>
                      {project.repoStatus === 'public' ? (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="comet-action-repo"
                        >
                          REPO ↗
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="comet-action-repo is-request"
                          onClick={() => {
                            navigate('/#contact')
                          }}
                          title="Source code / lab archive available upon request"
                        >
                          {project.repoStatus === 'in-progress' ? 'IN PROGRESS' : 'REQUEST ↗'}
                        </button>
                      )}
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
          aria-labelledby="modal-project-title"
        >
          <div
            ref={modalSurfaceRef}
            className="project-modal-surface"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-header-id">
                <span className="modal-code">{selectedProject.domainCode}</span>
                <h3 className="modal-title" id="modal-project-title">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedProject(null)}
                aria-label="Close specification dialog"
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
                <h4 className="modal-sec-title">BENCHMARKS &amp; EVALUATION METRICS</h4>
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
                <h4 className="modal-sec-title">ENGINEERING CONTRIBUTIONS</h4>
                <ul className="modal-bullets">
                  {selectedProject.contributions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Outcomes */}
              <div className="modal-section">
                <h4 className="modal-sec-title">
                  {selectedProject.domain.includes('RF')
                    ? 'SIMULATION OUTCOMES (CST / FDTD)'
                    : 'VERIFIED OUTCOMES'}
                </h4>
                <ul className="modal-bullets">
                  {selectedProject.outcomes.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              {selectedProject.repoStatus === 'public' ? (
                <a
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-action-primary"
                >
                  VISIT REPOSITORY ON GITHUB ↗
                </a>
              ) : (
                <button
                  type="button"
                  className="modal-action-primary"
                  onClick={() => {
                    setSelectedProject(null)
                    navigate('/#contact')
                  }}
                >
                  REQUEST SOURCE ACCESS (EMAIL) ↗
                </button>
              )}
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
