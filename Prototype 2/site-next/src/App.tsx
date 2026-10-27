import { useEffect, useState } from 'react'
import PortfolioHero from './PortfolioHero'
import SmoothCursorFollower from './SmoothCursorFollower'
import OceanSandbox from './OceanSandbox'

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const onPopState = () => {
      setPathname(window.location.pathname)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setPathname(path)
  }

  const isSandbox =
    pathname === '/ocean-sandbox' ||
    pathname.startsWith('/ocean') ||
    window.location.search.includes('ocean')

  if (isSandbox) {
    return (
      <>
        <OceanSandbox onBack={() => navigate('/portfolio-1')} />
        <SmoothCursorFollower />
      </>
    )
  }

  return (
    <>
      <PortfolioHero />
      <SmoothCursorFollower />
    </>
  )
}
