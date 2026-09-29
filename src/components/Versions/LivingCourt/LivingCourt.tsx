import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createLivingCourt, LivingCourt as Scene } from "./livingCourtScene";
import { useReveal } from "../shared/useReveal";
import { AppleGlyph, Media, PlayGlyph } from "../shared/Media";
import {
  APP_STORE_URL,
  FAQS,
  LEGAL_LINKS,
  PLAY_STORE_URL,
  REVIEWS,
  SHOWCASE,
  STEPS,
  SUPPORT_EMAIL,
} from "../shared/content";
import "./LivingCourt.scss";

const DOCK = [
  { id: "grow", label: "Predict", icon: "M12 3v18M3 12h18" },
  { id: "notes", label: "Compete", icon: "M4 18h4V9H4zm6 0h4V5h-4zm6 0h4v-7h-4z" },
  { id: "voices", label: "Fans", icon: "M12 17.3 18.2 21l-1.6-7L22 9.2l-7.2-.6L12 2 9.2 8.6 2 9.2 7.4 14l-1.6 7z" },
  { id: "enter", label: "Get app", icon: "M5 12h14M13 6l6 6-6 6" },
];

function Dock() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState("grow");

  /* Proximity magnification with a rim highlight that tracks the pointer. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-dock]"));
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
      for (const it of items) {
        const b = it.getBoundingClientRect();
        const d = Math.abs(e.clientX - (b.left + b.width / 2));
        const near = Math.abs(e.clientY - (b.top + b.height / 2)) < 90;
        it.style.setProperty("--s", String(near ? 1 + 0.14 * Math.max(0, 1 - d / 150) : 1));
      }
    };
    const leave = () => items.forEach((it) => it.style.setProperty("--s", "1"));
    addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const go = (id: string) => {
    setActive(id);
    document.getElementById(`lc-${id}`)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="lc-dock" ref={ref} aria-label="Sections">
      <Link to="/v3" className="lc-dock__mark" aria-label="BUL home">
        <img src="/images/logo/logo.png" alt="" />
      </Link>
      {DOCK.map((d) => (
        <button
          key={d.id}
          data-dock
          className={`lc-dock__item${active === d.id ? " is-active" : ""}`}
          onClick={() => go(d.id)}
        >
          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden>
            <path d={d.icon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {d.label}
        </button>
      ))}
    </nav>
  );
}

function Stores() {
  return (
    <div className="lc-stores">
      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="lc-pill lc-pill--light">
        <AppleGlyph /> App Store
      </a>
      <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="lc-pill">
        <PlayGlyph /> Google Play
      </a>
    </div>
  );
}

export function LivingCourt() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glFailed, setGlFailed] = useState(false);
  useReveal(rootRef, 0.15);

  useEffect(() => {
    const cv = canvasRef.current;
    const hero = heroRef.current;
    if (!cv || !hero) return;
    let scene: Scene;
    try {
      scene = createLivingCourt(cv);
    } catch {
      setGlFailed(true);
      return;
    }

    /* One rAF eases the pointer and publishes parallax to CSS. */
    const p = { x: 0, y: 0, sx: 0, sy: 0 };
    let raf = 0;
    const loop = () => {
      p.sx += (p.x - p.sx) * 0.06;
      p.sy += (p.y - p.sy) * 0.06;
      hero.style.setProperty("--px", p.sx.toFixed(4));
      hero.style.setProperty("--py", p.sy.toFixed(4));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 - 1;
      const y = -((e.clientY - r.top) / r.height) * 2 + 1;
      const isIn = x > -1 && x < 1 && y > -1 && y < 1;
      scene.setPointerNdc(x, y, isIn);
      if (e.pointerType !== "touch") {
        p.x = (e.clientX / innerWidth) * 2 - 1;
        p.y = (e.clientY / innerHeight) * 2 - 1;
      }
    };
    const leave = () => scene.setPointerNdc(10, 10, false);
    const io = new IntersectionObserver(([e]) => scene.setActive(e.isIntersecting));
    io.observe(hero);
    addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      scene.dispose();
    };
  }, []);

  return (
    <div className="lc" ref={rootRef}>
      <Dock />

      <section className="lc-hero" ref={heroRef} id="lc-top">
        <div className="lc-hero__word" aria-hidden>BUL</div>
        <canvas ref={canvasRef} className="lc-gl" aria-hidden />
        {glFailed && <div className="lc-gl lc-gl--fallback" aria-hidden />}

        <div className="lc-hero__head lc-par" style={{ ["--d" as string]: 0.6 }}>
          <h1 className="lc-h1">
            <span className="lc-line"><span>Step into</span></span>
            <span className="lc-line"><span>the live game</span></span>
          </h1>
        </div>
        <div className="lc-hero__aside lc-par lc-in" style={{ ["--d" as string]: 0.35, ["--delay" as string]: "0.5s" }}>
          <p>
            Call live NBA &amp; NCAA scores, climb the leaderboard with every basket, and play free —
            no real money, ever.
          </p>
          <Stores />
        </div>

        <a className="lc-play lc-in" href="#lc-notes" style={{ ["--delay" as string]: "0.9s" }} aria-label="Watch the app">
          <span><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M8 5v14l11-7z" /></svg></span>
        </a>

        <div className="lc-cards">
          <article className="lc-card lc-card--ethos lc-par lc-in" style={{ ["--d" as string]: -0.8, ["--delay" as string]: "0.7s" }}>
            <div className="lc-card__img">
              <img src="/images/showcase/pick-your-game.jpeg" alt="Tonight's games inside BUL" />
            </div>
            <p className="lc-card__k">Our game</p>
            <h2>Call the final score.</h2>
            <button className="lc-knob" aria-label="How it works" onClick={() => document.getElementById("lc-grow")?.scrollIntoView({ behavior: "smooth" })}>
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </article>
          <article className="lc-card lc-card--note lc-par lc-in" style={{ ["--d" as string]: -1.3, ["--delay" as string]: "0.95s" }}>
            <p className="lc-card__k">Field note 07</p>
            <h2>Every basket moves you.</h2>
            <div className="lc-card__img lc-card__img--video">
              <Media item={SHOWCASE[2]} />
            </div>
          </article>
          <ul className="lc-facts lc-par lc-in" style={{ ["--d" as string]: -0.5, ["--delay" as string]: "1.1s" }}>
            <li><i>★</i><span>App Store rating<b>4.8</b></span></li>
            <li><i>◎</i><span>Real-money purchases<b>0</b></span></li>
          </ul>
        </div>

        <p className="lc-discover" aria-hidden>Move to brush the court</p>
      </section>

      {/* ── how it grows ─────────────────────────────── */}
      <section className="lc-sec" id="lc-grow">
        <header className="lc-sec__head" data-reveal>
          <p className="lc-k">How it works</p>
          <h2>Three moves. Every game night.</h2>
        </header>
        <div className="lc-steps">
          {STEPS.map((s) => (
            <article key={s.num} className="lc-tile" data-reveal>
              <span className="lc-tile__num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── field notes ─────────────────────────────── */}
      <section className="lc-sec" id="lc-notes">
        <header className="lc-sec__head" data-reveal>
          <p className="lc-k">Field notes</p>
          <h2>Inside the app.</h2>
        </header>
        <div className="lc-notes">
          {SHOWCASE.map((item, i) => (
            <article key={item.title} className="lc-note" data-reveal>
              <div className="lc-note__phone">
                <Media item={item} />
              </div>
              <div className="lc-note__body">
                <p className="lc-k">Note {String(i + 1).padStart(2, "0")} · {item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── voices ─────────────────────────────── */}
      <section className="lc-sec" id="lc-voices">
        <header className="lc-sec__head" data-reveal>
          <p className="lc-k">Voices</p>
          <h2>Loved in the stands.</h2>
        </header>
        <div className="lc-steps">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="lc-tile lc-tile--quote" data-reveal>
              <span className="lc-stars" aria-label="5 stars">★★★★★</span>
              <blockquote>“{r.text}”</blockquote>
              <figcaption><b>{r.name}</b> · {r.date}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── enter ─────────────────────────────── */}
      <section className="lc-sec" id="lc-enter">
        <div className="lc-cta" data-reveal>
          <p className="lc-k">Free forever</p>
          <h2>Ready when tip-off is.</h2>
          <p>Download BUL and make your first call in under sixty seconds.</p>
          <Stores />
        </div>
        <div className="lc-faq" data-reveal>
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <footer className="lc-footer">
          <span>© 2026 BUL</span>
          <nav>
            {LEGAL_LINKS.map((l) => (
              <Link key={l.path} to={l.path}>{l.label}</Link>
            ))}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </nav>
        </footer>
      </section>

    </div>
  );
}
