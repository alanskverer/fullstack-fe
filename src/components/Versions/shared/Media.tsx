import { Fragment, useRef } from "react";
import { useAutoplay } from "./useReveal";
import type { ShowcaseItem } from "./content";

export function Media({ item, className }: { item: ShowcaseItem; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useAutoplay(ref);
  if (item.media.type === "image") {
    return <img className={className} src={item.media.src} alt={item.title} loading="lazy" />;
  }
  return (
    <video
      ref={ref}
      className={className}
      src={item.media.src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={item.title}
    />
  );
}

/** Splits text into word spans so CSS can stagger them via `--i`. */
export function Words({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          <span className="w" style={{ ["--i" as string]: i + start }}>
            <span>{w}</span>
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

export const AppleGlyph = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
    <path
      fill="currentColor"
      d="M16.37 12.62c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-2.99-.79-1.54.02-2.96.9-3.75 2.27-1.6 2.78-.41 6.89 1.15 9.14.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.78.74 2.99.72 1.24-.02 2.02-1.12 2.77-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.66zM14.1 5.86c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.66 1.37-.58.67-1.09 1.76-.96 2.8 1.02.08 2.05-.52 2.68-1.28z"
    />
  </svg>
);

export const PlayGlyph = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
    <path
      fill="currentColor"
      d="M3.61 1.81 13.79 12 3.61 22.19a1 1 0 0 1-.61-.92V2.73a1 1 0 0 1 .61-.92zm10.89 10.9 2.3 2.3-10.94 6.33 8.64-8.63zm3.2-3.2 2.81 1.63a1 1 0 0 1 0 1.73l-2.81 1.63L15.21 12l2.49-2.49zM5.86 2.66 16.8 8.99l-2.3 2.3-8.64-8.63z"
    />
  </svg>
);
