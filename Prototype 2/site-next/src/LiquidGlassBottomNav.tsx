import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import LiquidGlass from './LiquidGlass'

export type NavTabId = 'home' | 'projects' | 'experience' | 'about' | 'contact'

interface NavTabItem {
  id: NavTabId
  label: string
  icon?: string
}

const NAV_TABS: NavTabItem[] = [
  { id: 'home', label: 'Home', icon: '✦' },
  { id: 'projects', label: 'Projects', icon: '⊞' },
  { id: 'experience', label: 'Experience', icon: '⚡' },
  { id: 'about', label: 'About Me', icon: '◈' },
  { id: 'contact', label: 'Contact', icon: '✉' },
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
  const [isVisible, setIsVisible] = useState(true)
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])
  const lastScrollYRef = useRef(0)
  const isInputFocusedRef = useRef(false)
  const isManualNavigatingRef = useRef(false)
  const manualNavTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  // Intelligent Scroll Direction Awareness:
  // - Hide dock when scrolling down (reading / exploring content)
  // - Reveal dock when scrolling up (navigation intent)
  // - Always show near the top of the page (hero area)
  // - Reveal when reaching the absolute bottom of page (where safe clearance is reserved)
  useEffect(() => {
    if (typeof window === 'undefined') return

    let ticking = false
    lastScrollYRef.current = window.scrollY

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY
          const delta = currentY - lastScrollYRef.current
          const winHeight = window.innerHeight
          const docHeight = document.documentElement.scrollHeight
          const isAtBottom = currentY + winHeight >= docHeight - 40
          const isNearTop = currentY < 80

          if (!isInputFocusedRef.current) {
            if (isNearTop) {
              setIsVisible(true)
            } else if (isAtBottom) {
              setIsVisible(true)
            } else if (delta > 8 && currentY > 100) {
              // Scrolling down: glide dock down out of the way
              setIsVisible(false)
            } else if (delta < -8) {
              // Scrolling up: reveal dock for navigation
              setIsVisible(true)
            }
          }

          lastScrollYRef.current = currentY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-hide when any form input or textarea is focused (e.g. contact form, mobile keyboards)
  useEffect(() => {
    if (typeof document === 'undefined') return

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        isInputFocusedRef.current = true
        setIsVisible(false)
      }
    }

    const handleFocusOut = () => {
      isInputFocusedRef.current = false
      // Reveal dock on blur if not scrolling down or near top/bottom
      setIsVisible(true)
    }

    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)
    return () => {
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
    }
  }, [])

  // Desktop Bottom Proximity Sensor:
  // If desktop user hovers within 80px of the viewport bottom, reveal dock smoothly
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleMouseMove = (e: MouseEvent) => {
      if (isInputFocusedRef.current) return
      if (window.innerHeight - e.clientY < 80) {
        setIsVisible(true)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Dynamic Scroll Spy: Track the actual section currently in view
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.pathname.startsWith('/projects')) return

    let spyTicking = false

    const handleScrollSpy = () => {
      if (isManualNavigatingRef.current) return

      if (!spyTicking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const winHeight = window.innerHeight
          const docHeight = document.documentElement.scrollHeight

          // 1. Bottom of page edge: Viewing Contact / Footer
          if (scrollY + winHeight >= docHeight - 70) {
            setActiveTab((prev) => (prev !== 'contact' ? 'contact' : prev))
            spyTicking = false
            return
          }

          // 2. Top of page edge: Viewing Hero
          if (scrollY < 200) {
            setActiveTab((prev) => (prev !== 'home' ? 'home' : prev))
            spyTicking = false
            return
          }

          // 3. Middle sections: Check reading line (45% from top of viewport)
          const readingLine = winHeight * 0.45
          const sectionMap: { id: NavTabId; elementId: string }[] = [
            { id: 'contact', elementId: 'contact' },
            { id: 'about', elementId: 'about' },
            { id: 'experience', elementId: 'experience' },
            { id: 'projects', elementId: 'work' },
          ]

          for (const sec of sectionMap) {
            const el = document.getElementById(sec.elementId)
            if (el) {
              const rect = el.getBoundingClientRect()
              if (rect.top <= readingLine && rect.bottom > readingLine) {
                setActiveTab((prev) => (prev !== sec.id ? sec.id : prev))
                spyTicking = false
                return
              }
            }
          }

          // Fallback: If above work section, default to home
          const workEl = document.getElementById('work')
          if (workEl && workEl.getBoundingClientRect().top > readingLine) {
            setActiveTab((prev) => (prev !== 'home' ? 'home' : prev))
          }

          spyTicking = false
        })
        spyTicking = true
      }
    }

    window.addEventListener('scroll', handleScrollSpy, { passive: true })
    window.addEventListener('resize', handleScrollSpy)
    handleScrollSpy()
    return () => {
      window.removeEventListener('scroll', handleScrollSpy)
      window.removeEventListener('resize', handleScrollSpy)
    }
  }, [])

  // Keep in sync when initialTab changes (e.g. routing transitions)
  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const handleSelectTab = (id: NavTabId) => {
    setActiveTab(id)
    setIsVisible(true)

    // Briefly lock scroll spy during smooth scroll jump
    isManualNavigatingRef.current = true
    if (manualNavTimerRef.current) clearTimeout(manualNavTimerRef.current)
    manualNavTimerRef.current = setTimeout(() => {
      isManualNavigatingRef.current = false
    }, 950)

    if (onTabChange) {
      onTabChange(id)
    }
  }

  // Caustic Glass Pill geometry: spans the full active tab with 3px inset padding for an organic liquid meniscus
  const gliderLeft = geometry.left + 3
  const gliderWidth = Math.max(20, geometry.width - 6)

  return (
    <nav
      className={`liquid-glass-dock-wrapper${!isVisible ? ' is-hidden' : ''}`}
      aria-label="Quick navigation"
      aria-hidden={!isVisible}
    >
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
