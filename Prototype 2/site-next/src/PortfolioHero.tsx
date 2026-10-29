import { useEffect, useState } from 'react'
import InteractiveOceanBackground from './InteractiveOceanBackground'
import InteractiveCloudsBackground from './InteractiveCloudsBackground'
import HandwrittenSignature from './HandwrittenSignature'
import HeroPortrait from './HeroPortrait'
import ThemeToggleSwitch from './ThemeToggleSwitch'
import InteractiveDaylightBubbles from './InteractiveDaylightBubbles'
import FlowingDotsBackground from './FlowingDotsBackground'
import LiquidGlassBottomNav from './LiquidGlassBottomNav'
import ExperienceSection from './ExperienceSection'
import AboutSection from './AboutSection'
import ContactSection from './ContactSection'
import UnifiedTactilePipelineStack from './UnifiedTactilePipelineStack'
import HeroHeadlineReveal from './HeroHeadlineReveal'
import { DEMO_PROJECTS, type ProjectItem } from './data/projectsData'

const getInitialThemeIsLight = (): boolean => {
  if (typeof window === 'undefined') return false
  try {
    const saved = localStorage.getItem('sirosiu-theme')
    if (saved) return saved === 'light'
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: light)').matches
  } catch {
    return false
  }
}

interface PortfolioHeroProps {
  onNavigate?: (path: string) => void
}

