"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/motion";
import { distance, dur, gsapEase, stagger as st } from "@/lib/tokens";
import { whenIdle } from "@/lib/idle";

type Opts = { selector?: string; each?: number; y?: number; start?: string };

/**
 * Staggered scroll reveal for children matching `selector` inside `scope`.
 * Content is visible in the HTML; the from-state is applied only when motion is allowed, and the
 * setup waits for an idle moment so it never adds to start-up work (each section schedules its own).
 */
export function useReveal(scope: RefObject<HTMLElement | null>, opts: Opts = {}) {
  const { selector = "[data-reveal]", each = st.items, y = distance.reveal, start = "top 85%" } = opts;
  useGSAP(
    (_ctx, contextSafe) => {
      const setup = contextSafe!(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
          // Only elements still below the fold get a from-state; anything already on screen stays put.
          const fold = window.innerHeight * 0.9;
          const items = gsap.utils
            .toArray<HTMLElement>(selector, scope.current)
            .filter((el) => el.getBoundingClientRect().top > fold);
          if (!items.length) return;
          gsap.set(items, { y, opacity: 0.001 });
          ScrollTrigger.batch(items, {
            start,
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, { y: 0, opacity: 1, duration: dur.slow, ease: gsapEase.outExpo, stagger: each, overwrite: true }),
          });
        });
      });
      return whenIdle(setup);
    },
    { scope },
  );
}
