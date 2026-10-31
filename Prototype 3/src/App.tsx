import React, { useEffect, useState } from 'react'
import { CONCEPT_META, ConceptId } from './data/portfolioData'
import { ConceptSwitcher } from './components/ConceptSwitcher'
import { Concept01Spatial } from './concepts/Concept01Spatial/Concept01Spatial'
import { Concept02Editorial } from './concepts/Concept02Editorial/Concept02Editorial'
import { Concept03Experimental } from './concepts/Concept03Experimental/Concept03Experimental'
import { Concept04Technical } from './concepts/Concept04Technical/Concept04Technical'
import './App.css'

export const App: React.FC = () => {
  const [activeConcept, setActiveConcept] = useState<ConceptId>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const c = parseInt(urlParams.get('concept') || '', 10)
      if (c >= 1 && c <= 4) return c as ConceptId

      const saved = localStorage.getItem('sirosiu_concept_p3')
      const parsedSaved = parseInt(saved || '', 10)
      if (parsedSaved >= 1 && parsedSaved <= 4) return parsedSaved as ConceptId
    } catch (e) {
      // ignore
    }
    return 1
  })

  const handleSelectConcept = (id: ConceptId) => {
    setActiveConcept(id)
    try {
      localStorage.setItem('sirosiu_concept_p3', id.toString())
      const url = new URL(window.location.href)
      url.searchParams.set('concept', id.toString())
      window.history.replaceState({}, '', url.toString())
    } catch (e) {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Update page title
  useEffect(() => {
    const meta = CONCEPT_META[activeConcept]
    document.title = `SIROSIU — Concept ${meta.number}: ${meta.name} [Prototype 3]`
  }, [activeConcept])

  return (
    <div className="sirosiu-prototype-root">
      {/* Floating Concept Switcher Dock */}
      <ConceptSwitcher
        activeConcept={activeConcept}
        onSelectConcept={handleSelectConcept}
      />

      {/* Active Concept Screen */}
      <main id="main-content" role="main">
        {activeConcept === 1 && <Concept01Spatial />}
        {activeConcept === 2 && <Concept02Editorial />}
        {activeConcept === 3 && <Concept03Experimental />}
        {activeConcept === 4 && <Concept04Technical />}
      </main>
    </div>
  )
}

export default App
