import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BUILD_T, BuildHandle, createBuild, PRESETS, STAGES } from "./theBuildScene";
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
import "./TheBuild.scss";

function Stores({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  return (
    <div className={`tb-stores tb-stores--${tone}`}>
      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
        <AppleGlyph /> App Store
      </a>
      <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
        <PlayGlyph /> Google Play
      </a>
    </div>
  );
}

export function TheBuild() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLInputElement>(null);
  const handle = useRef<BuildHandle | null>(null);
  const [stage, setStage] = useState(0);
  const [preset, setPreset] = useState(0);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const [glFailed, setGlFailed] = useState(false);
  useReveal(rootRef);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    let lastStage = -2;
    let lastDone = false;
    let h: BuildHandle;
    try {
      h = createBuild(cv, (t, pct, st) => {
        if (pctRef.current) pctRef.current.textContent = String(pct);
        if (timeRef.current) timeRef.current.textContent = `${t.toFixed(2)} / ${BUILD_T.toFixed(2)}`;
        if (barRef.current && document.activeElement !== barRef.current) barRef.current.value = String(t);
        if (st !== lastStage) {
          lastStage = st;
          setStage(st);
        }
        const d = t >= BUILD_T;
        if (d !== lastDone) {
          lastDone = d;
          setDone(d);
        }
      });
    } catch {
      setGlFailed(true);
      return;
    }
    handle.current = h;

    const io = new IntersectionObserver(([e]) => h.setActive(e.isIntersecting), { threshold: 0 });
    if (heroRef.current) io.observe(heroRef.current);
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      h.setPointer((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    };
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || scrollY > innerHeight * 0.6) return;
      if (e.code === "Space") {
        e.preventDefault();
        setPaused(h.togglePause());
      } else if (e.key.toLowerCase() === "c") h.recenter();
    };
    addEventListener("pointermove", onPointer);
    addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      removeEventListener("pointermove", onPointer);
      removeEventListener("keydown", onKey);
      h.dispose();
      handle.current = null;
    };
  }, []);

  const s = STAGES[Math.max(0, stage)] ?? STAGES[STAGES.length - 1];
  const stageLabel = done ? "Final · Buzzer" : `${s.q} · ${s.name}`;

  return (
    <div className="tb" ref={rootRef}>
      <section className={`tb-hero${preset === 3 ? " tb-hero--night" : ""}`} ref={heroRef}>
        <canvas ref={canvasRef} className="tb-gl" aria-label="An arena building itself from the ground up. Drag to orbit." />
        {glFailed && <div className="tb-gl tb-gl--fallback" />}
        <div className="tb-guides" aria-hidden>
          <i />
          <i />
        </div>

        <header className="tb-bar">
          <Link to="/v2" className="tb-logo">BUL</Link>
          <span className="tb-bar__mid">Construction study / 01</span>
          <nav className="tb-bar__ctl" aria-label="Scene controls">
            <button onClick={() => { const n = (preset + 1) % PRESETS.length; setPreset(n); handle.current?.setPreset(n); }}>
              Time / {PRESETS[preset]}
            </button>
            <button onClick={() => setPaused(handle.current?.togglePause() ?? false)}>
              Build / {paused ? "Paused" : "Live"}
            </button>
            <button onClick={() => handle.current?.recenter()}>View / Recenter</button>
            <button onClick={() => { handle.current?.rebuild(); setPaused(false); }}>↻ Rebuild</button>
          </nav>
        </header>

        <div className="tb-left">
          <p className="tb-meta">Game / 0247</p>
          <h1 className="tb-display">
            Game night,
            <br />
            <em>built live.</em>
          </h1>
          <p className="tb-kicker">Arena growth study</p>
          <p className="tb-quote">
            “The viewpoint never moves. Concrete, maple and steel rise from the ground up — the way a
            game builds from tip-off to the final buzzer.”
          </p>
          <Stores />
          <div className="tb-index" aria-hidden>
            <span>{String(Math.min(5, Math.max(1, stage + 1 + (done ? 1 : 0)))).padStart(2, "0")}</span>
            <i />
            <span>05</span>
          </div>
        </div>

        <div className="tb-right" aria-hidden>
          <div className="tb-shapes">◐ △ ◇</div>
          <p className="tb-big">
            Call
            <br />
            it.
          </p>
          <p className="tb-big-sub">(Predict · Compete · Dominate)</p>
        </div>

        <div className={`tb-stage${done ? " is-done" : ""}`} aria-live="polite">{stageLabel}</div>

        <div className="tb-pct" aria-hidden>
          <small>Live build</small>
          <span ref={pctRef}>0</span>
          <sup>%</sup>
        </div>

        <div className="tb-timeline">
          <button
            className="tb-timeline__btn"
            aria-label={paused ? "Resume build" : "Pause build"}
            onClick={() => setPaused(handle.current?.togglePause() ?? false)}
          >
            {paused ? "▶" : "❙❙"}
          </button>
          <input
            ref={barRef}
            type="range"
            min={0}
            max={BUILD_T}
            step={0.01}
            defaultValue={0}
            aria-label="Scrub the build"
            onInput={(e) => {
              handle.current?.seek(parseFloat((e.target as HTMLInputElement).value));
              if (!paused) setPaused(handle.current?.togglePause() ?? true);
            }}
          />
          <span ref={timeRef} className="tb-timeline__t">0.00 / 5.20</span>
        </div>
        <p className="tb-hint">Drag to orbit · Space to pause · C to recenter</p>
      </section>

      {/* ── playbook ─────────────────────────────── */}
      <section className="tb-sec tb-play">
        <header className="tb-sec__head" data-reveal>
          <span>§ 01</span>
          <h2>The playbook</h2>
          <p>Three moves, every game night.</p>
        </header>
        <div className="tb-play__grid">
          {STEPS.map((st) => (
            <article key={st.num} data-reveal>
              <span className="tb-num">{st.num}</span>
              <h3>{st.title}</h3>
              <p>{st.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── plates ─────────────────────────────── */}
      <section className="tb-sec tb-plates">
        <header className="tb-sec__head" data-reveal>
          <span>§ 02</span>
          <h2>Plates from the app</h2>
          <p>Six rooms inside BUL, photographed live.</p>
        </header>
        <div className="tb-plates__grid">
          {SHOWCASE.map((item, i) => (
            <figure key={item.title} className="tb-plate" data-reveal>
              <div className="tb-plate__meta">
                <span>Plate {String(i + 1).padStart(2, "0")}</span>
                <span>{item.label}</span>
              </div>
              <div className="tb-plate__phone">
                <Media item={item} />
              </div>
              <figcaption>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── reviews ─────────────────────────────── */}
      <section className="tb-sec tb-reviews">
        <header className="tb-sec__head" data-reveal>
          <span>§ 03</span>
          <h2>From the stands</h2>
          <p>4.8 ★ on the App Store.</p>
        </header>
        <div className="tb-reviews__grid">
          {REVIEWS.map((r) => (
            <blockquote key={r.name} data-reveal>
              <p>“{r.text}”</p>
              <footer>
                <b>{r.name}</b> — {r.title}, {r.date}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ── faq ─────────────────────────────── */}
      <section className="tb-sec tb-faq">
        <header className="tb-sec__head" data-reveal>
          <span>§ 04</span>
          <h2>Fine print</h2>
          <p>No purchases. No real money. Ever.</p>
        </header>
        <dl className="tb-faq__grid">
          {FAQS.map((f) => (
            <div key={f.q} data-reveal>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── cta ─────────────────────────────── */}
      <section className="tb-cta">
        <p className="tb-kicker" data-reveal>Tip-off is tonight</p>
        <h2 data-reveal>
          Make your first call
          <br />
          <em>in under sixty seconds.</em>
        </h2>
        <div data-reveal>
          <Stores tone="paper" />
        </div>
        <footer className="tb-footer">
          <span>© 2026 BUL · 100% free</span>
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
