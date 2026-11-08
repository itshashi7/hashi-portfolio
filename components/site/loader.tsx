"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { gsap } from "@/lib/motion";
import { dur, gsapEase, ms } from "@/lib/tokens";

export const LOADER_KEY = "hk:loaded";
export const LOADER_DONE = "loader:done";

/** Did the loader already finish (or never need to run)? */
export function loaderFinished() {
  if (typeof document === "undefined") return false;
  const el = document.getElementById("site-loader");
  return !el || document.documentElement.dataset.loaded === "1" || getComputedStyle(el).display === "none";
}

/**
 * 000→100 counter (Anime.js), then a curtain (GSAP). Runs once per session.
 * The head script marks html[data-loaded] on repeat visits, CSS hides the loader for
 * reduced motion, and a CSS failsafe hides it after 3s if JavaScript never runs.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    const finish = () => {
      document.documentElement.dataset.loaded = "1";
      try {
        sessionStorage.setItem(LOADER_KEY, "1");
      } catch {
        /* storage blocked: the loader will simply show again next visit */
      }
      window.dispatchEvent(new Event(LOADER_DONE));
    };
    if (!el || loaderFinished()) {
      finish();
      return;
    }
    el.classList.remove("loader-failsafe");
    const state = { v: 0 };
    const counter = animate(state, {
      v: 100,
      duration: ms.loaderCount,
      ease: "outExpo",
      modifier: (v: number) => Math.round(v),
      onUpdate: () => {
        if (count.current) count.current.textContent = String(state.v).padStart(3, "0");
        if (bar.current) bar.current.style.transform = `scaleX(${state.v / 100})`;
      },
      onComplete: () => {
        gsap.to(el, {
          yPercent: -100,
          duration: dur.loaderCurtain,
          ease: gsapEase.inOut,
          onStart: finish,
          onComplete: () => {
            el.style.display = "none";
          },
        });
      },
    });
    return () => {
      counter.revert();
    };
  }, []);

  return (
    <div
      id="site-loader"
      ref={root}
      className="site-loader loader-failsafe fixed inset-0 z-[var(--z-loader)] grid place-items-center bg-canvas"
      aria-hidden="true"
    >
      <div className="w-40">
        <span className="block h-px w-full overflow-hidden bg-hairline-strong">
          <span ref={bar} className="block h-px w-full origin-left scale-x-0 bg-accent" />
        </span>
        <span className="mt-3 flex justify-between font-mono text-mono text-ink-subtle">
          <span>Loading</span>
          <span ref={count} className="tabular text-ink">
            000
          </span>
        </span>
      </div>
    </div>
  );
}
