"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReduced } from "@/lib/motion";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger (pins, scrub, scroll-spy) stays in sync.
 * Off under prefers-reduced-motion: the page then scrolls natively. Inner scrollers opt out with data-lenis-prevent.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReduced()) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
