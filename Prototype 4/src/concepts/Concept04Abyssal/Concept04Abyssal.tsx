import React, { useCallback } from 'react'
import { PinnedScrollyStage } from '../../components/PinnedScrollyStage'
import { BioluminescentAbyssalEngine } from './BioluminescentAbyssalEngine'

export const Concept04Abyssal: React.FC = () => {
  const renderCanvas = useCallback((container: HTMLDivElement) => {
    const engine = new BioluminescentAbyssalEngine(container)
    return () => engine.dispose()
  }, [])

  return (
    <PinnedScrollyStage
      conceptId={4}
      accentColor="#10b981"
      accentGlow="rgba(16, 185, 129, 0.45)"
      secondaryColor="#06b6d4"
      renderCanvas={renderCanvas}
      customHeroEyebrow="[ CONCEPT 04 // BIOLUMINESCENT ABYSSAL DEEP ]"
      customHeroLead="Descending from the sunlit epipelagic surface into the abyssal hadal trench. Scroll to witness marine snow particulate drift, hydro-pneumatic medusa contractions, and emerald siphonophore luminescence."
      customEpilogueLead="Abyssal depth of 10,920m reached. Hydrostatic pressure 1,093 ATM. Available for deep-tech systems, extreme resilience architectures, and zero-gravity simulations."
    />
  )
}

export default Concept04Abyssal
