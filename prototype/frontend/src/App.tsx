import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import Lenis from "lenis";
import { journeyChapters } from "./content/journey";

const LandscapeHero = lazy(() => import("./scene/LandscapeHero"));

const navigation = [
  ["Work", "#projects"],
  ["About", "#about"],
  ["Capabilities", "#capabilities"],
  ["Journey", "#journey"],
  ["Contact", "#contact"],
];

const socials = [
  ["GitHub", "https://github.com/Sirosiu"],
  ["LinkedIn", "https://www.linkedin.com/in/ankush-malothia/"],
  ["X", "https://x.com/Sirosiusugi"],
  ["Instagram", "https://www.instagram.com/sirosiu.nyx/"],
];

function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      smoothWheel: true,
      syncTouch: false,
    });
    return () => lenis.destroy();
  }, []);
  return null;
}

function CustomCursor() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const node = document.querySelector<HTMLElement>(".cursor-orbit");
    if (!node) return;
    const onMove = (event: PointerEvent) => {
      node.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      node.classList.add("is-visible");
    };
    const onLeave = () => node.classList.remove("is-visible");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return <div className="cursor-orbit" aria-hidden="true"><i /></div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return <>
    <SmoothScroll />
    <CustomCursor />
    <a className="skip-link" href="#main">Skip to content</a>

    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="SIROSIU, back to top">SIROSIU</a>
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? "Close" : "Menu"}</button>
      <nav id="site-nav" className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label="Main navigation">
        {navigation.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <button className="theme-toggle" type="button" onClick={() => setTheme((value) => value === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} appearance`}><span aria-hidden="true">{theme === "light" ? "◐" : "☼"}</span>{theme === "light" ? "Dark" : "Light"}</button>
    </header>

    <main id="main">
      <section className="hero" id="top" aria-labelledby="hero-title">
        <Suspense fallback={<div className="hero-world-fallback" aria-hidden="true" />}><LandscapeHero /></Suspense>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-content">
          <p className="hero-intro"><span className="intro-pulse" aria-hidden="true" /> An independent space for curiosity</p>
          <p className="hero-hello">Hello, I’m</p>
          <h1 id="hero-title">SIROSIU<span>.</span></h1>
          <p className="hero-line">Curiosity has a world<br />of its <em>own.</em></p>
          <p className="hero-description">Building what comes next. Exploring engineering, intelligent systems, and ideas that make me look closer.</p>
          <div className="hero-actions"><a className="button button-light" href="#about">Meet Ankush <span aria-hidden="true">↘</span></a><a className="text-link text-link-light" href="#journey">Follow the curiosity <span aria-hidden="true">↓</span></a></div>
          <div className="hero-bottom"><span>ECE STUDENT · INDEPENDENT BUILDER</span><span>01 / A WORLD STILL TAKING SHAPE</span></div>
        </div>
        <a className="scroll-cue" href="#projects" aria-label="Scroll to the work section"><span>Scroll to explore</span><i aria-hidden="true" /></a>
        <p className="environment-credit">SUNSET FOREST ENVIRONMENT · POLY HAVEN / CC0</p>
      </section>

      <section className="projects section-shell" id="projects" aria-labelledby="projects-title">
        <div className="section-index"><span>01</span><span>Selected work</span></div>
        <div className="projects-grid">
          <div><p className="eyebrow">The work archive</p><h2 id="projects-title">Ideas, made<br /><em>tangible.</em></h2></div>
          <div className="projects-note"><p>A couple of things I’m building: one explores fraud detection workflows; the other is the evolving home of SIROSIU.</p><a className="text-link" href="https://github.com/Sirosiu" target="_blank" rel="noreferrer">Explore my GitHub <span aria-hidden="true">↗</span></a></div>
        </div>
        <div className="project-cards">
          <article className="project-card project-card-fraud">
            <div className="project-card-art" aria-hidden="true"><span className="fraud-orbit fraud-orbit-one" /><span className="fraud-orbit fraud-orbit-two" /><span className="fraud-core">F</span><span className="fraud-signal">SIGNAL / ANALYSIS</span></div>
            <div className="project-card-copy"><div className="project-card-meta"><span>01 / APPLICATION</span><span>IN DEVELOPMENT</span></div><h3>FraudLens</h3><p>A fraud-monitoring prototype combining a simulated transaction stream, a machine-learning classifier, and an alert-review dashboard.</p><div className="project-tags"><span>Next.js</span><span>FastAPI</span><span>XGBoost</span><span>SQLite</span></div><a href="https://github.com/Sirosiu/Fraudlens" target="_blank" rel="noreferrer" aria-label="View FraudLens on GitHub">View repository <span aria-hidden="true">↗</span></a></div>
          </article>
          <article className="project-card project-card-site">
            <div className="project-card-art" aria-hidden="true"><span className="site-window"><i /><i /><i /><b /><b /><b /></span><span className="site-coordinate">SIROSIU / 01</span></div>
            <div className="project-card-copy"><div className="project-card-meta"><span>02 / PERSONAL PLATFORM</span><span>ONGOING</span></div><h3>SIROSIU Website</h3><p>A personal portfolio shaped around engineering, curiosity, and an evolving creative direction—with an immersive 3D landscape.</p><div className="project-tags"><span>React</span><span>TypeScript</span><span>Three.js</span><span>Vite</span></div><a href="https://github.com/Sirosiu/sirosiu-website" target="_blank" rel="noreferrer" aria-label="View the SIROSIU website source on GitHub">View repository <span aria-hidden="true">↗</span></a></div>
          </article>
        </div>
        <div className="archive-rule"><span>PROJECT ARCHIVE</span><span>2 BUILDS · STILL IN MOTION</span></div>
      </section>

      <section className="about section-shell" id="about" aria-labelledby="about-title">
        <div className="section-index"><span>02</span><span>The person behind the name</span></div>
        <div className="about-grid">
          <div className="about-portrait"><div className="portrait-caption"><span>ANKUSH</span><span>ECE · ALWAYS CURIOUS</span></div><img src="/sirosiu-portrait-cutout.png" alt="Ankush, the person behind SIROSIU" loading="lazy" /></div>
          <div className="about-copy"><p className="eyebrow">A mind in motion</p><h2 id="about-title">Curiosity first.<br /><em>Engineering follows.</em></h2>
            <p>I’m Ankush, an Electronics and Communication Engineering student driven by curiosity, creativity, and the desire to understand how things work. I enjoy exploring ideas, learning new skills, and turning concepts into real projects. Through SIROSIU, I’m building a space to experiment, grow, and create things that reflect how I think.</p>
            <p>Beyond technology, I’m interested in human behavior, neuroscience, memory, new places, trekking, music, and questions as large as dark matter. I’m drawn to anything that expands my perspective or helps me understand the world a little better.</p>
            <div className="about-footnote"><span>Currently pursuing</span><span>B.Tech · Electronics & Communication Engineering<br />National Institute of Technology, Jalandhar</span></div>
          </div>
        </div>
      </section>

      <section className="capabilities section-shell" id="capabilities" aria-labelledby="capabilities-title">
        <div className="section-index"><span>03</span><span>Tools & direction</span></div>
        <div className="section-heading"><p className="eyebrow">Capabilities</p><h2 id="capabilities-title">Learning by <em>building.</em></h2><p>Technologies I use, study, and explore—kept distinct so interests don’t read like credentials.</p></div>
        <div className="capability-list">
          <article><span className="capability-number">01</span><div><p className="eyebrow">Current toolkit</p><h3>Software & web</h3></div><p>React · TypeScript · Vite · JavaScript · Git & GitHub · Supabase · Linux</p><span className="capability-mark" aria-hidden="true">↗</span></article>
          <article><span className="capability-number">02</span><div><p className="eyebrow">Hardware exploration</p><h3>Digital design & RTL</h3></div><p>Verilog · Icarus Verilog · Verilator · Yosys · GTKWave · AMD Vivado · FPGA design</p><span className="capability-mark" aria-hidden="true">↗</span></article>
          <article><span className="capability-number">03</span><div><p className="eyebrow">Areas of active learning</p><h3>Systems & intelligence</h3></div><p>Computer architecture · AI accelerators · RTL verification · Python & NumPy · C++ · applied AI/ML · performance optimization</p><span className="capability-mark" aria-hidden="true">↗</span></article>
        </div>
      </section>

      <section className="journey section-shell" id="journey" aria-labelledby="journey-title">
        <div className="section-index"><span>04</span><span>A life still unfolding</span></div>
        <div className="journey-heading"><div><p className="eyebrow">Journey</p><h2 id="journey-title">Still <em>becoming.</em></h2></div><p>A path through childhood curiosity, the cosmos, change, learning, and an open horizon. No dates added; no chapter presented as finished.</p></div>
        <div className="journey-list">{journeyChapters.map((chapter) => <article key={chapter.id}><span className="journey-number">{chapter.number}</span><div><p className="eyebrow">{chapter.status}</p><h3>{chapter.title}</h3></div><p className="journey-quote">“{chapter.quote}”</p></article>)}</div>
      </section>

      <section className="contact section-shell" id="contact" aria-labelledby="contact-title">
        <div className="section-index"><span>05</span><span>Open to collaboration</span></div>
        <div className="contact-grid"><div><p className="eyebrow">Get in touch</p><h2 id="contact-title">Let’s see<br />what <em>opens.</em></h2><p>For collaborations, thoughtful conversations, or future opportunities.</p></div>
          <div className="contact-details"><a className="email-link" href="mailto:sirosiusugi@gmail.com">sirosiusugi@gmail.com <span aria-hidden="true">↗</span></a><p className="availability"><i aria-hidden="true" /> Open to collaboration</p><div className="social-list">{socials.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noreferrer">{label}<span aria-hidden="true">↗</span></a>)}</div><p className="resume-note">Résumé in progress · coming soon</p></div>
        </div>
      </section>
    </main>

    <footer className="site-footer"><a className="wordmark" href="#top">SIROSIU</a><p>Building what comes next.<span>© 2026 SIROSIU · A personal portfolio by Ankush</span></p><a className="back-top" href="#top">Back to the beginning ↑</a></footer>
  </>;
}

export default App;
