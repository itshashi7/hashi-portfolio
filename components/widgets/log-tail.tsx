"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { mulberry32, observeVisible, useReducedMotion } from "@/lib/motion";
import { ms } from "@/lib/tokens";
import { WidgetButton, WidgetCard } from "./widget-card";

type Line = { id: number; ts: string; level: "INFO" | "DEBUG" | "WARN"; thread: string; logger: string; msg: string };

// Illustrative Spring Boot-style lines. Package names are generic, not IZO's.
const EVENTS: Omit<Line, "id" | "ts" | "thread">[] = [
  { level: "INFO", logger: "c.a.api.ConnectionController", msg: "GET /api/v1/connections?cloud=aws 200 18ms" },
  { level: "DEBUG", logger: "c.a.cache.RedisCacheService", msg: "cache hit key=conn:aws:4821" },
  { level: "INFO", logger: "c.a.events.ProvisioningListener", msg: "consumed provisioning.requested id=9f2c" },
  { level: "DEBUG", logger: "o.s.jdbc.core.JdbcTemplate", msg: "executing prepared SQL query [select … from connection]" },
  { level: "INFO", logger: "c.a.api.ConnectionController", msg: "POST /api/v1/connections 202 41ms" },
  { level: "WARN", logger: "c.a.client.CloudApiClient", msg: "azure call slow (812ms), retrying 1/3" },
  { level: "INFO", logger: "c.a.events.StatusPublisher", msg: "published connection.status id=9f2c state=ACTIVE" },
  { level: "DEBUG", logger: "c.a.cache.RedisCacheService", msg: "cache miss key=conn:gcp:1177 → loading" },
  { level: "INFO", logger: "c.a.api.HealthController", msg: "GET /actuator/health 200 3ms" },
];

const MAX = 7;

export function LogTail() {
  const reduced = useReducedMotion();
  const rng = useRef(mulberry32(3));
  const seq = useRef(0);
  const clock = useRef(Date.UTC(2026, 10, 8, 9, 41, 12));
  const box = useRef<HTMLOListElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);

  const make = useCallback((): Line => {
    const e = EVENTS[Math.floor(rng.current() * EVENTS.length)];
    clock.current += 180 + Math.floor(rng.current() * 900);
    const d = new Date(clock.current);
    const ts = d.toISOString().slice(11, 23);
    return { id: seq.current++, ts, thread: `exec-${1 + Math.floor(rng.current() * 8)}`, ...e };
  }, []);

  const seed = useCallback(() => {
    rng.current = mulberry32(3);
    seq.current = 0;
    clock.current = Date.UTC(2026, 10, 8, 9, 41, 12);
    setLines(Array.from({ length: MAX }, () => make()));
  }, [make]);

  useEffect(seed, [seed]);

  useEffect(() => {
    const el = box.current;
    if (!el || reduced || paused || hover) return;
    let id: ReturnType<typeof setInterval> | null = null;
    const stop = observeVisible(el, (v) => {
      if (v && !id)
        id = setInterval(() => {
          setLines((prev) => [...prev.slice(-(MAX - 1)), make()]);
        }, 1100);
      if (!v && id) {
        clearInterval(id);
        id = null;
      }
    });
    return () => {
      stop();
      if (id) clearInterval(id);
    };
  }, [reduced, paused, hover, make]);

  // new line enters with a short rise (transform + opacity)
  const last = lines[lines.length - 1]?.id;
  useEffect(() => {
    if (reduced || last === undefined || last < MAX) return;
    const el = box.current?.lastElementChild;
    if (el) animate(el, { opacity: [0, 1], y: [6, 0], duration: ms.base, ease: "outQuart" });
  }, [last, reduced]);

  return (
    <WidgetCard
      title="Live log tail"
      description="Spring Boot service output"
      onReset={seed}
      footer={
        <div className="flex items-center justify-between gap-3">
          <WidgetButton onClick={() => setPaused((p) => !p)} pressed={paused} disabled={reduced}>
            {paused ? "Resume" : "Pause"}
          </WidgetButton>
          <span className="font-mono text-mono-sm text-ink-subtle">
            {reduced ? "Paused: reduced motion" : paused || hover ? "Paused" : "Streaming"}
          </span>
        </div>
      }
    >
      <ol
        ref={box}
        aria-live="off"
        aria-label="Illustrative log output"
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        className="h-[11.5rem] space-y-1 overflow-hidden font-mono text-[12px] leading-[1.55] text-ink-muted"
      >
        {lines.map((l) => (
          <li key={l.id} className="truncate">
            <span className="text-ink-subtle tabular">{l.ts} </span>
            <span className={l.level === "WARN" ? "text-accent-text" : l.level === "DEBUG" ? "text-ink-subtle" : "text-ink"}>
              {l.level.padEnd(5, " ")}
            </span>{" "}
            <span className="text-ink-subtle">[{l.thread}]</span> {l.logger.split(".").pop()}: {l.msg}
          </li>
        ))}
      </ol>
    </WidgetCard>
  );
}
