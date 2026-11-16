"use client";

import { useEffect, useRef } from "react";
import { gsap, observeVisible, prefersReduced } from "@/lib/motion";

type Row = { items: string[]; dir: 1 | -1; size?: "lg" | "md" };

/**
 * Big-type marquee bands. They drift on their own, speed up with scroll velocity, reverse when you scroll up
 * and lean into the scroll direction (skew). Transform only. Static under reduced motion.
 */
export function Band({ rows, label }: { rows: Row[]; label: string }) {
  const root = useRef<HTMLDivElement>(null);
  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  const sets = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReduced()) return;
    let visible = false;
    let widths: number[] = [];
    const xs = rows.map(() => 0);
    let lastY = window.scrollY;
    let vel = 0;
    let dirF = 1;
    let skew = 0;

    const measure = () => {
      widths = sets.current.map((s) => s?.offsetWidth ?? 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    sets.current.forEach((s) => s && ro.observe(s));

    const tick = (_t: number, deltaMs: number) => {
      if (!visible) {
        lastY = window.scrollY;
        return;
      }
      const dt = Math.min(deltaMs / 1000, 0.05);
      const y = window.scrollY;
      const v = dt ? (y - lastY) / dt : 0;
      lastY = y;
      vel += (v - vel) * 0.12;
      const target = vel < -40 ? -1 : vel > 40 ? 1 : dirF > 0 ? 1 : -1;
      dirF += (target - dirF) * 0.08;
      skew += (gsap.utils.clamp(-7, 7, -vel * 0.004) - skew) * 0.1;

      rows.forEach((row, i) => {
        const w = widths[i];
        const track = tracks.current[i];
        if (!w || !track) return;
        const base = row.size === "md" ? 46 : 70; // px per second
        xs[i] -= (base + Math.min(Math.abs(vel), 3000) * 0.1) * dirF * row.dir * dt;
        xs[i] = ((xs[i] % w) + w) % w;
        track.style.transform = `translate3d(${-xs[i]}px,0,0) skewX(${skew.toFixed(2)}deg)`;
      });
    };

    gsap.ticker.add(tick);
    const stop = observeVisible(el, (v) => (visible = v));
    return () => {
      gsap.ticker.remove(tick);
      stop();
      ro.disconnect();
    };
  }, [rows]);

  return (
    <div ref={root} aria-hidden="true" data-band={label} className="overflow-hidden py-2 select-none">
      {rows.map((row, i) => (
        <div key={i} className="overflow-hidden">
          <div
            ref={(el) => {
              tracks.current[i] = el;
            }}
            className="flex w-max will-change-transform"
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                ref={(el) => {
                  if (copy === 0) sets.current[i] = el;
                }}
                className="flex shrink-0 items-center"
              >
                {[...row.items, ...row.items].map((text, j) => (
                  <span
                    key={`${copy}-${j}`}
                    className={`flex items-center whitespace-nowrap font-semibold leading-[1.12] tracking-[-0.035em] wdth-heading ${
                      row.size === "md"
                        ? "text-[clamp(1.75rem,3.6vw,3.25rem)]"
                        : "text-[clamp(2.75rem,6.5vw,6rem)]"
                    } ${j % 2 === 0 ? "text-ink" : "text-ink-subtle"}`}
                  >
                    {text}
                    <span className="mx-[0.5em] block size-[0.22em] shrink-0 rounded-full bg-ink-subtle" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
