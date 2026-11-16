"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReduced } from "@/lib/motion";

const INTERACTIVE = "a[href], button, [role=button], summary, [data-cursor]";
const TEXT = "input, textarea, select, [contenteditable=true]";

/**
 * A lagging ring that follows the pointer and swells over anything clickable. The native cursor stays visible.
 * Only for fine pointers; off under reduced motion.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReduced() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = root.current;
    if (!el) return;
    const x = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        el.dataset.visible = "1";
      }
      x(e.clientX);
      y(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t) return;
      el.dataset.state = t.closest(TEXT) ? "text" : t.closest(INTERACTIVE) ? "link" : "idle";
    };
    const down = () => (el.dataset.press = "1");
    const up = () => delete el.dataset.press;
    const leave = () => {
      shown = false;
      delete el.dataset.visible;
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      data-state="idle"
      className="group/cursor pointer-events-none fixed left-0 top-0 z-[90] opacity-0 data-[visible]:opacity-100"
    >
      <span className="-ml-[18px] -mt-[18px] block size-9 rounded-full border border-ink/45 transition-[transform,opacity,background-color,border-color] duration-[var(--dur-base)] ease-out-expo group-data-[state=link]/cursor:scale-[1.7] group-data-[state=link]/cursor:border-accent group-data-[state=link]/cursor:bg-accent-soft group-data-[state=text]/cursor:scale-[0.2] group-data-[state=text]/cursor:opacity-60 group-data-[press]/cursor:scale-90" />
    </div>
  );
}
