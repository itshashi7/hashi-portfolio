"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { mulberry32, observeVisible, useReducedMotion } from "@/lib/motion";
import { WidgetButton, WidgetCard } from "./widget-card";

const N = 40;
const W = 300;
const H = 120;
const MAX = 400; // ms on the y axis
const SLO = 250;

type Pt = { p50: number; p95: number };

function series(seed: number) {
  const r = mulberry32(seed);
  const pts: Pt[] = [];
  let base = 60;
  for (let i = 0; i < N; i++) {
    base = Math.max(40, Math.min(90, base + (r() - 0.5) * 12));
    pts.push({ p50: base, p95: base * 2.1 + r() * 30 });
  }
  return { pts, r };
}

const y = (v: number) => H - (Math.min(v, MAX) / MAX) * H;
const path = (pts: Pt[], key: keyof Pt) =>
  pts.map((p, i) => `${i ? "L" : "M"}${((i / (N - 1)) * W).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(" ");

export function LatencyChart() {
  const reduced = useReducedMotion();
  const init = useRef(series(11));
  const rng = useRef(init.current.r);
  const spike = useRef(0);
  const box = useRef<HTMLDivElement>(null);
  const [pts, setPts] = useState<Pt[]>(init.current.pts);

  const step = useCallback(() => {
    setPts((prev) => {
      const last = prev[prev.length - 1];
      const r = rng.current;
      let p50 = Math.max(40, Math.min(90, last.p50 + (r() - 0.5) * 12));
      let p95 = p50 * 2.1 + r() * 30;
      if (spike.current > 0) {
        const k = spike.current / 6; // decays over six samples
        p50 += 90 * k;
        p95 += 260 * k;
        spike.current--;
      }
      return [...prev.slice(1), { p50, p95 }];
    });
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el || reduced) return;
    let id: ReturnType<typeof setInterval> | null = null;
    const stop = observeVisible(el, (v) => {
      if (v && !id) id = setInterval(step, 900);
      if (!v && id) {
        clearInterval(id);
        id = null;
      }
    });
    return () => {
      stop();
      if (id) clearInterval(id);
    };
  }, [reduced, step]);

  const inject = () => {
    spike.current = 6;
    if (reduced) for (let i = 0; i < 6; i++) step();
  };
  const reset = () => {
    init.current = series(11);
    rng.current = init.current.r;
    spike.current = 0;
    setPts(init.current.pts);
  };

  const now = pts[pts.length - 1];
  const breached = now.p95 > SLO;

  return (
    <WidgetCard
      title="p95 latency"
      description="Last 40 samples, p50 and p95"
      onReset={reset}
      footer={
        <div className="flex items-center justify-between gap-3">
          <WidgetButton onClick={inject}>Inject a spike</WidgetButton>
          <span className="font-mono text-mono-sm text-ink-subtle tabular">SLO p95 &lt; {SLO} ms</span>
        </div>
      }
    >
      <div ref={box}>
        <div className="mb-3 flex items-baseline justify-between font-mono text-mono-sm tabular">
          <span className="text-ink-subtle">
            p50 <span className="text-ink">{Math.round(now.p50)} ms</span>
          </span>
          <span className="text-ink-subtle">
            p95 <span className="text-accent-text">{Math.round(now.p95)} ms</span>
            <span className="text-ink"> {breached ? "· over SLO" : "· within SLO"}</span>
          </span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label={`p95 latency ${Math.round(now.p95)} milliseconds, ${breached ? "over" : "within"} the ${SLO} millisecond objective`}>
          {[100, 200, 300].map((v) => (
            <line key={v} x1="0" x2={W} y1={y(v)} y2={y(v)} stroke="var(--hairline)" strokeWidth="1" />
          ))}
          <line x1="0" x2={W} y1={y(SLO)} y2={y(SLO)} stroke="var(--ink-subtle)" strokeWidth="1" strokeDasharray="3 4" />
          <path d={path(pts, "p50")} fill="none" stroke="var(--ink-subtle)" strokeWidth="1.5" strokeLinejoin="round" />
          <path d={path(pts, "p95")} fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
      </div>
    </WidgetCard>
  );
}
