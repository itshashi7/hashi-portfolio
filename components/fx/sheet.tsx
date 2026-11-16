"use client";

import { useRef } from "react";
import { useTheme } from "next-themes";
import { gsap, useGSAP, MOTION_OK } from "@/lib/motion";

/**
 * A full-bleed "sheet" that carries the opposite theme from the page (light on a dark page, dark on a light one).
 * Its background plate widens into place as it scrolls in (transform only), so the content never squashes.
 */
export function Sheet({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const plate = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const flip = resolvedTheme === "light" ? "theme-dark" : "theme-light";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          plate.current,
          { scaleX: 0.9 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: wrap.current, start: "top 95%", end: "top 25%", scrub: 0.4 },
          },
        );
      });
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className={`${flip} relative mt-24 text-ink lg:mt-32`}>
      <div ref={plate} aria-hidden="true" className="absolute inset-0 rounded-lg bg-canvas" />
      <div className="relative pb-24 lg:pb-32">{children}</div>
    </div>
  );
}
