import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createNightCourt, NightCourt as Scene } from "./nightCourtScene";
import { grainDataUrl } from "../shared/three-utils";
import { useReveal } from "../shared/useReveal";
import { AppleGlyph, Media, PlayGlyph, Words } from "../shared/Media";
import { VersionSwitcher } from "../shared/VersionSwitcher";
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
import "./NightCourt.scss";

const CHAPTERS = [
  { id: "tipoff", num: "00", name: "Tip-off" },
  { id: "predict", num: "01", name: "Predict" },
  { id: "compete", num: "02", name: "Compete" },
  { id: "live", num: "03", name: "Live" },
  { id: "play", num: "04", name: "Play" },
  { id: "final", num: "05", name: "Final" },
];

function StoreLinks() {
  return (
    <div className="nc-stores">
      <a className="nc-store nc-store--solid" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
        <AppleGlyph />
        <span><small>Download on the</small>App Store</span>
      </a>
      <a className="nc-store" href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
        <PlayGlyph />
        <span><small>Get it on</small>Google Play</span>
      </a>
    </div>
  );
}

export function NightCourt() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const [active, setActive] = useState(0);
  const [glFailed, setGlFailed] = useState(false);
  const grain = useMemo(() => grainDataUrl(), []);
  useReveal(rootRef);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    let scene: Scene;
    try {
      scene = createNightCourt(cv);
    } catch {
      setGlFailed(true);
      return;
    }
    sceneRef.current = scene;

    const sections = CHAPTERS.map((c) => document.getElementById(`nc-${c.id}`)!);
    let max = 1;
    const measure = () => {
      max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const times = sections.map((s, i) => (i === 0 ? 0 : Math.min(1, s.offsetTop / max)));
      times[times.length - 1] = 1;
      for (let i = 1; i < times.length; i++) times[i] = Math.max(times[i], times[i - 1] + 0.01);
      scene.setKeyTimes(times);
    };
    const onScroll = () => {
      const y = scrollY;
      scene.setProgress(Math.min(1, y / max));
      let a = 0;
      sections.forEach((s, i) => {
        if (s.offsetTop - innerHeight * 0.45 <= y) a = i;
      });
      setActive(a);
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      scene.setPointer((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    };
    measure();
    onScroll();
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(document.body);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("pointermove", onPointer);
    return () => {
      ro.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("pointermove", onPointer);
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  /* Custom cursor for fine pointers only. */
  useEffect(() => {
    const el = cursorRef.current;
    if (!el || !matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("nc-has-cursor");
    let x = innerWidth / 2, y = innerHeight / 2, sx = x, sy = y, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement;
      el.classList.toggle("is-link", !!t.closest("a, button, summary"));
    };
    const loop = () => {
      sx += (x - sx) * 0.22;
      sy += (y - sy) * 0.22;
      el.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      document.documentElement.classList.remove("nc-has-cursor");
    };
  }, []);

  const go = (id: string) => document.getElementById(`nc-${id}`)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="nc" ref={rootRef}>
      <canvas className="nc-gl" ref={canvasRef} aria-hidden />
      {glFailed && <div className="nc-gl nc-gl--fallback" aria-hidden />}
      <div className="nc-vignette" aria-hidden />
      <div className="nc-grain" style={{ backgroundImage: `url(${grain})` }} aria-hidden />
      <div className="nc-cursor" ref={cursorRef} aria-hidden />

      <header className="nc-nav">
        <Link to="/v1" className="nc-brand" aria-label="BUL home">
          <img src="/images/logo/logo.png" alt="" />
          <span>
            <b>BUL</b>
            <small>Live score club</small>
          </span>
        </Link>
        <nav className="nc-nav__links" aria-label="Chapters">
          {CHAPTERS.slice(1, 5).map((c, i) => (
            <button key={c.id} className={active === i + 1 ? "is-active" : ""} onClick={() => go(c.id)}>
              {c.name}
            </button>
          ))}
        </nav>
        <a className="nc-nav__cta" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
          Get the app
        </a>
      </header>

      <aside className="nc-rail" aria-hidden>
        {CHAPTERS.map((c, i) => (
          <span key={c.id} className={active === i ? "is-active" : ""}>
            {c.num}
          </span>
        ))}
      </aside>

      <main>
        {/* ── 00 Tip-off ─────────────────────────────── */}
        <section id="nc-tipoff" className="nc-hero">
          <div className="nc-hero__copy">
            <p className="nc-eyebrow" data-reveal>
              <i /> Chapter 00 — Tip-off
            </p>
            <h1 className="nc-h1" data-reveal>
              <Words text="Call the score before the buzzer." />
            </h1>
            <p className="nc-lede" data-reveal>
              Predict live NBA &amp; NCAA finals, compete against thousands in real time and climb the
              leaderboard — all with virtual coins, zero risk.
            </p>
            <div data-reveal className="nc-fade">
              <StoreLinks />
            </div>
          </div>

          <p className="nc-vertical" aria-hidden>
            Live · NBA · NCAA · 2026
          </p>

          <div className="nc-wordmark" aria-hidden>
            <span>B</span>
            <span>U</span>
            <span>L</span>
          </div>

          <figure className="nc-mini" data-reveal>
            <div className="nc-mini__frame">
              <Media item={SHOWCASE[2]} />
              <span className="nc-mini__play" aria-hidden>
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M8 5v14l11-7z" /></svg>
              </span>
            </div>
            <figcaption>Q4 — 00:42 left · rank #24</figcaption>
          </figure>

          <button className="nc-scroll" onClick={() => go("predict")}>
            Scroll to enter <i />
          </button>
        </section>

        {/* ── 01 Predict ─────────────────────────────── */}
        <section id="nc-predict" className="nc-chapter">
          <div className="nc-sticky">
            <div className="nc-copy">
              <p className="nc-eyebrow" data-reveal>
                <i /> Chapter 01 — The call
              </p>
              <h2 className="nc-h2" data-reveal>
                <Words text="Ten seconds. One number. No takebacks." />
              </h2>
              <p className="nc-body" data-reveal>{SHOWCASE[1].desc}</p>
              <ol className="nc-steps" data-reveal>
                {STEPS.map((s) => (
                  <li key={s.num}>
                    <span>{s.num}</span>
                    <b>{s.title}</b>
                    <p>{s.desc}</p>
                  </li>
                ))}
              </ol>
            </div>
            <figure className="nc-card nc-card--right" data-reveal>
              <div className="nc-card__media nc-card__media--phone">
                <Media item={SHOWCASE[1]} />
              </div>
              <figcaption>
                <span>{SHOWCASE[1].label}</span>
                {SHOWCASE[1].title}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ── 02 Compete ─────────────────────────────── */}
        <section id="nc-compete" className="nc-chapter">
          <div className="nc-sticky nc-sticky--flip">
            <div className="nc-copy">
              <p className="nc-eyebrow" data-reveal>
                <i /> Chapter 02 — The floor
              </p>
              <h2 className="nc-h2" data-reveal>
                <Words text="The leaderboard moves with every possession." />
              </h2>
              <p className="nc-body" data-reveal>{SHOWCASE[2].desc}</p>
              <dl className="nc-stats" data-reveal>
                <div><dt>4.8</dt><dd>App Store rating</dd></div>
                <div><dt>100%</dt><dd>Free, forever</dd></div>
                <div><dt>0</dt><dd>Real-money purchases</dd></div>
              </dl>
            </div>
            <figure className="nc-card nc-card--left" data-reveal>
              <div className="nc-card__media nc-card__media--phone">
                <Media item={SHOWCASE[2]} />
              </div>
              <figcaption>
                <span>{SHOWCASE[2].label}</span>
                {SHOWCASE[2].title}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ── 03 Live ─────────────────────────────── */}
        <section id="nc-live" className="nc-chapter">
          <div className="nc-sticky">
            <div className="nc-copy">
              <p className="nc-eyebrow" data-reveal>
                <i /> Chapter 03 — Under the lights
              </p>
              <h2 className="nc-h2" data-reveal>
                <Words text="Live scores. Live rank. Live nerves." />
              </h2>
              <p className="nc-body" data-reveal>{SHOWCASE[3].desc}</p>
            </div>
            <div className="nc-pair">
              {[SHOWCASE[3], SHOWCASE[4]].map((s) => (
                <figure key={s.title} className="nc-card" data-reveal>
                  <div className="nc-card__media nc-card__media--phone">
                    <Media item={s} />
                  </div>
                  <figcaption>
                    <span>{s.label}</span>
                    {s.title}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── 04 Play ─────────────────────────────── */}
        <section id="nc-play" className="nc-chapter nc-chapter--tall">
          <div className="nc-sticky nc-sticky--flip">
            <div className="nc-copy">
              <p className="nc-eyebrow" data-reveal>
                <i /> Chapter 04 — Afterlight
              </p>
              <h2 className="nc-h2" data-reveal>
                <Words text="Own your look. Own the night." />
              </h2>
              <p className="nc-body" data-reveal>{SHOWCASE[5].desc}</p>
              <ul className="nc-reviews" data-reveal>
                {REVIEWS.map((r) => (
                  <li key={r.name}>
                    <span className="nc-stars" aria-label="5 stars">★★★★★</span>
                    <b>“{r.title}”</b>
                    <p>{r.text}</p>
                    <small>{r.name} · {r.date}</small>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="nc-card nc-card--left" data-reveal>
              <div className="nc-card__media nc-card__media--phone">
                <Media item={SHOWCASE[5]} />
              </div>
              <figcaption>
                <span>{SHOWCASE[5].label}</span>
                {SHOWCASE[5].title}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ── 05 Final ─────────────────────────────── */}
        <section id="nc-final" className="nc-final">
          <div className="nc-final__inner">
            <p className="nc-eyebrow" data-reveal>
              <i /> Final — The buzzer
            </p>
            <h2 className="nc-h1" data-reveal>
              <Words text="Ready to compete?" />
            </h2>
            <p className="nc-lede" data-reveal>Download BUL and make your first call in under 60 seconds.</p>
            <div data-reveal className="nc-fade">
              <StoreLinks />
            </div>

            <div className="nc-faq" data-reveal>
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <footer className="nc-footer">
            <span>© 2026 BUL</span>
            <nav>
              {LEGAL_LINKS.map((l) => (
                <Link key={l.path} to={l.path}>{l.label}</Link>
              ))}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </nav>
          </footer>
        </section>
      </main>

      <VersionSwitcher />
    </div>
  );
}
