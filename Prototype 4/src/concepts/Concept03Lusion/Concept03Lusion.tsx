import React, { useCallback } from 'react'
import { PinnedScrollyStage } from '../../components/PinnedScrollyStage'
import { GelatinousFluidEngine } from './LusionLiquidEngine'

export const Concept03Lusion: React.FC = () => {
  const renderCanvas = useCallback((container: HTMLDivElement) => {
    const engine = new GelatinousFluidEngine({
      container,
      stiffness: 0.14,
      damping: 0.84,
    })
    return () => engine.dispose()
  }, [])

  return (
    <PinnedScrollyStage
      conceptId={3}
      accentColor="#06b6d4"
      accentGlow="rgba(6, 182, 212, 0.45)"
      secondaryColor="#3b82f6"
      renderCanvas={renderCanvas}
      customHeroEyebrow="[ CONCEPT 03 // LUSION GELATINOUS LIQUID ]"
      customHeroLead="Tactile fluid dynamics with second-order Hookean spring-mass surface tension and chromatic refraction. Scroll and drag to deform the viscoelastic gel membrane."
      customEpilogueLead="Viscoelastic equilibrium achieved. Available for creative technologist roles, shader development, and tactile product experiences."
    />
  )
}

export default Concept03Lusion
