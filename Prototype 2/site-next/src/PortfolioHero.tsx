import { useEffect, useState } from 'react'
import InteractiveOceanBackground from './InteractiveOceanBackground'
import InteractiveCloudsBackground from './InteractiveCloudsBackground'
import HandwrittenSignature from './HandwrittenSignature'
import HeroPortrait from './HeroPortrait'
import ThemeToggleSwitch from './ThemeToggleSwitch'
import InteractiveDaylightBubbles from './InteractiveDaylightBubbles'
import FlowingDotsBackground from './FlowingDotsBackground'
import TactileRevealSpotlight from './TactileRevealSpotlight'

const greeting = 'I make digital work feel alive.'

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

export default function PortfolioHero() {
  const [typed, setTyped] = useState('')
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

  const handleThemeToggle = (next: boolean) => {
    setIsLight(next)
    try {
      localStorage.setItem('sirosiu-theme', next ? 'light' : 'dark')
    } catch {}
  }

  useEffect(() => {
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setTyped(greeting.slice(0, index))
      if (index === greeting.length) {
        window.clearInterval(timer)
        window.setTimeout(() => setReady(true), 260)
      }
    }, 54)

    return () => window.clearInterval(timer)
  }, [])

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
        <p>PORTFOLIO / 01</p>
        <div className="hero-nav-actions">
          <ThemeToggleSwitch isLight={isLight} onToggle={handleThemeToggle} />
          <a href="#contact" className="hero-nav-talk">LET&apos;S TALK <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <section className="hero-stage" aria-labelledby="hero-title">
        <div className="hero-copy hero-copy-left">
          <p className="hero-eyebrow">CREATIVE DEVELOPER / INDIA</p>
          <h1 id="hero-title">{typed}<span className="hero-caret" aria-hidden="true" /></h1>
          <p className={`hero-intro${ready ? ' is-visible' : ''}`}>
            I&apos;m Sirosiu. I design and build thoughtful web experiences for people with something worth saying.
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

      <footer id="contact" className="hero-footer">
        <span>SELECTED WORK / COMING TOGETHER</span>
        <span>© {new Date().getFullYear()} SIROSIU</span>
      </footer>

      <section id="work" className="hero-next-section" aria-label="Next section">
        {/* Light Theme: Flowing dots architectural blueprint background */}
        <FlowingDotsBackground isActive={isLight} />

        <div className="hero-next-content">
          <p>01 / THE WORK</p>
          <h2>Good work starts with a clear point of view.</h2>

          {/* Light Theme: Architectural tactile reveal spotlight gallery */}
          <TactileRevealSpotlight isActive={isLight} />
        </div>
      </section>
    </main>
  )
}