export default function PortfolioHero({ onNavigate }: PortfolioHeroProps = {}) {
  const [ready, setReady] = useState(false)
  const [isLight, setIsLight] = useState(getInitialThemeIsLight)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark')
  }, [isLight])

  // Listen for OS system theme changes if user hasn't made an explicit choice
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('sirosiu-theme')
    if (saved) return

    const mql = window.matchMedia('(prefers-color-scheme: light)')
    const onSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('sirosiu-theme')) {
        setIsLight(e.matches)
      }
    }
    mql.addEventListener('change', onSystemThemeChange)
    return () => mql.removeEventListener('change', onSystemThemeChange)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.hash === '#about' || window.location.pathname === '/about')) {
      let count = 0
      let activeTimer: ReturnType<typeof setTimeout> | null = null

      const syncScroll = () => {
        const el = document.getElementById('about')
        if (el) {
          const rect = el.getBoundingClientRect()
          if (Math.abs(rect.top - 20) > 40) {
            const y = rect.top + window.pageYOffset - 20
            window.scrollTo({ top: Math.max(0, y), behavior: count === 0 ? 'auto' : 'smooth' })
          }
        }
        count++
        if (count < 8) {
          activeTimer = setTimeout(syncScroll, 140)
        }
      }

      syncScroll()
      return () => {
        if (activeTimer) clearTimeout(activeTimer)
      }
    }
  }, [])

  const handleThemeToggle = (next: boolean) => {
    setIsLight(next)
    try {
      localStorage.setItem('sirosiu-theme', next ? 'light' : 'dark')
    } catch {}
  }

  return (
    <main className="single-portfolio-hero" data-theme={isLight ? 'light' : 'dark'}>
      {/* Dark Theme: Full-screen ambient interactive 3D ocean background */}
      <InteractiveOceanBackground isActive={!isLight} />

      {/* Light Theme: Flowing volumetric 3D clouds background */}
      <InteractiveCloudsBackground isActive={isLight} />

      {/* Light Theme: Interactive daylight buoyancy bubbles (clicks & CTA hovers) */}
      <InteractiveDaylightBubbles isActive={isLight} />

      <header className="hero-nav">
        <a className="hero-logo-signature" href="/" aria-label="Ankush Malothia">
          <HandwrittenSignature />
        </a>
        <p className="hero-nav-role">HARDWARE ACCELERATION &amp; APPLIED AI</p>
        <div className="hero-nav-actions">
          <a
            href="/assets/Ankush_Malothia_Resume.pdf"
            download="Ankush_Malothia_Resume.pdf"
            className="hero-nav-resume-btn"
            title="Download Official Résumé (PDF)"
          >
            RÉSUMÉ <span aria-hidden="true">↓</span>
          </a>
          <ThemeToggleSwitch isLight={isLight} onToggle={handleThemeToggle} />
          <a href="#contact" className="hero-nav-talk">LET&apos;S TALK <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <section className="hero-stage" aria-labelledby="hero-title">
        <div className="hero-copy hero-copy-left">
          {/* Master Blended Stack: Tactile IC Modules + Continuous Pipeline Flow */}
          <UnifiedTactilePipelineStack />
          <HeroHeadlineReveal onReady={() => setReady(true)} />
          <p className={`hero-intro${ready ? ' is-visible' : ''}`}>
            I&apos;m Ankush (Sirosiu). I engineer high-performance systems across the compute stack—bridging digital logic, hardware acceleration, and autonomous intelligence.
          </p>
        </div>

        {/* Right column: Portrait sitting above location & scroll info */}
        <div className="hero-column-right">
          <HeroPortrait />
          <div className="hero-copy hero-copy-right">
            <p className="hero-location">BASED IN INDIA<br />WORKING WORLDWIDE</p>
            <a className="hero-scroll" href="#work">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>

      <section id="work" className="hero-next-section" aria-label="Selected Projects">
        {/* Light Theme: Flowing dots architectural blueprint background */}
        <FlowingDotsBackground isActive={isLight} />

        <div className="hero-next-content">
          <div className="section-eyebrow-row">
            <span className="section-eyebrow-tag">01 / SELECTED SYSTEMS</span>
            <span className="section-eyebrow-divider">//</span>
            <span className="section-eyebrow-text">ENGINEERING ARTIFACTS &amp; PROJECT STATUS</span>
          </div>

          <h2 className="hero-work-heading">Architected across silicon, runtimes, and autonomous agents.</h2>
          <p className="hero-work-sub">
            Verified hardware accelerators, on-device agent runtimes, and high-frequency RF systems with measured benchmarks.
          </p>

          {/* Project Status Matrix (Directly visible on homepage) */}
          <div className="home-projects-status-grid">
            {DEMO_PROJECTS.map((proj: ProjectItem) => (
              <article key={proj.id} className="home-project-card">
                <div className="card-top-row">
                  <span className="card-domain-tag">{proj.domain}</span>
                  <span
                    className={`card-status-badge ${
                      proj.status === 'Built'
                        ? 'is-built'
                        : proj.status === 'In progress'
                        ? 'is-progress'
                        : 'is-planned'
                    }`}
                  >
                    {proj.status === 'Built' && '● BUILT & VERIFIED'}
                    {proj.status === 'In progress' && '◌ IN PROGRESS'}
                    {proj.status === 'Planned' && '◇ PLANNED'}
                  </span>
                </div>

                <h3 className="card-title">{proj.title}</h3>
                <p className="card-headline">{proj.tagline}</p>

                {/* Key Metrics */}
                <div className="card-metrics-grid">
                  {proj.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="card-metric-cell">
                      <span className="metric-lbl">{m.label}</span>
                      <span className="metric-val">{m.value}</span>
                    </div>
                  ))}
                </div>

                {/* Scope Transparency: Built vs Planned */}
                <div className="card-scope-box">
                  <div className="scope-col">
                    <span className="scope-tag tag-built">BUILT:</span>
                    <p className="scope-text">{proj.builtScope}</p>
                  </div>
                  {proj.plannedScope && (
                    <div className="scope-col">
                      <span className="scope-tag tag-planned">IN PROGRESS / PLANNED:</span>
                      <p className="scope-text">{proj.plannedScope}</p>
                    </div>
                  )}
                </div>

                {/* Tech Badges */}
                <div className="card-tags-row">
                  {proj.tags.slice(0, 4).map((tag, tIdx) => (
                    <span key={tIdx} className="card-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Card Action */}
                <div className="card-action-row">
                  <button
                    type="button"
                    className="card-explore-btn"
                    onClick={() => onNavigate?.('/projects')}
                  >
                    VIEW ARCHITECTURE SPEC SHEET ↗
                  </button>
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-github-link"
                    title="View GitHub Repository"
                  >
                    REPO ↗
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="home-work-catalog-cta">
            <button
              type="button"
              className="hero-work-portal-btn"
              onClick={() => onNavigate?.('/projects')}
            >
              OPEN FULL PROJECTS CATALOG &amp; SPEC DRAWER (3 SYSTEMS) ↗
            </button>
          </div>
        </div>
      </section>

      {/* 02 / Track Record: Professional & Research Experience */}
      <ExperienceSection />

      {/* 03 / Professional Profile: Engineering Narrative, Academic Foundation & 4-Pillar Skills Matrix */}
      <AboutSection />

      {/* 04 / Contact Section: Recruiter Context, Direct Email, Downloadable Résumé, Verified Profiles & Inquiry Form */}
      <ContactSection />

      {/* Centered Liquid Glass Bottom Navigation Dock (Aceternity UI) */}
      <LiquidGlassBottomNav
        initialTab={typeof window !== 'undefined' && window.location.hash === '#about' ? 'about' : 'home'}
        onTabChange={(tab) => {
          if (tab === 'projects') {
            onNavigate?.('/projects')
          } else if (tab === 'about') {
            const el = document.getElementById('about')
            if (el) {
              const y = el.getBoundingClientRect().top + window.pageYOffset - 20
              window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
            }
          } else if (tab === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }}
      />
    </main>
  )
}
