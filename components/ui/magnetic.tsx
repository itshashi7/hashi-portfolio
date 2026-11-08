"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { prefersReduced } from "@/lib/motion";
import { distance, ms } from "@/lib/tokens";

/** Wraps a link/button and pulls it toward the pointer (≤ 6px). Anime.js; off under reduced motion. */
export function Magnetic({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced() || !matchMedia("(hover: hover)").matches) return;
    const max = distance.magneticMax;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      animate(el, { x: dx * max, y: dy * max, duration: ms.fast, ease: "outQuart" });
    };
    const leave = () => animate(el, { x: 0, y: 0, scale: 1, duration: ms.base, ease: "outQuart" });
    const enter = () => animate(el, { scale: 1.02, duration: ms.fast, ease: "outQuart" });
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  );
}
