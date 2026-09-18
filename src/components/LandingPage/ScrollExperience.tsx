import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

type ScrollSceneElement = HTMLElement & {
  dataset: DOMStringMap & { scrollScene?: string; scrollPeak?: string };
};

type Spring = { value: number; velocity: number };

const SCENE_LABELS = ["OPEN", "PREDICT", "COMPETE", "LIVE", "TRUST", "PLAY"];
const TICKER =
  "NBA  /  NCAA  /  LIVE PREDICTIONS  /  ZERO REAL-MONEY BETTING  /  EVERY BASKET MOVES THE BOARD  /  ";

function createSpring(value: number): Spring {
  return { value, velocity: 0 };
}

function stepSpring(spring: Spring, target: number, dt: number, omega: number) {
  const offset = spring.value - target;
  const accel = -2 * omega * spring.velocity - omega * omega * offset;
  spring.velocity += accel * dt;
  spring.value += spring.velocity * dt;
  if (Math.abs(spring.value - target) < 0.00025 && Math.abs(spring.velocity) < 0.0004) {
    spring.value = target;
    spring.velocity = 0;
  }
}

function isSpringSettled(spring: Spring, target: number) {
  return spring.value === target && spring.velocity === 0;
}

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
    const pageSpring = createSpring(
      Math.min(
        1,
        Math.max(0, window.scrollY / Math.max(root.scrollHeight - window.innerHeight, 1)),
      ),
    );
    const velocitySpring = createSpring(0);
    const sceneSprings = new WeakMap<ScrollSceneElement, Spring>();

    const update = (now: number) => {
      const viewportHeight = Math.max(window.innerHeight, 1);
      const scrollable = Math.max(root.scrollHeight - viewportHeight, 1);
      const pageProgress = Math.min(1, Math.max(0, window.scrollY / scrollable));
      const dt = Math.min(0.045, Math.max(now - previousTime, 1) / 1000);
      const rawVelocity = reducedMotion.matches
        ? 0
        : Math.min(1, Math.abs(window.scrollY - previousY) / Math.max(now - previousTime, 1) / 1.4);
      let catchingUp = false;
      let closest: ScrollSceneElement | undefined;
      let closestDistance = Number.POSITIVE_INFINITY;

      if (reducedMotion.matches) {
        pageSpring.value = pageProgress;
        pageSpring.velocity = 0;
        velocitySpring.value = 0;
        velocitySpring.velocity = 0;
      } else {
        stepSpring(pageSpring, pageProgress, dt, 11);
        stepSpring(velocitySpring, rawVelocity, dt, 13);
        catchingUp =
          !isSpringSettled(pageSpring, pageProgress) ||
          !isSpringSettled(velocitySpring, rawVelocity);
      }

      root.style.setProperty("--page-p", pageSpring.value.toFixed(4));
      root.style.setProperty("--scroll-v", Math.max(0, velocitySpring.value).toFixed(4));

      scenes.forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const travel = rect.height + viewportHeight;
        const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / travel));
        const spring = sceneSprings.get(scene) ?? createSpring(progress);
        if (reducedMotion.matches) {
          spring.value = progress;
          spring.velocity = 0;
        } else {
          stepSpring(spring, progress, dt, 11);
          if (!isSpringSettled(spring, progress)) catchingUp = true;
        }
        sceneSprings.set(scene, spring);
        scene.style.setProperty("--scroll-p", spring.value.toFixed(4));

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
      frame =
        !reducedMotion.matches && catchingUp
          ? window.requestAnimationFrame(update)
          : 0;
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
        <Typography component="span">BUL LIVE</Typography>
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
            {activeScene.toUpperCase()}
          </Typography>
        </Box>
      </Box>

      {/* Rank takeover (24 / 03) paused for now
      <Box className={`sc-rank-takeover${atPeak ? " is-active" : ""}`} aria-hidden="true">
        <Typography className="sc-rank-takeover__from">24</Typography>
        <Box className="sc-rank-takeover__line" />
        <Typography className="sc-rank-takeover__to">03</Typography>
        <Typography className="sc-rank-takeover__label">
          LIVE RANK. EVERY BASKET COUNTS.
        </Typography>
      </Box>
      */}
    </>
  );
}
