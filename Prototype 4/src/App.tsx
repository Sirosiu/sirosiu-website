import React, { useEffect, useState } from 'react'
import { CONCEPT_META, ConceptId } from './data/portfolioData'
import { ConceptSwitcher } from './components/ConceptSwitcher'
import { Concept01Cosmic } from './concepts/Concept01Cosmic/Concept01Cosmic'
import { Concept02Synaptic } from './concepts/Concept02Synaptic/Concept02Synaptic'
import { Concept03Lusion } from './concepts/Concept03Lusion/Concept03Lusion'
import { Concept04Swiss } from './concepts/Concept04Swiss/Concept04Swiss'
import { Concept05Laser } from './concepts/Concept05Laser/Concept05Laser'
import './App.css'

export const App: React.FC = () => {
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
    return 1 // Default to Concept 01 (Cosmic Horizon)
  })

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
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
        {activeConcept === 4 && <Concept04Swiss />}
        {activeConcept === 5 && <Concept05Laser />}
      </main>
    </div>
  )
}

export default App
