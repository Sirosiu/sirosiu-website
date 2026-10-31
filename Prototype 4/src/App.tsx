import React, { useEffect, useState, useRef } from 'react'
import Lenis from 'lenis'
import { CONCEPT_META, ConceptId } from './data/portfolioData'
import { ConceptSwitcher } from './components/ConceptSwitcher'
import { Concept01Cosmic } from './concepts/Concept01Cosmic/Concept01Cosmic'
import { Concept02Synaptic } from './concepts/Concept02Synaptic/Concept02Synaptic'
import { Concept03Lusion } from './concepts/Concept03Lusion/Concept03Lusion'
import { Concept04Abyssal } from './concepts/Concept04Abyssal/Concept04Abyssal'
import { Concept05Quantum } from './concepts/Concept05Quantum/Concept05Quantum'
import './App.css'

export const App: React.FC = () => {
  const lenisRef = useRef<Lenis | null>(null)
  const [activeConcept, setActiveConcept] = useState<ConceptId>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const c = parseInt(urlParams.get('concept') || '', 10)
      if (c >= 1 && c <= 5) return c as ConceptId

      const saved = localStorage.getItem('sirosiu_concept_p4')
      const parsedSaved = parseInt(saved || '', 10)
      if (parsedSaved >= 1 && parsedSaved <= 5) return parsedSaved as ConceptId
    } catch (e) {
      // ignore
    }
    return 4 // Default to Concept 04 (Continuous World Entrance)
  })

  // Global Butter-Smooth Lenis Scroll Engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.4,
    })
    lenisRef.current = lenis

    let frameId: number
    function raf(time: number) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [activeConcept])

  const handleSelectConcept = (id: ConceptId) => {
    setActiveConcept(id)
    try {
      localStorage.setItem('sirosiu_concept_p4', id.toString())
      const url = new URL(window.location.href)
      url.searchParams.set('concept', id.toString())
      window.history.replaceState({}, '', url.toString())
    } catch (e) {
      // ignore
    }
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: false, duration: 0.8 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Update page title dynamically
  useEffect(() => {
    const meta = CONCEPT_META[activeConcept]
    document.title = `SIROSIU — Concept ${meta.number}: ${meta.name} [Prototype 4]`
  }, [activeConcept])

  return (
    <div className="p4-master-root">
      {/* Top Floating Concept Switcher Dock */}
      <ConceptSwitcher
        activeConcept={activeConcept}
        onSelectConcept={handleSelectConcept}
      />

      {/* Active Concept Renderer */}
      <main className="p4-concept-stage">
        {activeConcept === 1 && <Concept01Cosmic />}
        {activeConcept === 2 && <Concept02Synaptic />}
        {activeConcept === 3 && <Concept03Lusion />}
        {activeConcept === 4 && <Concept04Abyssal />}
        {activeConcept === 5 && <Concept05Quantum />}
      </main>
    </div>
  )
}

export default App
