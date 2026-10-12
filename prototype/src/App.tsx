import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { journeyChapters } from "./content/journey";
import SceneExperience from "./scene/SceneExperience";

const nav = [["Projects", "#projects"], ["About", "#about"], ["Capabilities", "#capabilities"], ["Journey", "#journey"], ["Contact", "#contact"]];
const socialLinks = [
  ["GitHub", "https://github.com/Sirosiu"],
  ["LinkedIn", "https://www.linkedin.com/in/ankush-malothia/"],
  ["X", "https://x.com/Sirosiusugi"],
  ["Instagram", "https://www.instagram.com/sirosiu.nyx/"],
];

function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (event: PointerEvent) => {
      if (cursor.current) {
        cursor.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        cursor.current.classList.add("is-visible");
      }
    };
    const show = () => cursor.current?.classList.add("is-visible");
    const hide = () => cursor.current?.classList.remove("is-visible");
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerenter", show);
    window.addEventListener("pointerleave", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerenter", show);
      window.removeEventListener("pointerleave", hide);
    };
  }, []);

  return <div className="custom-cursor" ref={cursor} aria-hidden="true"><i /></div>;
}

function App() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const themeTransitionTimer = useRef<number | null>(null);
  const close = () => setOpen(false);

  useLayoutEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  const switchTheme = () => {
    const root = document.documentElement;
    root.classList.add("theme-transitioning");
    if (themeTransitionTimer.current !== null) window.clearTimeout(themeTransitionTimer.current);
    setTheme((current) => current === "dark" ? "light" : "dark");
    themeTransitionTimer.current = window.setTimeout(() => {
      root.classList.remove("theme-transitioning");
      themeTransitionTimer.current = null;
    }, 520);
  };

  return <><CustomCursor />
    <a className="skip" href="#main">Skip to content</a>
    <header className="header">
      <a className="logo" href="#top" onClick={close}>SIROSIU</a>
      <button className="menu-toggle" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
      <nav id="nav" aria-label="Main navigation" className={open ? "nav open" : "nav"}>{nav.map(([label, href]) => <a key={href} href={href} onClick={close}>{label}</a>)}</nav>
      <small className="edition">PERSONAL PORTFOLIO / 2026</small>
      <button className="theme-toggle" type="button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} onClick={switchTheme}><span aria-hidden="true">{theme === "dark" ? "☼" : "◐"}</span>{theme === "dark" ? "Light mode" : "Dark mode"}</button>
    </header>

    <main id="main">
      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow hero-brand"><i /><strong>SIROSIU</strong><span>INDEPENDENT BUILDER · ECE STUDENT · CURIOUS BY DESIGN</span></p>
          <h1>Too curious<br />to stay <em>still.</em></h1>
          <p className="intro">Building what comes next. SIROSIU is a personal space for exploration, engineering, and building ideas into reality.</p>
          <div className="actions"><a className="button" href="#projects">Enter the archive <span>↘</span></a><a className="underlink" href="#about">Meet the person →</a></div>
          <div className="hero-meta"><span>01 — SIROSIU</span><span>BUILDING WHAT COMES NEXT ↓</span></div>
        </div>
        <div className="visual"><SceneExperience theme={theme} /><p className="caption">FIG. 01 / An opening into the unknown</p></div>
        <span className="side-note">AN EXPERIMENT IN SCALE</span>
      </section>

      <section className="section shell projects-state" id="projects"><div className="section-head"><p className="eyebrow">01 / Selected work</p><h2>Ideas, <em>in formation.</em></h2><p>The project archive is ready. Verified work will appear here as it takes shape.</p><a className="underlink" href="#top">Enter the archive through the gateway ↗</a></div></section>

      <section className="about" id="about"><div className="shell about-grid"><div><p className="eyebrow">02 / About</p><h2>A mind<br />in <em>motion.</em></h2><img className="portrait-cutout" src="/sirosiu-portrait-cutout.png" alt="Ankush holding a small puppet outdoors" /></div><div><p className="about-lede">Curiosity first. Engineering follows.</p><p>I'm an Electronics and Communication Engineering student driven by curiosity, creativity, and the desire to understand how things work. I enjoy exploring ideas, learning new skills, and turning concepts into real projects. Through SIROSIU, I'm building my own space to experiment, grow, and create things that reflect how I think.</p><p>Beyond technology, I'm interested in human behavior, neuroscience, memory, personal development, new places, trekking, music, and questions as large as dark matter. I'm drawn to anything that expands my perspective, builds discipline, or helps me understand the world a little better.</p><p className="note">Ankush · Electronics and Communication Engineering student</p></div><div className="stamp" aria-hidden="true"><b>S</b><small>STAY<br />CURIOUS</small></div></div></section>

      <section className="section shell" id="capabilities"><div className="section-head"><p className="eyebrow">03 / Capabilities</p><h2>Learning by <em>building.</em></h2><p>Technologies I use, study, and explore.</p></div><div className="capabilities">
        <article><small>CURRENT TOOLKIT</small><h3>Software & web</h3><p>React, TypeScript, Vite, JavaScript, Git & GitHub, Supabase, Linux.</p><b>↗</b></article>
        <article><small>HARDWARE EXPLORATION</small><h3>Digital design & RTL</h3><p>Verilog, Icarus Verilog, Verilator, Yosys, GTKWave, AMD Vivado, FPGA design.</p><b>↗</b></article>
        <article><small>CURRENTLY LEARNING</small><h3>Systems direction</h3><p>Computer architecture, AI accelerators, RTL verification, Python & NumPy, C++, applied AI/ML, performance optimization.</p><b>↗</b></article>
      </div></section>

      <section className="journey" id="journey"><div className="shell"><div className="section-head"><p className="eyebrow">04 / Journey</p><h2>Still <em>becoming.</em></h2><p>An honest map of curiosity, reflection, learning, and direction—not a list of invented achievements.</p><a className="underlink" href="#top">Explore the immersive chapter field through the gateway ↗</a></div><div className="timeline journey-overview">
        {journeyChapters.map((chapter) => <article key={chapter.id}><i /><div><p className="eyebrow">{chapter.number} · {chapter.status}</p><h3>{chapter.title}</h3><p>{chapter.quote}</p></div></article>)}
      </div></div></section>

      <section className="contact shell" id="contact"><p className="eyebrow">05 / Contact</p><h2>Let’s build<br /><em>what’s next.</em></h2><p>For collaborations, conversations, and future opportunities, connect through the public profiles below. Email: <a href="mailto:sirosiusugi@gmail.com">sirosiusugi@gmail.com</a></p><p className="contact-state">Open to collaboration.</p><div className="social-links">{socialLinks.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noreferrer">{label} ↗</a>)}<a href="#contact" className="disabled" aria-disabled="true" onClick={(event) => event.preventDefault()}>Résumé in progress ↗</a></div><p className="note">The résumé link will become active when the PDF is ready.</p></section>
    </main>
    <footer className="footer"><a className="logo" href="#top">SIROSIU</a><p>Engineering, intelligence, and imagination.<small>Personal portfolio · 2026</small></p><a href="#top">Back to top ↑</a></footer>
  </>;
}

export default App;
