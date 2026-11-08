"use client";

import { useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);
}

export { gsap, ScrollTrigger, Flip, useGSAP };

export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** Shared reduced-motion flag. Server render assumes reduced (no animation markup differences). */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => true,
  );
}

export const prefersReduced = () =>
  typeof window === "undefined" || window.matchMedia(REDUCED_QUERY).matches;

/** Deterministic PRNG (mulberry32) so demo widgets render the same sequence every time. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Subscribe to whether an element is on screen; widgets only run while visible. */
export function observeVisible(el: Element, cb: (visible: boolean) => void) {
  const io = new IntersectionObserver(([e]) => cb(e.isIntersecting), { rootMargin: "80px" });
  io.observe(el);
  return () => io.disconnect();
}
