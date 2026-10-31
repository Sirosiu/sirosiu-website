import React, { useCallback } from 'react'
import { PinnedScrollyStage } from '../../components/PinnedScrollyStage'
import { KerrBlackHoleEngine } from './KerrBlackHoleEngine'

export const Concept01Cosmic: React.FC = () => {
  const renderCanvas = useCallback((container: HTMLDivElement) => {
    const engine = new KerrBlackHoleEngine({
      container,
      spin: 0.94,
      inclination: 1.38,
    })
    return () => engine.dispose()
  }, [])

  return (
    <PinnedScrollyStage
      conceptId={1}
      accentColor="#f59e0b"
      accentGlow="rgba(245, 158, 11, 0.4)"
      secondaryColor="#ef4444"
      renderCanvas={renderCanvas}
      customHeroEyebrow="[ CONCEPT 01 // RELATIVISTIC COSMOS ]"
      customHeroLead="Exploring gravitational singularity mechanics, autonomous agent topologies, and ultra-high-throughput inference gateways at the boundary of zero latency."
      customEpilogueLead="Orbital singularity stable. Available for mission-critical distributed AI systems, autonomous agent swarms, and relativistic computing architectures."
    />
  )
}

export default Concept01Cosmic
