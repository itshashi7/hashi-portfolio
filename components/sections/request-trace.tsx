"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, observeVisible, prefersReduced } from "@/lib/motion";
import { dur } from "@/lib/tokens";
import { whenIdle } from "@/lib/idle";

// Illustrative hops and timings: not real IZO numbers.
const NODES = [
  { id: "client", label: "client", ms: 0, mobile: false },
  { id: "gateway", label: "gateway", ms: 2, mobile: false },
  { id: "service", label: "service", ms: 14 },
  { id: "rabbitmq", label: "rabbitmq", ms: 3 },
  { id: "redis", label: "redis", ms: 1 },
  { id: "postgres", label: "postgres", ms: 9 },
] as const;
// hit, hit, miss: a miss continues to postgres.
const PATTERN = [true, true, false];

export function RequestTrace() {
  const root = useRef<HTMLDivElement>(null);
  const packet = useRef<HTMLSpanElement>(null);
  const [readout, setReadout] = useState("client → gateway → service → rabbitmq → redis · hit · 20 ms");
  const [lit, setLit] = useState<string | null>(null);

  useEffect(() => {
    const el = root.current;
    const dot = packet.current;
    if (!el || !dot || prefersReduced()) return;
    let tl: gsap.core.Timeline | null = null;
    let visible = false;

    const build = () => {
      tl?.kill();
      const box = el.getBoundingClientRect();
      const centers = NODES.map((n) => {
        const node = el.querySelector<HTMLElement>(`[data-node="${n.id}"]`);
        if (!node || node.offsetParent === null) return null;
        const r = node.getBoundingClientRect();
        return { id: n.id, x: r.left + r.width / 2 - box.left, ms: n.ms };
      }).filter(Boolean) as { id: string; x: number; ms: number }[];
      if (centers.length < 3) return;

      tl = gsap.timeline({ repeat: -1, paused: !visible });
      PATTERN.forEach((hit) => {
        const path = centers.filter((c) => (hit ? c.id !== "postgres" : true));
        let total = 0;
        tl!.set(dot, { x: path[0].x, opacity: 1 });
        tl!.call(() => setLit(path[0].id));
        path.slice(1).forEach((c) => {
          tl!.to(dot, { x: c.x, duration: dur.slow, ease: "power2.inOut" });
          tl!.call(() => {
            total += c.ms;
            setLit(c.id);
          });
          tl!.to({}, { duration: 0.12 });
        });
        tl!.call(() => {
          const t = path.reduce((s, c) => s + c.ms, 0);
          setReadout(`${path.map((c) => c.id).join(" → ")} · ${hit ? "hit" : "miss"} · ${t} ms`);
          total = 0;
        });
        tl!.to(dot, { opacity: 0, duration: dur.base });
        tl!.call(() => setLit(null));
        tl!.to({}, { duration: 0.5 });
      });
    };

    // Start the loop once the page is idle so it never competes with start-up work.
    const ro = new ResizeObserver(() => build());
    let stop = () => {};
    const cancelIdle = whenIdle(() => {
      build();
      ro.observe(el);
      stop = observeVisible(el, (v) => {
        visible = v;
        if (v) tl?.play();
        else tl?.pause();
      });
    });
    return () => {
      cancelIdle();
      ro.disconnect();
      stop();
      tl?.kill();
    };
  }, []);

  return (
    <figure className="mt-14 sm:mt-20" aria-label="Illustrative request trace">
      <div ref={root} className="relative">
        <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-hairline-strong" />
        <ol className="relative flex items-center justify-between gap-1.5 sm:gap-2">
          {NODES.map((n) => (
            <li
              key={n.id}
              data-node={n.id}
              className={`${"mobile" in n && n.mobile === false ? "hidden sm:block" : ""} relative z-10 rounded-full border bg-canvas px-2.5 py-1 font-mono text-mono-sm text-ink-muted sm:px-3 sm:text-mono ${
                lit === n.id ? "border-accent text-ink" : "border-hairline-strong"
              }`}
            >
              {n.label}
            </li>
          ))}
        </ol>
        <span
          ref={packet}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/2 z-0 -ml-1 -mt-1 size-2 rounded-full bg-accent opacity-0"
        />
      </div>
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-mono-sm text-ink-subtle">
        <span className="tabular" aria-live="off">
          {readout}
        </span>
        <span>Illustrative trace</span>
      </figcaption>
    </figure>
  );
}
