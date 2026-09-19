import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const MONO =
  'ui-monospace, SFMono-Regular, SFMono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export function HeroAmbientEffects() {
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const [time, setTime] = useState("--:--:--");
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      setPointer({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const coordX = Math.round((pointer.x / 100) * 1920)
    .toString()
    .padStart(4, "0");
  const coordY = Math.round((pointer.y / 100) * 1080)
    .toString()
    .padStart(4, "0");

  return (
    <>
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(124, 92, 252, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 92, 252, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 85% 75% at 72% 42%, black 15%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 72% 42%, black 15%, transparent 78%)",
          opacity: 0.55,
          ...(reducedMotion
            ? {}
            : {
                animation: "heroGridDrift 28s linear infinite",
                "@keyframes heroGridDrift": {
                  "0%": { backgroundPosition: "0 0, 0 0" },
                  "100%": { backgroundPosition: "72px 72px, 72px 72px" },
                },
              }),
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(124, 92, 252, 0.16) 0%, transparent 42%)`,
          transition: "background 0.15s ease-out",
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.08,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.35) 2px, rgba(255,255,255,0.35) 3px)",
          ...(reducedMotion
            ? {}
            : {
                animation: "heroScanPulse 6s ease-in-out infinite",
                "@keyframes heroScanPulse": {
                  "0%, 100%": { opacity: 0.06 },
                  "50%": { opacity: 0.11 },
                },
              }),
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: { xs: 18, md: 24 },
          right: { xs: 16, md: 28 },
          zIndex: 2,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 0.6,
          pointerEvents: "none",
        }}
      >
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: "0.68rem",
            letterSpacing: "0.14em",
            color: "rgba(136, 146, 164, 0.9)",
            textTransform: "uppercase",
          }}
        >
          GMT+3 IL {time}
        </Typography>
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            color: "rgba(64, 75, 100, 0.95)",
            textTransform: "uppercase",
          }}
        >
          {coordX} X {coordY} Y
        </Typography>
      </Box>

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: { xs: "50%", md: "58%" },
          top: { xs: "38%", md: "42%" },
          width: { xs: 280, md: 420 },
          height: { xs: 280, md: 420 },
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "1px solid rgba(124, 92, 252, 0.14)",
          pointerEvents: "none",
          zIndex: 0,
          boxShadow: "0 0 80px rgba(124, 92, 252, 0.12)",
          ...(reducedMotion
            ? {}
            : {
                animation: "heroRingPulse 4.5s ease-in-out infinite",
                "@keyframes heroRingPulse": {
                  "0%, 100%": {
                    transform: "translate(-50%, -50%) scale(1)",
                    opacity: 0.45,
                  },
                  "50%": {
                    transform: "translate(-50%, -50%) scale(1.06)",
                    opacity: 0.85,
                  },
                },
              }),
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: { xs: "50%", md: "58%" },
          top: { xs: "38%", md: "42%" },
          width: { xs: 340, md: 520 },
          height: { xs: 340, md: 520 },
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "1px dashed rgba(255, 48, 85, 0.12)",
          pointerEvents: "none",
          zIndex: 0,
          ...(reducedMotion
            ? {}
            : {
                animation: "heroRingSpin 22s linear infinite",
                "@keyframes heroRingSpin": {
                  "0%": { transform: "translate(-50%, -50%) rotate(0deg)" },
                  "100%": { transform: "translate(-50%, -50%) rotate(360deg)" },
                },
              }),
        }}
      />
    </>
  );
}
