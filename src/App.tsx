import { lazy, Suspense, useState } from 'react'
import './App.css'

const HeroScene = lazy(() => import('./components/HeroScene'))

const navigation = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Journey', href: '#journey' },
]

const projects = [
  { number: '01', status: 'PROJECT DETAILS TO BE ADDED' },
  { number: '02', status: 'PROJECT DETAILS TO BE ADDED' },
  { number: '03', status: 'PROJECT DETAILS TO BE ADDED' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="SIROSIU home">
          SIROSIU<span className="wordmark-period">.</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <nav
          className={`navigation${menuOpen ? ' navigation-open' : ''}`}
          id="primary-navigation"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <a className="nav-contact" href="#contact" onClick={closeMenu}>
            Contact <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <section className="hero section-shell" id="home" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-indicator" />
            PERSONAL PORTFOLIO <span className="eyebrow-divider">/</span> IN
            PROGRESS
          </p>

          <h1 id="hero-title">
            Making space
            <br />
            for <span className="text-accent">what&apos;s next.</span>
          </h1>

          <p className="hero-description">
            A living archive of projects, experiments, ideas, and the process
            behind them.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              Explore the work <span aria-hidden="true">↘</span>
            </a>
            <a className="text-link" href="#about">
              A little about me <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
          <div className="art-grid" />
          <div className="art-orbit art-orbit-outer" />
          <div className="art-orbit art-orbit-inner" />
          <div className="art-object">
            <div className="object-face object-face-back" />
            <div className="object-face object-face-main" />
            <div className="object-fold" />
            <div className="object-core" />
          </div>
          <div className="art-glow" />
          <span className="art-label art-label-top">FORM / 001</span>
          <span className="art-label art-label-bottom">SPATIAL STUDY</span>
          <span className="art-coordinate">31° 00′ N — 75° 47′ E</span>
        </div>

        <div className="hero-bottom">
          <span>INDEPENDENT THINKING. INTENTIONAL BUILDING.</span>
          <a href="#work" aria-label="Scroll to selected work">
            SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="work-section section-shell section-divider" id="work">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / SELECTED WORK</p>
            <h2>Ideas into <span>form.</span></h2>
          </div>
          <p className="section-intro">
            Projects will live here — with the thinking, decisions, and evidence
            behind each one.
          </p>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.number}>
              <div className={`project-visual project-visual-${project.number}`}>
                <span className="project-index">S / {project.number}</span>
                <div className="project-placeholder-mark" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="project-visual-caption">WORK IN PROGRESS</span>
              </div>
              <div className="project-meta">
                <div>
                  <p className="project-status">{project.status}</p>
                  <h3>Title to be added</h3>
                </div>
                <span className="project-arrow" aria-hidden="true">↗</span>
              </div>
              <p className="project-note">
                Placeholder — replace with a verified project and its outcomes.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section section-shell section-divider" id="about">
        <div className="section-kicker">
          <p className="eyebrow">02 / ABOUT</p>
          <span className="section-number">01—02</span>
        </div>
        <div className="about-layout">
          <h2>
            Curious by
            <br />
            nature. <span>Building</span>
            <br />
            with intention.
          </h2>
          <div className="about-copy">
            <p>
              This space is for the person behind the work: the interests,
              principles, and questions that shape what gets built.
            </p>
            <p className="placeholder-note">
              Your verified biography and personal point of view will go here.
            </p>
            <a className="text-link" href="#journey">
              Follow the journey <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section
        className="capabilities-section section-shell section-divider"
        id="capabilities"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / TECHNICAL CAPABILITIES</p>
            <h2>Tools are a <span>means.</span></h2>
          </div>
          <p className="section-intro">
            A clear, evidence-led view of the skills and technologies behind
            the work — not a list of buzzwords.
          </p>
        </div>

        <div className="capability-panel">
          <div className="capability-row">
            <span className="capability-number">01</span>
            <h3>Foundations</h3>
            <p>Verified skills and fundamentals to be added.</p>
            <span className="capability-symbol" aria-hidden="true">↗</span>
          </div>
          <div className="capability-row">
            <span className="capability-number">02</span>
            <h3>Engineering</h3>
            <p>Tools, systems, and implementation experience to be added.</p>
            <span className="capability-symbol" aria-hidden="true">↗</span>
          </div>
          <div className="capability-row">
            <span className="capability-number">03</span>
            <h3>Exploration</h3>
            <p>Research interests and experiments to be added.</p>
            <span className="capability-symbol" aria-hidden="true">↗</span>
          </div>
        </div>
      </section>

      <section className="journey-section section-shell section-divider" id="journey">
        <div className="section-kicker">
          <p className="eyebrow">04 / THE JOURNEY</p>
          <span className="section-number">02—04</span>
        </div>
        <div className="journey-layout">
          <h2>
            Progress over
            <br />
            <span>pretence.</span>
          </h2>
          <div className="journey-copy">
            <p>
              Learning, experiments, setbacks, and milestones belong in the
              story too. This section will document the journey with context
              rather than inflated claims.
            </p>
            <div className="journey-placeholder">
              <span className="status-indicator" />
              <div>
                <p className="project-status">NEXT UPDATE</p>
                <p>Verified milestones and current focus to be added.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section section-shell" id="contact">
        <p className="eyebrow">05 / CONTACT</p>
        <h2>
          Have something
          <br />
          <span>in mind?</span>
        </h2>
        <p className="contact-copy">
          For now, this is a placeholder for verified contact details and
          professional profiles.
        </p>
        <span className="contact-placeholder">
          CONTACT LINKS TO BE ADDED
        </span>
      </section>

      <footer className="site-footer section-shell">
        <a className="wordmark" href="#home">
          SIROSIU<span className="wordmark-period">.</span>
        </a>
        <p>PERSONAL PORTFOLIO <span>—</span> IN THE MAKING</p>
        <a href="#home" className="back-to-top">
          BACK TO TOP ↑
        </a>
      </footer>
    </main>
  )
}

export default App