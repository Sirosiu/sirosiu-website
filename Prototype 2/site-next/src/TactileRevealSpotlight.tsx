import { useRef, useState } from 'react'

interface WorkItem {
  index: string
  title: string
  description: string
  tags: string[]
  year: string
}

const workItems: WorkItem[] = [
  {
    index: '01',
    title: 'Volumetric Clouds & Fluid 3D Environments',
    description: 'Sculpting mathematical cumulus formations, dynamic lighting, and real-time GPU wave physics that respond to user presence.',
    tags: ['Three.js', 'GLSL Shaders', 'Volumetrics'],
    year: '2026',
  },
  {
    index: '02',
    title: 'Generative Vector Fields & Neural Dynamics',
    description: 'Developing organic mathematical noise fields, harmonic particle streams, and generative WebGL neural auras.',
    tags: ['WebGL', 'Flow Fields', 'FBM Noise'],
    year: '2026',
  },
  {
    index: '03',
    title: 'Tactile Editorial & Spatial Digital Craft',
    description: 'Harmonizing haute horlogerie typography, warm parchment design systems, and responsive kinetic interactions.',
    tags: ['Creative Dev', 'React', 'Design Systems'],
    year: '2026',
  },
]

interface TactileRevealSpotlightProps {
  isActive: boolean
}

export default function TactileRevealSpotlight({ isActive }: TactileRevealSpotlightProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 })
  const [isInside, setIsInside] = useState(false)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsInside(true)
  }

  const onMouseLeave = () => {
    setIsInside(false)
  }

  return (
    <div
      ref={containerRef}
      className={`tactile-spotlight-container${isActive ? ' is-active' : ''}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Dynamic ambient spotlight beam across the grid (adapted from Cursify spotlight-cursor) */}
      {isActive && isInside && (
        <div
          className="tactile-spotlight-beam"
          style={{
            background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.42) 0%, rgba(247, 243, 234, 0.20) 45%, transparent 75%)`,
          }}
          aria-hidden="true"
        />
      )}

      <div className="tactile-cards-grid">
        {workItems.map((item) => (
          <SpotlightWorkCard
            key={item.index}
            item={item}
            containerMouse={mousePos}
            isContainerHovered={isInside}
            isActive={isActive}
          />
        ))}
      </div>
    </div>
  )
}

function SpotlightWorkCard({
  item,
  containerMouse,
  isContainerHovered,
  isActive,
}: {
  item: WorkItem
  containerMouse: { x: number; y: number }
  isContainerHovered: boolean
  isActive: boolean
}) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [localMouse, setLocalMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isCardHovered, setIsCardHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setLocalMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsCardHovered(true)
  }

  const handleMouseLeave = () => {
    setIsCardHovered(false)
  }

  // Cursify Proximity spotlight intensity
  let proximityOpacity = 0
  if (isActive && isContainerHovered && cardRef.current) {
    const rect = cardRef.current.getBoundingClientRect()
    const parentRect = cardRef.current.parentElement?.parentElement?.getBoundingClientRect()
    if (parentRect) {
      const cardCenterX = rect.left - parentRect.left + rect.width / 2
      const cardCenterY = rect.top - parentRect.top + rect.height / 2
      const dx = containerMouse.x - cardCenterX
      const dy = containerMouse.y - cardCenterY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 380) {
        proximityOpacity = (1 - dist / 380) * 0.35
      }
    }
  }

  return (
    <article
      ref={cardRef}
      className={`spotlight-card${isCardHovered ? ' is-hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cursify Proximity Spotlight border sheen */}
      {isActive && proximityOpacity > 0 && (
        <div
          className="spotlight-card-sheen"
          style={{
            opacity: proximityOpacity,
            background: `radial-gradient(320px circle at ${localMouse.x || 150}px ${localMouse.y || 100}px, rgba(215, 166, 110, 0.28) 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Cursify Local Focus Spotlight sheen */}
      {isActive && isCardHovered && (
        <div
          className="spotlight-card-sheen"
          style={{
            background: `radial-gradient(280px circle at ${localMouse.x}px ${localMouse.y}px, rgba(255, 255, 255, 0.65) 0%, rgba(215, 166, 110, 0.22) 50%, transparent 80%)`,
          }}
          aria-hidden="true"
        />
      )}

      <div className="spotlight-card-inner">
        <div className="spotlight-card-header">
          <span className="spotlight-card-index">{item.index}</span>
          <span className="spotlight-card-year">{item.year}</span>
        </div>

        <h3 className="spotlight-card-title">{item.title}</h3>
        <p className="spotlight-card-desc">{item.description}</p>

        <div className="spotlight-card-tags">
          {item.tags.map((t) => (
            <span key={t} className="spotlight-card-tag">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
