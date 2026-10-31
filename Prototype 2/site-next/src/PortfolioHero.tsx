import { useEffect, useState, useCallback } from 'react'
import HeroGpgpuCanvas from './HeroGpgpuCanvas'
import HandwrittenSignature from './HandwrittenSignature'
import HeroPortrait from './HeroPortrait'
import ThemeToggleSwitch from './ThemeToggleSwitch'
import LiquidGlassBottomNav from './LiquidGlassBottomNav'
import ExperienceSection from './ExperienceSection'
import AboutSection from './AboutSection'
import ContactSection from './ContactSection'
import GlobalSiteFooter from './GlobalSiteFooter'
import UnifiedTactilePipelineStack from './UnifiedTactilePipelineStack'
import HeroHeadlineReveal from './HeroHeadlineReveal'

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
  isLight?: boolean
  onToggleTheme?: (next: boolean) => void
}

export default function PortfolioHero({
  onNavigate,
  isLight: controlledIsLight,
  onToggleTheme: controlledOnToggleTheme,
}: PortfolioHeroProps = {}) {
  const [ready, setReady] = useState(false)
  const [internalLight, setInternalLight] = useState(getInitialThemeIsLight)
  const isLight = controlledIsLight !== undefined ? controlledIsLight : internalLight

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark')
  }, [isLight])

  const handleThemeToggle = useCallback(
    (next: boolean) => {
      // 1. Snapshot the visitor's current view before theme change
      const scrollY = window.scrollY
      const innerHeight = window.innerHeight

      // Find the currently active section in the viewport to anchor to
      const sections = ['contact', 'about', 'experience', 'systems-stack']
      let anchorSection: { id: string; top: number } | null = null

      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          // If this section is currently within the visible viewport bounds
          if (rect.top <= innerHeight * 0.75 && rect.bottom >= innerHeight * 0.1) {
            anchorSection = { id, top: rect.top }
            break
          }
        }
      }

      // Update state (both local and parent if provided)
      if (controlledIsLight === undefined) {
        setInternalLight(next)
      }
      controlledOnToggleTheme?.(next)
      try {
        localStorage.setItem('sirosiu-theme', next ? 'light' : 'dark')
      } catch {}

      // 2. Multi-frame scroll restoration to protect against canvas remounts, reflows, and height fluctuations
      const restoreScroll = () => {
        if (anchorSection) {
          const el = document.getElementById(anchorSection.id)
          if (el) {
            const currentTop = el.getBoundingClientRect().top
            const delta = currentTop - anchorSection.top
            if (Math.abs(delta) > 1) {
              window.scrollBy({ top: delta, behavior: 'instant' })
              return
            }
          }
        }
        // Fallback: restore exact scrollY
        if (Math.abs(window.scrollY - scrollY) > 2) {
          window.scrollTo({ top: scrollY, behavior: 'instant' })
        }
      }

      requestAnimationFrame(restoreScroll)
      setTimeout(restoreScroll, 16)
      setTimeout(restoreScroll, 50)
      setTimeout(restoreScroll, 120)
      setTimeout(restoreScroll, 280)
    },
    [controlledIsLight, controlledOnToggleTheme]
  )

  // Listen for OS system theme changes if user hasn't made an explicit choice
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('sirosiu-theme')
    if (saved) return

    const mql = window.matchMedia('(prefers-color-scheme: light)')
    const onSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('sirosiu-theme')) {
        handleThemeToggle(e.matches)
      }
    }
    mql.addEventListener('change', onSystemThemeChange)
    return () => mql.removeEventListener('change', onSystemThemeChange)
  }, [handleThemeToggle])

  // Deep linking: ensures direct visits (e.g. sirosiu.com/#contact) accurately
  // align to the targeted section across hydration, font loading, Three.js mounts, and layout reflows
  useEffect(() => {
    if (typeof window === 'undefined') return

    const getTargetIdFromHash = () => {
      const rawHash = window.location.hash.replace(/^#/, '')
      if (rawHash && rawHash !== 'home') return rawHash
      if (window.location.pathname === '/about') return 'about'
      if (window.location.pathname === '/contact') return 'contact'
      return null
    }

    let userInteracted = false
    const onUserInteract = () => {
      userInteracted = true
    }
    window.addEventListener('wheel', onUserInteract, { passive: true })
    window.addEventListener('touchstart', onUserInteract, { passive: true })
    window.addEventListener('pointerdown', onUserInteract, { passive: true })
    window.addEventListener('keydown', onUserInteract, { passive: true })

    const scrollToTarget = (smooth = false) => {
      if (userInteracted) return
      const targetId = getTargetIdFromHash()
      if (!targetId) return

      const el = document.getElementById(targetId)
      if (el) {
        const rect = el.getBoundingClientRect()
        // If element is not aligned to the top (allowing for 20px headroom)
        const diff = Math.abs(rect.top - 20)
        if (diff > 8) {
          const y = rect.top + window.scrollY - 20
          window.scrollTo({
            top: Math.max(0, y),
            behavior: smooth ? 'smooth' : 'instant',
          })
        }
      }
    }

    // 1. Attempt immediately upon component mount
    scrollToTarget(false)

    // 2. Schedule re-alignments throughout the SPA hydration & asset render window
    const delays = [30, 80, 160, 300, 500, 800, 1200, 1800, 2500]
    const timerIds = delays.map((ms) => setTimeout(() => scrollToTarget(false), ms))

    // 3. Re-align as soon as custom web fonts have finished downloading
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => scrollToTarget(false))
    }

    // 4. Re-align when window completes loading external images/assets
    const onLoad = () => scrollToTarget(false)
    window.addEventListener('load', onLoad)

    // 5. Watch for dynamic layout height changes (e.g. Three.js canvas setup, image reveals)
    let resizeObs: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      let shifts = 0
      resizeObs = new ResizeObserver(() => {
        if (!userInteracted && shifts++ < 20) {
          scrollToTarget(false)
        }
      })
      resizeObs.observe(document.body)
    }

    // 6. Handle in-page hash transitions and back/forward browser navigation
    const onHashChange = () => {
      userInteracted = false
      scrollToTarget(true)
    }
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('popstate', onHashChange)

    return () => {
      window.removeEventListener('wheel', onUserInteract)
      window.removeEventListener('touchstart', onUserInteract)
      window.removeEventListener('pointerdown', onUserInteract)
      window.removeEventListener('keydown', onUserInteract)
      window.removeEventListener('load', onLoad)
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('popstate', onHashChange)
      timerIds.forEach(clearTimeout)
      if (resizeObs) resizeObs.disconnect()
    }
  }, [])

  return (
    <div className="single-portfolio-hero" data-theme={isLight ? 'light' : 'dark'}>
      {/* Accessible Skip Link for Keyboard & Screen Reader Users */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Decorative GPGPU Vector Field Particle Layer (Gyro-Manhattan IC Routing) */}
      <div aria-hidden="true">
        <HeroGpgpuCanvas isActive={true} isLight={isLight} />
      </div>

      {/* 1. Banner Landmark: Top Site Header */}
      <header className="hero-nav" role="banner">
        <a className="hero-logo-signature" href="/" aria-label="Ankush Malothia - Home" data-eda-tag="[HOME // TOP]">
          <HandwrittenSignature />
        </a>
        <p className="hero-nav-role">SYSTEMS ARCHITECT · HARDWARE &amp; APPLIED AI</p>
        
        {/* Semantic Navigation Landmark for Header Actions */}
        <nav className="hero-nav-actions" role="navigation" aria-label="Primary navigation">
          <a
            href="/assets/Ankush_Malothia_Resume.pdf"
            download="Ankush_Malothia_Resume.pdf"
            className="hero-nav-resume-btn"
            title="Download Official Résumé (PDF)"
            data-eda-tag="[RÉSUMÉ PDF ↓]"
          >
            RÉSUMÉ <span aria-hidden="true">↓</span>
          </a>
          <div data-eda-tag="[SWITCH THEME]">
            <ThemeToggleSwitch isLight={isLight} onToggle={handleThemeToggle} />
          </div>
          <a
            href="#contact"
            className="hero-nav-talk"
            title="Jump to direct contact inquiry"
            data-eda-tag="[CONNECT ↗]"
          >
            <span className="talk-label-full">LET&apos;S TALK <span aria-hidden="true">↗</span></span>
            <span className="talk-label-compact" aria-hidden="true">TALK ↗</span>
          </a>
        </nav>
      </header>

      {/* 2. Main Content Landmark */}
      <main id="main-content" role="main" tabIndex={-1}>
        {/* ====================================================================
            HERO STAGE: Establishes Identity, Target Role, and Narrative FIRST
            ==================================================================== */}
        <section id="hero" className="hero-stage" aria-labelledby="hero-title">
          <div className="hero-copy hero-copy-left">
            {/* Identity & Focus Kicker */}
            <div className="hero-identity-tag">
              <span className="identity-lead">SYSTEMS ARCHITECT</span>
              <span className="identity-sep">·</span>
              <span className="identity-name">ANKUSH MALOTHIA</span>
            </div>

            {/* Master Headline */}
            <HeroHeadlineReveal onReady={() => setReady(true)} />

            {/* Core Narrative Statement */}
            <p className={`hero-intro${ready ? ' is-visible' : ''}`}>
              I engineer high-performance systems across the compute stack—bridging digital logic, hardware acceleration, and autonomous intelligence.
            </p>

            {/* Target Role & Primary Action Callouts (Clear & Unambiguous) */}
            <div className="hero-role-actions-cluster">
              <div className="hero-target-role-badge">
                <span className="role-badge-label">TARGET ROLE:</span>
                <span className="role-badge-title">Hardware Acceleration &amp; Applied AI Systems</span>
              </div>

              <div className="hero-cta-buttons-row">
                <a href="#contact" className="hero-cta-btn hero-cta-primary">
                  LET&apos;S TALK <span aria-hidden="true">↗</span>
                </a>
                <a href="#systems-stack" className="hero-cta-btn hero-cta-secondary">
                  EXPLORE ARCHITECTURE <span aria-hidden="true">↓</span>
                </a>
                <a
                  href="/assets/Ankush_Malothia_Resume.pdf"
                  download="Ankush_Malothia_Resume.pdf"
                  className="hero-cta-btn hero-cta-outline"
                  title="Download Official Résumé (PDF)"
                >
                  RÉSUMÉ <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right column: Portrait sitting above location & credentials */}
          <div className="hero-column-right">
            <HeroPortrait />
            <div className="hero-copy hero-copy-right">
              <p className="hero-location">BASED IN INDIA · WORKING WORLDWIDE</p>
              <a className="hero-scroll" href="#systems-stack">
                EXPLORE STACK <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        {/* ====================================================================
            SYSTEMS ARCHITECTURE STAGE: Supports the Story with Measured Depth
            ==================================================================== */}
        <section id="systems-stack" className="systems-stack-section" aria-labelledby="stack-heading">
          <div className="systems-stack-container">
            <div className="section-eyebrow-row">
              <span className="section-eyebrow-tag">01 / COMPUTE ARCHITECTURE SPECTRUM</span>
              <span className="section-eyebrow-divider">·</span>
              <span className="section-eyebrow-text">PHYSICAL SILICON TO AUTONOMOUS AGENTS</span>
            </div>
            <h2 id="stack-heading" className="systems-stack-heading">
              Technical Stack &amp; Architectural Continuum
            </h2>
            <p className="systems-stack-sub">
              Select an architectural layer to inspect verified hardware specifications, runtime benchmarks, and domain tooling.
            </p>
            <UnifiedTactilePipelineStack isLight={isLight} />
          </div>
        </section>

        {/* 02 / Track Record: Professional & Research Experience */}
        <ExperienceSection />

      {/* 03 / Professional Profile: Engineering Narrative, Academic Foundation & 4-Pillar Skills Matrix */}
      <AboutSection />

      {/* 04 / Contact Section: Recruiter Context, Direct Email, Downloadable Résumé, Verified Profiles & Inquiry Form */}
      <ContactSection isLight={isLight} />
    </main>

    {/* 3. Contentinfo Landmark: Global Engineering Footer */}
    <GlobalSiteFooter isLight={isLight} onToggleTheme={handleThemeToggle} />

    {/* 4. Navigation Landmark: Centered Liquid Glass Bottom Navigation Dock */}
    <LiquidGlassBottomNav
      initialTab={
        typeof window !== 'undefined'
          ? window.location.hash === '#contact'
            ? 'contact'
            : window.location.hash === '#about'
            ? 'about'
            : window.location.hash === '#experience'
            ? 'experience'
            : 'home'
          : 'home'
      }
      onTabChange={(tab) => {
        if (tab === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
          try {
            window.history.pushState(null, '', window.location.pathname)
          } catch {}
        } else if (tab === 'projects') {
          onNavigate?.('/projects')
        } else {
          const targetId = tab
          const el = document.getElementById(targetId)
          if (el) {
            const y = el.getBoundingClientRect().top + window.pageYOffset - 20
            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
            try {
              window.history.pushState(null, '', `#${targetId}`)
            } catch {}
          }
        }
      }}
    />
  </div>
  )
}
