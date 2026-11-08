"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { mulberry32, prefersReduced } from "@/lib/motion";
import { ms } from "@/lib/tokens";
import { WidgetButton, WidgetCard } from "./widget-card";

const START = { hits: 172, misses: 28, warm: 0.88 };

export function CacheGauge() {
  const needle = useRef<SVGGElement>(null);
  const rng = useRef(mulberry32(42));
  const [s, setS] = useState(START);
  const ratio = s.hits + s.misses === 0 ? 0 : s.hits / (s.hits + s.misses);
  const angle = -90 + 180 * ratio;

  useEffect(() => {
    if (!needle.current) return;
    if (prefersReduced()) {
      needle.current.style.transform = `rotate(${angle}deg)`;
      return;
    }
    const a = animate(needle.current, { rotate: angle, duration: ms.max, ease: "outExpo" });
    return () => {
      a.pause();
    };
  }, [angle]);

  const send = (n: number) =>
    setS((p) => {
      let { hits, misses, warm } = p;
      for (let i = 0; i < n; i++) {
        if (rng.current() < warm) hits++;
        else {
          misses++;
          warm = Math.min(0.95, warm + 0.09); // a miss fills the cache
        }
      }
      return { hits, misses, warm };
    });

  const flush = () => setS((p) => ({ ...p, warm: 0.05 }));
  const reset = () => {
    rng.current = mulberry32(42);
    setS(START);
  };

  // tick marks every 10%
  const ticks = Array.from({ length: 11 }, (_, i) => -90 + i * 18);

  return (
    <WidgetCard
      title="Redis cache-hit ratio"
      description="Hits ÷ (hits + misses)"
      onReset={reset}
      footer={
        <div className="flex flex-wrap gap-2">
          <WidgetButton onClick={() => send(10)}>Send 10 requests</WidgetButton>
          <WidgetButton onClick={flush}>Flush cache</WidgetButton>
        </div>
      }
    >
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 200 112" className="w-full max-w-[240px]" role="img" aria-label={`Cache hit ratio ${(ratio * 100).toFixed(1)} percent`}>
          <path d="M 16 100 A 84 84 0 0 1 184 100" fill="none" stroke="var(--hairline-strong)" strokeWidth="1" />
          {ticks.map((t, i) => (
            <line
              key={t}
              x1="100"
              y1="22"
              x2="100"
              y2={i % 5 === 0 ? 32 : 28}
              stroke="var(--ink-subtle)"
              strokeWidth="1"
              transform={`rotate(${t} 100 100)`}
            />
          ))}
          <g ref={needle} style={{ transformOrigin: "100px 100px", transform: "rotate(-90deg)" }}>
            <line x1="100" y1="100" x2="100" y2="34" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
          </g>
          <circle cx="100" cy="100" r="4" fill="var(--ink)" />
        </svg>
        <p className="-mt-1 text-[2rem] font-semibold leading-none tracking-[-0.03em] text-ink tabular">
          {(ratio * 100).toFixed(1)}
          <span className="text-h4 text-ink-subtle">%</span>
        </p>
        <p className="mt-2 font-mono text-mono-sm text-ink-subtle tabular">
          {s.hits} hits · {s.misses} misses · {s.warm < 0.5 ? "cold" : "warm"}
        </p>
      </div>
    </WidgetCard>
  );
}
