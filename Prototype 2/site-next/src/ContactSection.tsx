import React, { useState } from 'react'
import ThemeToggleSwitch from './ThemeToggleSwitch'

interface ContactSectionProps {
  isLight?: boolean
  onToggleTheme?: (next: boolean) => void
}

export default function ContactSection({ isLight, onToggleTheme }: ContactSectionProps = {}) {
  const [copied, setCopied] = useState(false)
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Full-time Systems / AI Role',
    message: '',
  })

  const emailAddress = 'sirosiusugi@gmail.com'

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('sending')
    setTimeout(() => {
      setFormState('sent')
    }, 900)
  }

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-heading">
      <div className="contact-content-wrapper">
        {/* Section Tag */}
        <div className="section-eyebrow-row">
          <span className="section-eyebrow-tag">04 / CONTACT &amp; COLLABORATION</span>
          <span className="section-eyebrow-divider">//</span>
          <span className="section-eyebrow-text">LET&apos;S TALK</span>
        </div>

        {/* Header Block */}
        <div className="contact-header-block">
          <div className="contact-availability-badge">
            <span className="availability-dot" />
            <span className="availability-text">OPEN FOR HIGH-IMPACT OPPORTUNITIES & COLLABORATIONS</span>
          </div>

          <h2 id="contact-heading" className="contact-main-heading">
            Let&apos;s build something<br />exceptional together.
          </h2>

          <p className="contact-lead-text">
            Whether you are scouting talent for computer architecture, low-level runtimes,
            or autonomous AI agents, looking for a technical co-builder, or discussing high-frequency RF systems—my inbox is always open.
          </p>
        </div>

        {/* Primary Action Matrix: Email & Resume & Social */}
        <div className="contact-grid-layout">
          {/* Left Column: Direct Connections & Resume */}
          <div className="contact-info-column">
            {/* Direct Email Card */}
            <div className="contact-channel-card primary-channel">
              <div className="channel-icon-wrap">
                <span className="channel-glyph">✉</span>
              </div>
              <div className="channel-details">
                <span className="channel-label">DIRECT INBOX</span>
                <a
                  href={`mailto:${emailAddress}?subject=Engineering%20Inquiry%20from%20Portfolio`}
                  className="channel-value email-link"
                >
                  {emailAddress}
                </a>
                <p className="channel-note">Direct communication · Typical response within 24 hours</p>
              </div>
              <div className="channel-actions">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={`channel-copy-btn ${copied ? 'is-copied' : ''}`}
                  aria-label="Copy email address"
                >
                  {copied ? '✓ COPIED' : 'COPY EMAIL'}
                </button>
                <a
                  href={`mailto:${emailAddress}?subject=Engineering%20Inquiry%20from%20Portfolio`}
                  className="channel-link-btn"
                >
                  COMPOSE ↗
                </a>
              </div>
            </div>

            {/* Official Resume Card */}
            <div className="contact-channel-card resume-channel">
              <div className="channel-icon-wrap resume-icon">
                <span className="channel-glyph">📄</span>
              </div>
              <div className="channel-details">
                <span className="channel-label">CURRICULUM VITAE</span>
                <span className="channel-value">Ankush_Malothia_Resume.pdf</span>
                <p className="channel-note">
                  ECE B.Tech foundation, RISC-V RTL, autonomous agent telemetry, and verified benchmarks.
                </p>
              </div>
              <div className="channel-actions">
                <a
                  href="/assets/Ankush_Malothia_Resume.pdf"
                  download="Ankush_Malothia_Resume.pdf"
                  className="resume-download-btn"
                >
                  DOWNLOAD PDF ↓
                </a>
                <a
                  href="/assets/Ankush_Malothia_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-preview-btn"
                >
                  VIEW ↗
                </a>
              </div>
            </div>

            {/* Verified Profiles */}
            <div className="contact-socials-card">
              <span className="socials-title">VERIFIED PROFILES & REPOSITORIES</span>
              <div className="socials-links-grid">
                <a
                  href="https://github.com/Sirosiu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-profile-link"
                >
                  <div className="social-link-left">
                    <span className="social-brand">GitHub</span>
                    <span className="social-handle">@Sirosiu</span>
                  </div>
                  <span className="social-arrow">↗</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/ankush-malothia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-profile-link"
                >
                  <div className="social-link-left">
                    <span className="social-brand">LinkedIn</span>
                    <span className="social-handle">in/ankush-malothia</span>
                  </div>
                  <span className="social-arrow">↗</span>
                </a>

                <a
                  href="https://x.com/Ankushmalothia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-profile-link"
                >
                  <div className="social-link-left">
                    <span className="social-brand">X / Twitter</span>
                    <span className="social-handle">@Ankushmalothia</span>
                  </div>
                  <span className="social-arrow">↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Form */}
          <div className="contact-form-column">
            <div className="contact-form-card">
              <div className="form-card-header">
                <span className="form-chip">TRANSMIT INQUIRY</span>
                <h3 className="form-card-title">Send a Direct Message</h3>
                <p className="form-card-sub">
                  Have an opportunity or question? Leave a note and I&apos;ll get back to you promptly.
                </p>
              </div>

              {formState === 'sent' ? (
                <div className="form-sent-notification">
                  <span className="sent-icon">✓</span>
                  <h4>Message Dispatched</h4>
                  <p>
                    Thank you! Your inquiry has been recorded. A direct email has also been prepared.
                  </p>
                  <a
                    href={`mailto:${emailAddress}?subject=Portfolio%20Inquiry:%20${encodeURIComponent(formData.topic)}&body=${encodeURIComponent(formData.message)}`}
                    className="sent-fallback-btn"
                  >
                    Open in Your Email Client ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => setFormState('idle')}
                    className="sent-reset-btn"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-inquiry-form">
                  <div className="form-field-group">
                    <label htmlFor="contact-name" className="field-label">
                      NAME / ORGANIZATION <span className="req">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Alex Chen (Anthropic / Apple / Stealth)"
                      className="field-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="contact-email" className="field-label">
                      EMAIL ADDRESS <span className="req">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="alex@company.com"
                      className="field-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="contact-topic" className="field-label">
                      INQUIRY DOMAIN
                    </label>
                    <select
                      id="contact-topic"
                      className="field-input field-select"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    >
                      <option value="Full-time Systems / AI Role">Full-time Systems / AI Role</option>
                      <option value="Computer Architecture & RTL Acceleration">Computer Architecture & RTL Acceleration</option>
                      <option value="Autonomous AI Agent Development (Ave)">Autonomous AI Agent Development (Ave)</option>
                      <option value="RF / Antenna Engineering & Simulation">RF / Antenna Engineering & Simulation</option>
                      <option value="Research Collaboration & Consulting">Research Collaboration & Consulting</option>
                      <option value="Other / General Conversation">Other / General Conversation</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="contact-message" className="field-label">
                      MESSAGE / PROJECT SCOPE <span className="req">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      placeholder="Describe the opportunity, role requirements, or collaboration idea..."
                      className="field-input field-textarea"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formState === 'sending'}
                    className="form-submit-btn"
                  >
                    {formState === 'sending' ? (
                      <>
                        <span className="spinner-dot" /> TRANSMITTING...
                      </>
                    ) : (
                      'TRANSMIT MESSAGE ↗'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Global Engineering Footer */}
        <footer className="global-site-footer">
          <div className="footer-left">
            <span className="footer-brand">ANKUSH MALOTHIA // SIROSIU</span>
            <span className="footer-creds">
              ELECTRONICS & COMMUNICATION ENGINEERING · SYSTEMS ARCHITECT
            </span>
          </div>

          <div className="footer-center">
            <span className="footer-tech-stack">
              BUILT WITH REACT 19 · TYPESCRIPT · ACETERNITY LIQUID GLASS · HOSTED ON CLOUDFLARE PAGES
            </span>
          </div>

          <div className="footer-right">
            {onToggleTheme && (
              <div className="footer-theme-toggle-wrap">
                <span className="footer-theme-label">THEME</span>
                <ThemeToggleSwitch isLight={isLight} onToggle={onToggleTheme} />
              </div>
            )}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="footer-back-to-top"
            >
              BACK TO TOP ↑
            </button>
            <span className="footer-copy">© {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
          </div>
        </footer>
      </div>
    </section>
  )
}
