import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createNightCourt, NightCourt as Scene } from "./nightCourtScene";
import { grainDataUrl } from "../shared/three-utils";
import { useReveal } from "../shared/useReveal";
import { AppleGlyph, Media, PlayGlyph, Words } from "../shared/Media";
import { VersionSwitcher } from "../shared/VersionSwitcher";
import { APP_STORE_URL, INSTAGRAM_URL, PLAY_STORE_URL, SUPPORT_EMAIL } from "../shared/content";
import { Act, FAQS, FOOTER_LINKS, HERO_SYSTEM_ITEMS, REVIEWS, SHOWCASE, STATS, STEPS } from "./content";
import "./NightCourt.scss";

/* Each chapter anchors one camera key in the scene, in order. */
const CHAPTERS = [
  { id: "tipoff", num: "00", name: "Tip-off" },
  { id: "predict", num: "01", name: "Predict" },
  { id: "compete", num: "02", name: "Compete" },
  { id: "live", num: "03", name: "Live" },
  { id: "play", num: "04", name: "Play" },
  { id: "final", num: "05", name: "Final" },
];

const ICON = "/images/logo/b-centered.png";

function StoreLinks() {
  return (
    <div className="nc-stores">
      <a className="nc-store nc-store--white" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
        <AppleGlyph />
        <span><small>Download on the</small>App Store</span>
      </a>
      <a className="nc-store nc-store--rose" href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
        <PlayGlyph />
        <span><small>GET IT ON</small>Google Play</span>
      </a>
    </div>
  );
}

function ShowcaseAct({ act, index }: { act: Act; index: number }) {
  const phoneLeft = index % 2 === 0;
  return (
    <article
      className={`nc-act nc-act--${act.accent}${phoneLeft ? "" : " nc-act--flip"}${act.featured ? " nc-act--featured" : ""}`}
    >
      {act.featured && <span className="nc-act__lock" data-reveal>Prediction locked</span>}
      <div className="nc-phone" data-reveal>
        <Media item={act} />
      </div>
      <div className="nc-act__copy">
        <p className="nc-label" data-reveal>{act.label}</p>
        <h3 className="nc-act__title" data-reveal>
          <Words text={act.title} />
        </h3>
        <p className="nc-body" data-reveal>{act.desc}</p>
      </div>
    </article>
  );
}

function useScrolledPast(y: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(scrollY > y);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [y]);
  return past;
}

function StickyBar() {
  const show = useScrolledPast(600);
  return (
    <div className={`nc-bar${show ? " is-shown" : ""}`}>
      <img src={ICON} alt="" />
      <span>Download BUL</span>
      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer"><AppleGlyph /> App Store</a>
      <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer"><PlayGlyph /> Google Play</a>
    </div>
  );
}

