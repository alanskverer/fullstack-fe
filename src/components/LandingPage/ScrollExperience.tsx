import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

type ScrollSceneElement = HTMLElement & {
  dataset: DOMStringMap & { scrollScene?: string; scrollPeak?: string };
};

const SCENE_LABELS = ["OPEN", "PREDICT", "COMPETE", "LIVE", "TRUST", "PLAY"];
const TICKER =
  "NBA  /  NCAA  /  LIVE PREDICTIONS  /  ZERO REAL-MONEY BETTING  /  EVERY BASKET MOVES THE BOARD  /  ";

export function ScrollExperience() {
  const [activeScene, setActiveScene] = useState("OPEN");
  const [atPeak, setAtPeak] = useState(false);

  useEffect(() => {
    const scenes = Array.from(
      document.querySelectorAll<ScrollSceneElement>("[data-scroll-scene]"),
    );
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previousY = window.scrollY;
    let previousTime = performance.now();

    const update = (now: number) => {
      frame = 0;
      const viewportHeight = Math.max(window.innerHeight, 1);
      const scrollable = Math.max(root.scrollHeight - viewportHeight, 1);
      const pageProgress = Math.min(1, Math.max(0, window.scrollY / scrollable));
      const elapsed = Math.max(now - previousTime, 16);
      const velocity = Math.min(1, Math.abs(window.scrollY - previousY) / elapsed / 1.4);
      let closest: ScrollSceneElement | undefined;
      let closestDistance = Number.POSITIVE_INFINITY;

      root.style.setProperty("--page-p", pageProgress.toFixed(4));
      root.style.setProperty("--scroll-v", reducedMotion.matches ? "0" : velocity.toFixed(3));

      scenes.forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const travel = rect.height + viewportHeight;
        const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / travel));
        scene.style.setProperty("--scroll-p", reducedMotion.matches ? "0.5" : progress.toFixed(4));

        const distance = Math.abs(rect.top + rect.height / 2 - viewportHeight / 2);
        if (rect.bottom > 0 && rect.top < viewportHeight && distance < closestDistance) {
          closest = scene;
          closestDistance = distance;
        }
      });

      if (closest) {
        const nextScene = closest.dataset.scrollScene ?? "OPEN";
        const nextPeak = closest.dataset.scrollPeak === "true";
        root.dataset.activeScene = nextScene.toLowerCase().replace(/\s+/g, "-");
        root.classList.toggle("sc-at-peak", nextPeak);
        setActiveScene((current) => (current === nextScene ? current : nextScene));
        setAtPeak((current) => (current === nextPeak ? current : nextPeak));
      }

      previousY = window.scrollY;
      previousTime = now;
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
      root.style.removeProperty("--page-p");
      root.style.removeProperty("--scroll-v");
      delete root.dataset.activeScene;
      root.classList.remove("sc-at-peak");
    };
  }, []);

  return (
    <>
      <Box className="sc-arena-fx" aria-hidden="true">
        <Box className="sc-arena-fx__beam sc-arena-fx__beam--a" />
        <Box className="sc-arena-fx__beam sc-arena-fx__beam--b" />
        <Box className="sc-arena-fx__flash" />
      </Box>

      <Box className="sc-broadcast-bar" aria-hidden="true">
        <Typography component="span">BETTIM LIVE</Typography>
        <Box className="sc-broadcast-bar__ticker">
          <Typography component="span">{TICKER.repeat(2)}</Typography>
        </Box>
        <Typography component="strong">{atPeak ? "RANK SURGE" : activeScene}</Typography>
      </Box>

      <Box
        className={`sc-rank-trace${atPeak ? " is-peak" : ""}`}
        aria-hidden="true"
      >
        <Box className="sc-rank-trace__meter">
          <Box className="sc-rank-trace__fill" />
          {SCENE_LABELS.map((label, index) => (
            <Box
              key={label}
              className="sc-rank-trace__marker"
              sx={{ "--marker-p": index / (SCENE_LABELS.length - 1) }}
            />
          ))}
        </Box>
        <Box className="sc-rank-trace__readout">
          <Typography component="span">{atPeak ? "RANK SHIFT" : "LIVE RUN"}</Typography>
          <Typography component="strong">
            {atPeak ? "#24 → #3" : activeScene.toUpperCase()}
          </Typography>
        </Box>
      </Box>

      <Box className={`sc-rank-takeover${atPeak ? " is-active" : ""}`} aria-hidden="true">
        <Typography className="sc-rank-takeover__from">24</Typography>
        <Box className="sc-rank-takeover__line" />
        <Typography className="sc-rank-takeover__to">03</Typography>
        <Typography className="sc-rank-takeover__label">
          LIVE RANK. EVERY BASKET COUNTS.
        </Typography>
      </Box>
    </>
  );
}
