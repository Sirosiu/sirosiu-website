import ThemeToggleSwitch from './ThemeToggleSwitch'

interface GlobalSiteFooterProps {
  isLight?: boolean
  onToggleTheme?: (next: boolean) => void
}

export default function GlobalSiteFooter({ isLight, onToggleTheme }: GlobalSiteFooterProps = {}) {
  return (
    <footer
      className="global-site-footer"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="global-site-footer-inner">
        <div className="footer-left">
          <span className="footer-brand">ANKUSH MALOTHIA // SIROSIU</span>
          <span className="footer-creds">
            ELECTRONICS &amp; COMMUNICATION ENGINEERING · SYSTEMS ARCHITECT
          </span>
        </div>

        <div className="footer-center">
          <span className="footer-tech-stack">
            BUILT WITH REACT 19 · TYPESCRIPT · ACETERNITY LIQUID GLASS · HOSTED ON CLOUDFLARE PAGES
          </span>
        </div>

        <div className="footer-right">
          {onToggleTheme && (
            <div className="footer-theme-toggle-wrap">
              <span className="footer-theme-label">THEME</span>
              <ThemeToggleSwitch isLight={isLight} onToggle={onToggleTheme} />
            </div>
          )}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="footer-back-to-top"
            aria-label="Back to top of page"
          >
            BACK TO TOP ↑
          </button>
          <span className="footer-copy">© {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </footer>
  )
}