export function NightCourt() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [glFailed, setGlFailed] = useState(false);
  const scrolled = useScrolledPast(40);
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

      <header className={`nc-nav${scrolled ? " is-scrolled" : ""}`}>
        <Link to="/v1" className="nc-brand" aria-label="BUL home">
          <img src={ICON} alt="" />
          <span>
            <b>BUL</b>
            <small>Live Sports Competition</small>
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
        {/* ── Hero ─────────────────────────────── */}
        <section id="nc-tipoff" className="nc-hero">
          <ul className="nc-system" data-reveal>
            {HERO_SYSTEM_ITEMS.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <div className="nc-hero__copy">
            <p className="nc-eyebrow" data-reveal>
              <i /> Live Sports Gaming · NBA · NCAA
            </p>
            <h1 className="nc-h1" data-reveal>
              <span className="nc-line"><Words text="PREDICT." /></span>
              <span className="nc-line"><Words text="COMPETE." start={1} /></span>
              <span className="nc-line"><Words text="DOMINATE." start={2} /></span>
            </h1>
            <p className="nc-lede" data-reveal>
              Call live NBA &amp; NCAA scores, compete against thousands in real-time, and climb the global
              leaderboards — all with virtual coins, zero risk.
            </p>
            <div data-reveal>
              <StoreLinks />
            </div>
            <p className="nc-proof" data-reveal>
              <span>4.8 · App Store</span>
              <i />
              <span>100% Free Forever</span>
            </p>
          </div>

          <div className="nc-wordmark" aria-hidden>
            <span>B</span>
            <span>U</span>
            <span>L</span>
          </div>

          <button className="nc-scroll" onClick={() => go("predict")}>
            Scroll to enter <i />
          </button>
        </section>

        {/* ── Stats ─────────────────────────────── */}
        <section className="nc-stats" aria-label="Highlights">
          {STATS.map((s) => (
            <div key={s.label} data-reveal>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </section>

        {/* ── How it works ─────────────────────────────── */}
        <section id="nc-predict" className="nc-sec">
          <h2 className="nc-h2 nc-center" data-reveal>
            <Words text="THREE STEPS TO WIN" />
          </h2>
          <div className="nc-steps">
            {STEPS.map((s, i) => (
              <article key={s.num} className={`nc-step nc-step--${i === 1 ? "rose" : "violet"}`} data-reveal>
                <span className="nc-step__num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Showcase ─────────────────────────────── */}
        <section id="nc-compete" className="nc-sec nc-showcase">
          {SHOWCASE.slice(0, 2).map((a, i) => <ShowcaseAct key={a.title} act={a} index={i} />)}
        </section>
        <section id="nc-live" className="nc-featured">
          <ShowcaseAct act={SHOWCASE[2]} index={2} />
        </section>
        <section className="nc-sec nc-showcase">
          {SHOWCASE.slice(3).map((a, i) => <ShowcaseAct key={a.title} act={a} index={i + 3} />)}
        </section>

        {/* ── Reviews ─────────────────────────────── */}
        <section id="nc-play" className="nc-sec">
          <h2 className="nc-h2 nc-center" data-reveal>
            <Words text="LOVED BY THOUSANDS" />
          </h2>
          <p className="nc-rating" data-reveal>
            <span className="nc-stars" aria-hidden>★★★★★</span> 4.8 out of 5
          </p>
          <div className="nc-reviews">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="nc-review" data-reveal>
                <span className="nc-stars" aria-label="5 stars">★★★★★</span>
                <b>"{r.title}"</b>
                <blockquote>{r.text}</blockquote>
                <figcaption>
                  <i className={`nc-avatar nc-avatar--${r.accent}`}>{r.initials}</i>
                  <span>
                    {r.name}
                    <small>{r.date} · App Store</small>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ── FAQ, CTA, footer ─────────────────────────────── */}
        <section id="nc-final" className="nc-sec nc-final">
          <h2 className="nc-h2 nc-center" data-reveal>
            <Words text="COMMON QUESTIONS" />
          </h2>
          <div className="nc-faq" data-reveal>
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <div className="nc-cta" data-reveal>
            <h2 className="nc-h2">READY TO COMPETE?</h2>
            <p className="nc-lede">Download BUL and make your first prediction in under 60 seconds.</p>
            <StoreLinks />
          </div>

          <footer className="nc-footer">
            <div className="nc-footer__top">
              <div className="nc-footer__brand">
                <img src="/images/logo/wordmark.png" alt="BUL" />
                <span>Live Sports Gaming</span>
              </div>
              <div className="nc-footer__nav">
                <nav>
                  {FOOTER_LINKS.map((l) => (
                    <Link key={l.path} to={l.path}>{l.label}</Link>
                  ))}
                </nav>
                <a className="nc-social" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <p className="nc-footer__legal">
              © 2026 BUL. All rights reserved. · <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </p>
          </footer>
        </section>
      </main>

      <StickyBar />
      <VersionSwitcher />
    </div>
  );
}
