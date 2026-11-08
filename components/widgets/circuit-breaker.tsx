"use client";

import { useEffect, useRef, useState } from "react";
import { mulberry32, observeVisible, useReducedMotion } from "@/lib/motion";
import { WidgetCard } from "./widget-card";

type State = "closed" | "open" | "half-open";
type Req = { id: number; kind: "ok" | "fail" | "short" | "trial" };

const STATES: { id: State; label: string; help: string }[] = [
  { id: "closed", label: "Closed", help: "Requests flow to the dependency." },
  { id: "open", label: "Open", help: "Calls fail fast; the dependency gets time to recover." },
  { id: "half-open", label: "Half-open", help: "A few trial calls decide whether to close again." },
];

function next(state: State, r: () => number, i: number): Req["kind"] {
  if (state === "closed") return r() < 0.88 ? "ok" : "fail";
  if (state === "open") return "short";
  return i % 3 === 0 ? "trial" : "short";
}

function Dot({ kind }: { kind: Req["kind"] }) {
  const base = "block size-3 rounded-full";
  if (kind === "ok") return <span className={`${base} bg-ink-muted`} />;
  if (kind === "fail") return <span className={`${base} border border-ink bg-transparent`} style={{ background: "linear-gradient(135deg, transparent 45%, var(--ink) 45% 55%, transparent 55%)" }} />;
  if (kind === "trial") return <span className={`${base} border border-dashed border-accent`} />;
  return <span className={`${base} border border-hairline-strong`} />;
}

const KIND_LABEL: Record<Req["kind"], string> = { ok: "passed", fail: "failed", short: "short-circuited", trial: "trial call" };

export function CircuitBreaker() {
  const reduced = useReducedMotion();
  const [state, setState] = useState<State>("closed");
  const [reqs, setReqs] = useState<Req[]>([]);
  const rng = useRef(mulberry32(5));
  const n = useRef(0);
  const box = useRef<HTMLDivElement>(null);

  const push = () => setReqs((p) => [...p.slice(-13), { id: n.current, kind: next(state, rng.current, n.current++) }]);

  useEffect(() => {
    const seed: Req[] = Array.from({ length: 14 }, (_, i) => ({ id: i, kind: next("closed", rng.current, i) }));
    n.current = 14;
    setReqs(seed);
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el || reduced) return;
    let id: ReturnType<typeof setInterval> | null = null;
    const stop = observeVisible(el, (v) => {
      if (v && !id) id = setInterval(push, 650);
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
  }, [reduced, state]);

  const choose = (s: State) => {
    setState(s);
    if (reduced) setReqs((p) => [...p.slice(-13), { id: n.current, kind: next(s, rng.current, n.current++) }]);
  };

  const reset = () => {
    rng.current = mulberry32(5);
    setState("closed");
    setReqs(Array.from({ length: 14 }, (_, i) => ({ id: i, kind: next("closed", rng.current, i) })));
    n.current = 14;
  };

  const current = STATES.find((s) => s.id === state)!;

  return (
    <WidgetCard title="Circuit breaker" description="Protects callers from a failing dependency" onReset={reset}>
      <div ref={box}>
        <div role="group" aria-label="Breaker state" className="grid grid-cols-3 gap-1 rounded-full border border-hairline bg-surface-1 p-1">
          {STATES.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={state === s.id}
              onClick={() => choose(s.id)}
              className={`h-8 rounded-full text-caption ${state === s.id ? "bg-surface-3 text-ink" : "text-ink-muted hover:text-ink"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="mt-3 min-h-[2.9em] text-caption text-ink-muted">
          <span
            className={`mr-1.5 inline-block size-2 rounded-full align-middle ${
              state === "closed" ? "bg-accent" : state === "open" ? "border border-ink" : "border border-dashed border-accent"
            }`}
            aria-hidden="true"
          />
          {current.help}
        </p>
        <ol className="mt-2 flex flex-wrap gap-1.5" aria-label="Recent requests">
          {reqs.map((r) => (
            <li key={r.id} title={KIND_LABEL[r.kind]}>
              <span className="sr-only">{KIND_LABEL[r.kind]}</span>
              <span aria-hidden="true">
                <Dot kind={r.kind} />
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-mono-sm text-ink-subtle">
          <span className="inline-flex items-center gap-1.5"><Dot kind="ok" /> passed</span>
          <span className="inline-flex items-center gap-1.5"><Dot kind="fail" /> failed</span>
          <span className="inline-flex items-center gap-1.5"><Dot kind="short" /> short-circuit</span>
          <span className="inline-flex items-center gap-1.5"><Dot kind="trial" /> trial</span>
        </p>
      </div>
    </WidgetCard>
  );
}
