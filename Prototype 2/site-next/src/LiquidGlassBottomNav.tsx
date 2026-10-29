import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import LiquidGlass from './LiquidGlass'

export type NavTabId = 'home' | 'about' | 'projects'

interface NavTabItem {
  id: NavTabId
  label: string
  icon?: string
}

const NAV_TABS: NavTabItem[] = [
  { id: 'home', label: 'Home', icon: '✦' },
  { id: 'about', label: 'About Me', icon: '◈' },
  { id: 'projects', label: 'Projects', icon: '⊞' },
]

interface LiquidGlassBottomNavProps {
  initialTab?: NavTabId
  onTabChange?: (tab: NavTabId) => void
}

export default function LiquidGlassBottomNav({
  initialTab = 'home',
  onTabChange,
}: LiquidGlassBottomNavProps) {
  const [activeTab, setActiveTab] = useState<NavTabId>(initialTab)
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])

  // Measure tab dimensions with font-readiness protection
  const [geometry, setGeometry] = useState<{
    left: number
    width: number
    centerX: number
    ready: boolean
  }>({
    left: 0,
    width: 0,
    centerX: 0,
    ready: false,
  })

  const updatePosition = () => {
    const activeIndex = NAV_TABS.findIndex((tab) => tab.id === activeTab)
    const activeEl = buttonsRef.current[activeIndex]
    if (activeEl) {
      setGeometry({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        centerX: activeEl.offsetLeft + activeEl.offsetWidth / 2,
        ready: true,
      })
    }
  }

  useLayoutEffect(() => {
    updatePosition()
    window.addEventListener('resize', updatePosition)
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(updatePosition)
    }
    const timer = setTimeout(updatePosition, 100)
    return () => {
      window.removeEventListener('resize', updatePosition)
      clearTimeout(timer)
    }
  }, [activeTab])

  // Scroll spy: automatically sync active tab with scroll position on homepage
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.pathname.startsWith('/projects')) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const aboutEl = document.getElementById('about')

      if (aboutEl) {
        const rect = aboutEl.getBoundingClientRect()
        // If about section is in the primary reading area of viewport
        if (rect.top <= window.innerHeight * 0.55 && rect.bottom >= 120) {
          if (activeTab !== 'about') setActiveTab('about')
          return
        }
      }

      if (scrollY < 350) {
        if (activeTab !== 'home') setActiveTab('home')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeTab])

  // Keep in sync when initialTab changes (e.g. routing transitions)
  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const handleSelectTab = (id: NavTabId) => {
    setActiveTab(id)
    if (onTabChange) {
      onTabChange(id)
    }
  }

  // Caustic Glass Pill geometry: spans the full active tab with 3px inset padding for an organic liquid meniscus
  const gliderLeft = geometry.left + 3
  const gliderWidth = Math.max(20, geometry.width - 6)

  return (
    <nav className="liquid-glass-dock-wrapper" aria-label="Quick navigation">
      {/* Main Liquid Glass Shell */}
      <LiquidGlass
        radius={999}
        bevelDepth={14}
        scale={28}
        aberration={3.5}
        frost={0.35}
        tint={0.1}
        className="liquid-glass-dock-shell"
        contentClassName="liquid-glass-dock-inner glider-concept-caustic-pill"
      >
        {/* Caustic Glass Pillow: Full-span liquid meniscus with lateral amber fade */}
        <div
          className="glider-caustic-pill"
          style={{
            transform: `translateX(${gliderLeft}px)`,
            width: `${gliderWidth}px`,
            opacity: geometry.ready ? 1 : 0,
          }}
          aria-hidden="true"
        />

        {/* Tab Buttons */}
        {NAV_TABS.map((tab, idx) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              ref={(el) => {
                buttonsRef.current[idx] = el
              }}
              type="button"
              className={`liquid-glass-dock-item${isActive ? ' is-active' : ''}`}
              onClick={() => handleSelectTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="liquid-glass-dock-icon" aria-hidden="true">
                {tab.icon}
              </span>
              <span className="liquid-glass-dock-label">{tab.label}</span>
            </button>
          )
        })}
      </LiquidGlass>
    </nav>
  )
}
