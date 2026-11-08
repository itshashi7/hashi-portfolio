"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import { mulberry32, observeVisible, prefersReduced } from "@/lib/motion";
import { ms } from "@/lib/tokens";
import { WidgetButton, WidgetCard } from "./widget-card";

const HOPS = ["gateway", "service", "cache", "db"] as const;
type Hop = (typeof HOPS)[number];
type Result = { hit: boolean; total: number; steps: { hop: Hop; ms: number }[] };

export function RequestLifecycle() {
  const well = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const rng = useRef(mulberry32(7));
  const busy = useRef(false);
  const [lit, setLit] = useState<Hop | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [count, setCount] = useState({ hit: 0, miss: 0 });

  const send = useCallback(() => {
    if (busy.current || !well.current || !dot.current) return;
    busy.current = true;
    const r = rng.current;
    const hit = r() < 0.72;
    const t = { gateway: 1 + Math.round(r() * 2), service: 6 + Math.round(r() * 8), cache: 1, db: 8 + Math.round(r() * 10) };
    const path: Hop[] = hit ? ["gateway", "service", "cache"] : ["gateway", "service", "cache", "db"];
    const steps = path.map((hop) => ({ hop, ms: t[hop] }));
    const done = () => {
      busy.current = false;
      setLit(null);
      setResult({ hit, total: steps.reduce((s, x) => s + x.ms, 0), steps });
      setCount((c) => (hit ? { ...c, hit: c.hit + 1 } : { ...c, miss: c.miss + 1 }));
    };
    if (prefersReduced()) {
      done();
      return;
    }
    const w = well.current.clientWidth;
    const xOf = (h: Hop) => ((HOPS.indexOf(h) + 0.5) / HOPS.length) * w;
    const tl = createTimeline({ onComplete: done });
    tl.set(dot.current, { x: xOf("gateway"), opacity: 1 });
    path.forEach((h, i) => {
      if (i > 0) tl.add(dot.current!, { x: xOf(h), duration: ms.slow, ease: "inOutQuad" });
      tl.call(() => setLit(h));
    });
    // response travels back to the gateway
    tl.add(dot.current, { x: xOf("gateway"), duration: ms.max, ease: "inOutQuad" });
    tl.add(dot.current, { opacity: 0, duration: ms.base });
  }, []);

  useEffect(() => {
    const el = well.current;
    if (!el || prefersReduced()) return;
    let id: ReturnType<typeof setInterval> | null = null;
    const stop = observeVisible(el, (v) => {
      if (v && !id) id = setInterval(send, 2600);
      if (!v && id) {
        clearInterval(id);
        id = null;
      }
    });
    return () => {
      stop();
      if (id) clearInterval(id);
    };
  }, [send]);

  const reset = () => {
    rng.current = mulberry32(7);
    setResult(null);
    setCount({ hit: 0, miss: 0 });
  };

  return (
    <WidgetCard
      title="API request lifecycle"
      description="Gateway → service → cache → database"
      onReset={reset}
      footer={
        <div className="flex items-center justify-between gap-3">
          <WidgetButton onClick={send}>Send request</WidgetButton>
          <span className="font-mono text-mono-sm text-ink-subtle tabular">
            {count.hit} hit · {count.miss} miss
          </span>
        </div>
      }
    >
      <div ref={well} className="relative">
        <span aria-hidden="true" className="absolute inset-x-[12.5%] top-[15px] h-px bg-hairline-strong" />
        <ol className="relative grid grid-cols-4 text-center">
          {HOPS.map((h) => (
            <li key={h} className="flex flex-col items-center gap-2">
              <span
                className={`size-[30px] rounded-full border bg-surface-1 ${lit === h ? "border-accent" : "border-hairline-strong"}`}
                aria-hidden="true"
              />
              <span className={`font-mono text-mono-sm ${lit === h ? "text-ink" : "text-ink-subtle"}`}>{h}</span>
            </li>
          ))}
        </ol>
        <span
          ref={dot}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-[11px] -ml-1 size-2 rounded-full bg-accent opacity-0"
        />
      </div>
      <p className="mt-4 min-h-[2.6em] font-mono text-mono-sm text-ink-muted tabular" aria-live="polite">
        {result ? (
          <>
            <span className={result.hit ? "text-accent-text" : "text-ink"}>{result.hit ? "HIT" : "MISS"}</span>
            {` ${result.total} ms · `}
            {result.steps.map((s) => `${s.hop} ${s.ms}`).join(" · ")}
          </>
        ) : (
          "Waiting for a request…"
        )}
      </p>
    </WidgetCard>
  );
}
