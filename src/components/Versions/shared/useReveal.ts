import { RefObject, useEffect } from "react";

/** Adds `is-in` to every `[data-reveal]` inside `root` once it scrolls into view. */
export function useReveal(root: RefObject<HTMLElement>, threshold = 0.25) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [root, threshold]);
}

/** Plays a muted looping video only while it is on screen. */
export function useAutoplay(ref: RefObject<HTMLVideoElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}
