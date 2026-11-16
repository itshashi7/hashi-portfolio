"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/motion";

/** Hairline reading-progress bar along the top edge (transform only, scrubbed to scroll). */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } },
      );
    });
  });
  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[var(--z-nav)] h-[2px] origin-left scale-x-0 bg-accent"
    />
  );
}
