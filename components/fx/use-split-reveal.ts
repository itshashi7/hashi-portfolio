"use client";

import type { RefObject } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/motion";
import { dur, gsapEase } from "@/lib/tokens";

/**
 * Headline reveal: each line of `[data-split]` text rises out of its own mask (SplitText), triggered on scroll.
 * Elements already on screen, and everything under reduced motion, are left alone (plain text, fully visible).
 * SplitText re-splits on resize and font load, so line breaks always match the layout.
 */
export function useSplitReveal(scope: RefObject<HTMLElement | null>, selector = "[data-split]") {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const splits: SplitText[] = [];
        let cancelled = false;
        document.fonts.ready.then(() => {
          if (cancelled) return;
          gsap.utils.toArray<HTMLElement>(selector, scope.current).forEach((el) => {
            if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
            splits.push(
              SplitText.create(el, {
                type: "lines",
                mask: "lines",
                // the lines keep the real text in the DOM, so screen readers read it as written;
                // the default aria-label is invalid on <p> elements
                aria: "none",
                autoSplit: true,
                onSplit(self) {
                  // masks clip at the line box; give descenders room without moving layout
                  self.masks.forEach((m) => {
                    (m as HTMLElement).style.paddingBlock = "0.12em";
                    (m as HTMLElement).style.marginBlock = "-0.12em";
                  });
                  return gsap.from(self.lines, {
                    yPercent: 110,
                    duration: dur.max,
                    ease: gsapEase.outExpo,
                    stagger: 0.07,
                    scrollTrigger: { trigger: el, start: "top 88%", once: true },
                  });
                },
              }),
            );
          });
        });
        return () => {
          cancelled = true;
          splits.forEach((s) => s.revert());
        };
      });
    },
    { scope },
  );
}
