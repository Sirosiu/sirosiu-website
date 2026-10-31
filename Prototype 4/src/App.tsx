import React, { useState } from 'react'
import './App.css'

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'concepts' | 'lab'>('overview')

  return (
    <div className="p4-root">
      <header className="p4-header">
        <div className="p4-brand">
          <span className="p4-logo">SIROSIU</span>
          <span className="p4-badge">PROTOTYPE 04</span>
        </div>
        <nav className="p4-nav">
          <button
            type="button"
            className={activeTab === 'overview' ? 'is-active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            OVERVIEW
          </button>
          <button
            type="button"
            className={activeTab === 'concepts' ? 'is-active' : ''}
            onClick={() => setActiveTab('concepts')}
          >
            EXPLORATION
          </button>
          <button
            type="button"
            className={activeTab === 'lab' ? 'is-active' : ''}
            onClick={() => setActiveTab('lab')}
          >
            LAB BENCH
          </button>
        </nav>
      </header>

      <main className="p4-main">
        <section className="p4-hero">
          <div className="p4-hero-badge">// INITIALIZED REPOSITORY STAGE</div>
          <h1>
            SIROSIU <span>PROTOTYPE 4</span>
          </h1>
          <p className="p4-lead">
            Personal Portfolio &amp; Creative Engineering Studio. Dedicated workspace ready for next-generation visual design exploration, technical architecture, and creative code.
          </p>

          <div className="p4-status-card">
            <div className="p4-status-row">
              <span className="p4-status-label">STATUS</span>
              <span className="p4-status-val p4-text-success">READY FOR SPECIFICATION</span>
            </div>
            <div className="p4-status-row">
              <span className="p4-status-label">DEV PORT</span>
              <span className="p4-status-val">localhost:5175</span>
            </div>
            <div className="p4-status-row">
              <span className="p4-status-label">MAIN PRODUCTION TARGET</span>
              <span className="p4-status-val">PROTOTYPE 2 (Preserved &amp; Active on sirosiu.com)</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
