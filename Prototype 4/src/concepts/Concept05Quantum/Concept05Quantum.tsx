import React, { useCallback } from 'react'
import { PinnedScrollyStage } from '../../components/PinnedScrollyStage'
import { QuantumTerminalEngine } from './QuantumTerminalEngine'

export const Concept05Quantum: React.FC = () => {
  const renderCanvas = useCallback((container: HTMLDivElement) => {
    const engine = new QuantumTerminalEngine(container)
    return () => engine.dispose()
  }, [])

  return (
    <PinnedScrollyStage
      conceptId={5}
      accentColor="#a855f7"
      accentGlow="rgba(168, 85, 247, 0.45)"
      secondaryColor="#38bdf8"
      renderCanvas={renderCanvas}
      customHeroEyebrow="[ CONCEPT 05 // CYBERNETIC QUANTUM TERMINAL ]"
      customHeroLead="Rotating through a 4D tesseract qubit lattice in stereographic projection. Scroll to perturb the Hamiltonian matrix, induce quantum entanglement pulses, and project optical interference fringes."
      customEpilogueLead="State vector collapsed: |Ψ⟩ = α|0000⟩ + β|1111⟩. Quantum fidelity 99.98%. Available for advanced quantum computing simulation, high-performance cryptography, and next-generation terminal interfaces."
    />
  )
}

export default Concept05Quantum
