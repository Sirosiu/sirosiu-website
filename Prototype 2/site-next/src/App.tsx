import { useEffect, useState } from 'react'
import PortfolioHero from './PortfolioHero'
import ProjectsPage from './ProjectsPage'
import CanvasCursor from './CanvasCursor'
import OceanSandbox from './OceanSandbox'

const getInitialThemeIsLight = (): boolean => {
  if (typeof window === 'undefined') return false
  try {
    const saved = localStorage.getItem('sirosiu-theme')
    if (saved) return saved === 'light'
    return window.matchMedia('(prefers-color-scheme: light)').matches
  } catch {
    return false
  }
}

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  const [isLight, setIsLight] = useState(getInitialThemeIsLight)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark')
  }, [isLight])

  useEffect(() => {
    const onLocationChange = () => {
      setPathname(window.location.pathname)
    }
    window.addEventListener('popstate', onLocationChange)
    window.addEventListener('hashchange', onLocationChange)
    return () => {
      window.removeEventListener('popstate', onLocationChange)
      window.removeEventListener('hashchange', onLocationChange)
    }
  }, [])

  const handleToggleTheme = (next: boolean) => {
    setIsLight(next)
    try {
      localStorage.setItem('sirosiu-theme', next ? 'light' : 'dark')
    } catch {}
  }

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    const nextPath = path.split('#')[0] || '/'
    setPathname(nextPath)

    const rawHash = path.includes('#') ? path.split('#')[1] : ''
    const targetId = rawHash || (path === '/about' ? 'about' : path === '/contact' ? 'contact' : '')

    if (targetId && targetId !== 'home') {
      let count = 0
      const syncScroll = () => {
        const el = document.getElementById(targetId)
        if (el) {
          const rect = el.getBoundingClientRect()
          const y = rect.top + window.pageYOffset - 20
          window.scrollTo({ top: Math.max(0, y), behavior: count === 0 ? 'auto' : 'smooth' })
        }
        count++
        if (count < 8) {
          setTimeout(syncScroll, 120)
        }
      }
      syncScroll()
    } else if (path === '/' || path === '/#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const isSandbox =
    pathname === '/ocean-sandbox' ||
    pathname.startsWith('/ocean') ||
    window.location.search.includes('ocean')

  if (isSandbox) {
    return (
      <>
        <OceanSandbox onBack={() => navigate('/portfolio-1')} />
        <CanvasCursor />
      </>
    )
  }

  const isProjects =
    pathname === '/projects' ||
    pathname.startsWith('/projects') ||
    window.location.search.includes('projects')

  if (isProjects) {
    return (
      <>
        <ProjectsPage
          navigate={navigate}
          isLight={isLight}
          onToggleTheme={handleToggleTheme}
        />
        <CanvasCursor />
      </>
    )
  }

  return (
    <>
      <PortfolioHero
        isLight={isLight}
        onToggleTheme={handleToggleTheme}
        onNavigate={navigate}
      />
      <CanvasCursor />
    </>
  )
}
