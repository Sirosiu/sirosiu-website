import React, { useState, useRef } from 'react'

export default function ContactSection() {
  const [copied, setCopied] = useState(false)
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [deliveryMethod, setDeliveryMethod] = useState<'endpoint' | 'mailto'>('endpoint')
  const [errorMessage, setErrorMessage] = useState('')
  const [copiedSentText, setCopiedSentText] = useState(false)
  const successHeadingRef = useRef<HTMLHeadingElement>(null)
  const errorHeadingRef = useRef<HTMLHeadingElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Full-time Systems / AI Role',
    message: '',
  })

  const emailAddress = 'sirosiusugi@gmail.com'
  const hasBackendEndpoint = Boolean(
    (import.meta as any).env?.VITE_CONTACT_ENDPOINT || (import.meta as any).env?.VITE_WEB3FORMS_KEY
  )

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

  const handleCopyMessage = async () => {
    const formatted = `Name: ${formData.name}\nEmail: ${formData.email}\nTopic: ${formData.topic}\n\nMessage:\n${formData.message}`
    try {
      await navigator.clipboard.writeText(formatted)
      setCopiedSentText(true)
      setTimeout(() => setCopiedSentText(false), 2500)
    } catch {
      setCopiedSentText(true)
      setTimeout(() => setCopiedSentText(false), 2500)
    }
  }

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      topic: 'Full-time Systems / AI Role',
      message: '',
    })
    setFormState('idle')
    setTimeout(() => {
      document.getElementById('contact-name')?.focus()
    }, 50)
  }

  const handleEditForm = () => {
    setFormState('idle')
    setTimeout(() => {
      document.getElementById('contact-message')?.focus()
    }, 50)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('sending')
    setErrorMessage('')

    // 1. Offline connectivity guard
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setErrorMessage('Your browser appears to be offline. Please connect to the internet or reach out directly via email.')
      setFormState('error')
      setTimeout(() => errorHeadingRef.current?.focus(), 50)
      return
    }

    try {
      // 2. Allow simulating delivery failure for QA testing via error@ or fail@ in email
      if (formData.email.toLowerCase().includes('error') || formData.email.toLowerCase().includes('fail')) {
        throw new Error('Simulated network delivery failure: endpoint returned 503 Service Unavailable.')
      }

      // 3. Real network endpoint if configured via environment (Formspree, Web3Forms, Cloudflare Worker, etc.)
      const endpoint = (import.meta as any).env?.VITE_CONTACT_ENDPOINT
      const web3FormsKey = (import.meta as any).env?.VITE_WEB3FORMS_KEY

      if (web3FormsKey) {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            access_key: web3FormsKey,
            name: formData.name,
            email: formData.email,
            subject: `[Portfolio Inquiry] ${formData.topic} - ${formData.name}`,
            message: formData.message,
            from_name: formData.name,
          }),
        })
        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.message || `Submission failed with status ${res.status}`)
        }
        setDeliveryMethod('endpoint')
      } else if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            topic: formData.topic,
            message: formData.message,
            timestamp: new Date().toISOString(),
          }),
        })
        if (!res.ok) {
          throw new Error(`Submission failed with status ${res.status}: ${res.statusText}`)
        }
        setDeliveryMethod('endpoint')
      } else {
        // Static client fallback: launch email client with pre-filled message
        await new Promise((resolve) => setTimeout(resolve, 450))
        if (typeof window !== 'undefined') {
          window.location.href = mailtoHref
        }
        setDeliveryMethod('mailto')
      }

      setFormState('sent')
      setTimeout(() => successHeadingRef.current?.focus(), 50)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Transmission failed due to a network or service error.')
      setFormState('error')
      setTimeout(() => errorHeadingRef.current?.focus(), 50)
    }
  }

  const mailtoHref = `mailto:${emailAddress}?subject=${encodeURIComponent(
    `[Portfolio] ${formData.topic} - ${formData.name}`
  )}&body=${encodeURIComponent(
    `Hi Ankush,\n\n${formData.message}\n\nBest regards,\n${formData.name} (${formData.email})`
  )}`

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-heading">
      <div className="contact-content-wrapper">
        {/* Section Tag */}
        <div className="section-eyebrow-row">
          <span className="section-eyebrow-tag">04 / CONTACT &amp; COLLABORATION</span>
          <span className="section-eyebrow-divider">·</span>
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
                <div className="form-sent-notification" role="status" aria-live="polite">
                  <span className="sent-icon" aria-hidden="true">
                    {deliveryMethod === 'endpoint' ? '✓' : '✉'}
                  </span>
                  <h4 ref={successHeadingRef} tabIndex={-1} className="feedback-heading">
                    {deliveryMethod === 'endpoint'
                      ? 'Message Delivered to Inbox'
                      : 'Email Draft Opened in Mail App'}
                  </h4>
                  <p>
                    {deliveryMethod === 'endpoint' ? (
                      <>
                        Thank you, {formData.name.trim() || 'friend'}! Your inquiry has been transmitted directly to{' '}
                        <strong>{emailAddress}</strong>. I typically reply within 24 hours.
                      </>
                    ) : (
                      <>
                        Your default email client has been launched with your inquiry addressed to{' '}
                        <strong>{emailAddress}</strong>. Please press <strong>Send</strong> in your mail application to complete delivery.
                      </>
                    )}
                  </p>
                  <div className="sent-actions-row">
                    {deliveryMethod === 'mailto' && (
                      <a
                        href={mailtoHref}
                        className="sent-fallback-btn"
                      >
                        Re-Open Email Client ↗
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="sent-copy-btn"
                      aria-label="Copy message text to clipboard"
                    >
                      {copiedSentText ? '✓ COPIED TO CLIPBOARD' : 'COPY MESSAGE DETAILS'}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="sent-reset-btn"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : formState === 'error' ? (
                <div className="form-error-notification" role="alert" aria-live="assertive">
                  <span className="error-icon" aria-hidden="true">⚠</span>
                  <h4 ref={errorHeadingRef} tabIndex={-1} className="feedback-heading error-heading">
                    Submission Issue
                  </h4>
                  <p>
                    {errorMessage || "We couldn't transmit your inquiry over the network."} None of your entered message details have been lost.
                  </p>
                  <div className="error-actions-row">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="error-retry-btn"
                    >
                      RETRY TRANSMISSION ↻
                    </button>
                    <a
                      href={mailtoHref}
                      className="error-fallback-link"
                    >
                      Send via Email App ↗
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="error-copy-btn"
                      aria-label="Copy message text to clipboard"
                    >
                      {copiedSentText ? '✓ COPIED' : 'Copy Message Text'}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleEditForm}
                    className="error-edit-btn"
                  >
                    ← Edit Form Details
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
                      disabled={formState === 'sending'}
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
                      disabled={formState === 'sending'}
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
                      disabled={formState === 'sending'}
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
                      disabled={formState === 'sending'}
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
                        <span className="spinner-dot" /> {hasBackendEndpoint ? 'TRANSMITTING...' : 'LAUNCHING EMAIL...'}
                      </>
                    ) : hasBackendEndpoint ? (
                      'TRANSMIT MESSAGE ↗'
                    ) : (
                      'PREPARE EMAIL DRAFT ↗'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
