import React, { useCallback } from 'react'
import { PinnedScrollyStage } from '../../components/PinnedScrollyStage'
import { SynapticArborEngine } from './SynapticArborEngine'

export const Concept02Synaptic: React.FC = () => {
  const renderCanvas = useCallback((container: HTMLDivElement) => {
    const engine = new SynapticArborEngine(container)
    return () => engine.dispose()
  }, [])

  return (
    <PinnedScrollyStage
      conceptId={2}
      accentColor="#ec4899"
      accentGlow="rgba(236, 72, 153, 0.45)"
      secondaryColor="#8b5cf6"
      renderCanvas={renderCanvas}
      customHeroEyebrow="[ CONCEPT 02 // NEUROSCIENCE & PSYCHEDELIC CONSCIOUSNESS ]"
      customHeroLead="Tracing dendritic arborization, axonal action potential propagation, and neural plasticity. Scroll to stimulate cortical synaptic cascades and binaural carrier oscillations."
      customEpilogueLead="Neural arborization synchronized. Available for cognitive architectures, neuroscience-inspired computing, and bio-cybernetic research."
    />
  )
}

export default Concept02Synaptic
