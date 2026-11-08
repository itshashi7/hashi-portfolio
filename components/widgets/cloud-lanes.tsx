"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { mulberry32, observeVisible, useReducedMotion } from "@/lib/motion";
import { ms } from "@/lib/tokens";
import { WidgetButton, WidgetCard } from "./widget-card";

const CLOUDS = ["AWS", "Azure", "GCP"] as const;
type Cloud = (typeof CLOUDS)[number];
const WEIGHT: Record<Cloud, number> = { AWS: 0.45, Azure: 0.3, GCP: 0.25 };

export function CloudLanes() {
  const reduced = useReducedMotion();
  const [drained, setDrained] = useState<Record<Cloud, boolean>>({ AWS: false, Azure: false, GCP: false });
  const [served, setServed] = useState<Record<Cloud, number>>({ AWS: 0, Azure: 0, GCP: 0 });
  const lanes = useRef<Record<Cloud, HTMLDivElement | null>>({ AWS: null, Azure: null, GCP: null });
  const box = useRef<HTMLDivElement>(null);
  const rng = useRef(mulberry32(9));
  const drainedRef = useRef(drained);
  drainedRef.current = drained;

  const pick = (): Cloud | null => {
    const live = CLOUDS.filter((c) => !drainedRef.current[c]);
    if (!live.length) return null;
    const total = live.reduce((s, c) => s + WEIGHT[c], 0);
    let x = rng.current() * total;
    for (const c of live) {
      x -= WEIGHT[c];
      if (x <= 0) return c;
    }
    return live[live.length - 1];
  };

  const route = (animateIt: boolean) => {
    const c = pick();
    if (!c) return;
    setServed((s) => ({ ...s, [c]: s[c] + 1 }));
    const lane = lanes.current[c];
    if (!animateIt || !lane) return;
    const dot = document.createElement("span");
    dot.className = "absolute left-0 top-1/2 -mt-1 size-2 rounded-full bg-accent";
    dot.setAttribute("aria-hidden", "true");
    lane.appendChild(dot);
    animate(dot, {
      x: [0, lane.clientWidth - 8],
      opacity: [{ to: 1, duration: 80 }, { to: 0, duration: 120, delay: ms.max - 200 }],
      duration: ms.max,
      ease: "linear",
      onComplete: () => dot.remove(),
    });
  };

  useEffect(() => {
    const el = box.current;
    if (!el || reduced) return;
    let id: ReturnType<typeof setInterval> | null = null;
    const stop = observeVisible(el, (v) => {
      if (v && !id) id = setInterval(() => route(true), 380);
      if (!v && id) {
        clearInterval(id);
        id = null;
      }
    });
    return () => {
      stop();
      if (id) clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const toggle = (c: Cloud) => {
    setDrained((d) => ({ ...d, [c]: !d[c] }));
    if (reduced) setTimeout(() => Array.from({ length: 6 }, () => route(false)), 0);
  };
  const reset = () => {
    rng.current = mulberry32(9);
    setDrained({ AWS: false, Azure: false, GCP: false });
    setServed({ AWS: 0, Azure: 0, GCP: 0 });
  };

  const total = CLOUDS.reduce((s, c) => s + served[c], 0) || 1;

  return (
    <WidgetCard title="Multi-cloud lanes" description="Weighted routing with lane drain" onReset={reset}>
      <div ref={box} className="space-y-3">
        {CLOUDS.map((c) => (
          <div key={c} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3">
            <span className={`text-small font-[550] wdth-heading ${drained[c] ? "text-ink-subtle line-through" : "text-ink"}`}>{c}</span>
            <div
              ref={(el) => {
                lanes.current[c] = el;
              }}
              className={`relative h-6 overflow-hidden rounded-full border ${drained[c] ? "border-dashed border-hairline-strong" : "border-hairline-strong bg-surface-1"}`}
            />
            <WidgetButton onClick={() => toggle(c)} pressed={drained[c]}>
              {drained[c] ? "Restore" : "Drain"}
            </WidgetButton>
          </div>
        ))}
        <p className="pt-1 font-mono text-mono-sm text-ink-subtle tabular" aria-live="polite">
          {CLOUDS.map((c) => `${c} ${Math.round((served[c] / total) * 100)}%`).join(" · ")}
          {CLOUDS.every((c) => drained[c]) && <span className="text-ink"> · all lanes drained, requests rejected</span>}
        </p>
      </div>
    </WidgetCard>
  );
}
