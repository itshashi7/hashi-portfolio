"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReduced } from "@/lib/motion";
import { dur, gsapEase } from "@/lib/tokens";

/**
 * A pill that slides to whichever child has data-active="true" (nav, filter chips, view toggle).
 * Put `ref={box}` + `data-thumb="off"` on the container, render <Thumb thumbRef={thumb} /> first inside it,
 * and give the items `relative` + data-active. Until it is placed, the active item paints its own fill.
 * Its width/height tween is the one non-transform animation on the site: a tiny absolutely positioned element.
 */
export function useThumb<T extends HTMLElement>(deps: unknown[]) {
  const box = useRef<T>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  useLayoutEffect(() => {
    const b = box.current;
    const t = thumb.current;
    if (!b || !t) return;
    const place = (animate: boolean) => {
      const a = b.querySelector<HTMLElement>('[data-active="true"]');
      if (!a) {
        gsap.set(t, { opacity: 0 });
        return;
      }
      const to = { x: a.offsetLeft, y: a.offsetTop, width: a.offsetWidth, height: a.offsetHeight, opacity: 1 };
      if (animate && placed.current && !prefersReduced()) {
        gsap.to(t, { ...to, duration: dur.slow, ease: gsapEase.outExpo, overwrite: true });
      } else {
        gsap.set(t, to);
      }
      placed.current = true;
      b.dataset.thumb = "on";
    };
    place(true);
    const ro = new ResizeObserver(() => place(false));
    ro.observe(b);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { box, thumb };
}

export function Thumb({ thumbRef }: { thumbRef: React.RefObject<HTMLSpanElement | null> }) {
  return <span ref={thumbRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 rounded-full bg-surface-2 opacity-0" />;
}
