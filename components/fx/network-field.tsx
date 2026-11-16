"use client";

import { useEffect, useRef } from "react";
import { mulberry32, observeVisible, prefersReduced } from "@/lib/motion";
import { whenIdle } from "@/lib/idle";

type Node = { bx: number; by: number; x: number; y: number; vx: number; vy: number; ph: number; sp: number };
type Packet = { a: number; b: number; t: number; len: number };

const REACH = 170; // px: how far the pointer influences the graph

/**
 * A drifting service graph drawn on a canvas: nodes wander, links brighten near the pointer, and amber
 * request packets travel along the links. Original generative piece, seeded so it renders the same every load.
 * Starts when the page is idle, pauses off-screen or in a hidden tab, and is a single static frame under reduced motion.
 */
export function NetworkField({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const reduced = prefersReduced();

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let edges: [number, number][] = [];
    let packets: Packet[] = [];
    let ink = "#ffffff";
    let accent = "#faaa49";
    let spawn = 0;
    const pr = mulberry32(7);
    const pointer = { x: -9999, y: -9999, on: false };

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      ink = s.getPropertyValue("--ink").trim() || ink;
      accent = s.getPropertyValue("--accent").trim() || accent;
    };

    const build = () => {
      const r = cv.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rnd = mulberry32(2026);
      const count = Math.round(Math.min(48, Math.max(14, (w * h) / 24000)));
      nodes = Array.from({ length: count }, () => {
        const bx = rnd() * w;
        const by = rnd() * h;
        return { bx, by, x: bx, y: by, vx: 0, vy: 0, ph: rnd() * Math.PI * 2, sp: 0.18 + rnd() * 0.22 };
      });
      const seen = new Set<string>();
      edges = [];
      nodes.forEach((a, i) => {
        nodes
          .map((b, j) => ({ j, d: (a.bx - b.bx) ** 2 + (a.by - b.by) ** 2 }))
          .filter((o) => o.j !== i)
          .sort((p, q) => p.d - q.d)
          .slice(0, 3)
          .forEach(({ j }) => {
            const key = i < j ? `${i}-${j}` : `${j}-${i}`;
            if (!seen.has(key)) {
              seen.add(key);
              edges.push(i < j ? [i, j] : [j, i]);
            }
          });
      });
      packets = [];
    };

    const draw = (t: number, dt: number, animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      const rect = cv.getBoundingClientRect();
      const px = pointer.x - rect.left;
      const py = pointer.y - rect.top;
      const k = Math.min(dt * 60, 2);

      if (animate) {
        for (const n of nodes) {
          const tx = n.bx + Math.sin(t * n.sp + n.ph) * 16;
          const ty = n.by + Math.cos(t * n.sp * 0.9 + n.ph) * 16;
          let fx = (tx - n.x) * 0.05;
          let fy = (ty - n.y) * 0.05;
          if (pointer.on) {
            const dx = n.x - px;
            const dy = n.y - py;
            const d = Math.hypot(dx, dy);
            if (d < REACH && d > 0.01) {
              const f = (1 - d / REACH) * 2.4;
              fx += (dx / d) * f;
              fy += (dy / d) * f;
            }
          }
          n.vx = (n.vx + fx * k) * Math.pow(0.84, k);
          n.vy = (n.vy + fy * k) * Math.pow(0.84, k);
          n.x += n.vx * k;
          n.y += n.vy * k;
        }
      }

      // links
      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        const A = nodes[a];
        const B = nodes[b];
        const mx = (A.x + B.x) / 2;
        const my = (A.y + B.y) / 2;
        const prox = pointer.on ? Math.max(0, 1 - Math.hypot(mx - px, my - py) / REACH) : 0;
        ctx.globalAlpha = 0.13;
        ctx.strokeStyle = ink;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
        if (prox > 0.02) {
          ctx.globalAlpha = prox * 0.75;
          ctx.strokeStyle = accent;
          ctx.stroke();
        }
      }

      // nodes
      for (const n of nodes) {
        const prox = pointer.on ? Math.max(0, 1 - Math.hypot(n.x - px, n.y - py) / REACH) : 0;
        ctx.globalAlpha = 0.34 + prox * 0.5;
        ctx.fillStyle = prox > 0.05 ? accent : ink;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.8 + prox * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // packets
      if (animate) {
        spawn += dt;
        if (spawn > 0.5 && packets.length < 7 && edges.length) {
          spawn = 0;
          const [a, b] = edges[Math.floor(pr() * edges.length)];
          const flip = pr() < 0.5;
          const [s, e] = flip ? [b, a] : [a, b];
          packets.push({ a: s, b: e, t: 0, len: Math.hypot(nodes[e].x - nodes[s].x, nodes[e].y - nodes[s].y) || 1 });
        }
        packets = packets.filter((p) => p.t < 1);
        for (const p of packets) {
          p.t += (230 * dt) / p.len;
          const A = nodes[p.a];
          const B = nodes[p.b];
          const hx = A.x + (B.x - A.x) * Math.min(p.t, 1);
          const hy = A.y + (B.y - A.y) * Math.min(p.t, 1);
          const tt = Math.max(0, p.t - 24 / p.len);
          const tx = A.x + (B.x - A.x) * tt;
          const ty = A.y + (B.y - A.y) * tt;
          ctx.globalAlpha = 0.55;
          ctx.strokeStyle = accent;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(hx, hy);
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.fillStyle = accent;
          ctx.beginPath();
          ctx.arc(hx, hy, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let last = 0;
    let visible = false;
    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      draw(now / 1000, dt, true);
      raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (reduced || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.on = true;
    };
    const onLeave = () => (pointer.on = false);

    let cancelIdle = () => {};
    let stopVisible = () => {};
    let ro: ResizeObserver | null = null;
    let mo: MutationObserver | null = null;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    cancelIdle = whenIdle(() => {
      readColors();
      build();
      cv.dataset.ready = "1";
      if (reduced) draw(0, 0, false);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      document.addEventListener("visibilitychange", kick);
      stopVisible = observeVisible(cv, (v) => {
        visible = v;
        if (v) kick();
      });
      mo = new MutationObserver(() => {
        readColors();
        if (reduced) draw(0, 0, false);
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      ro = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          build();
          if (reduced) draw(0, 0, false);
        }, 120);
      });
      ro.observe(cv);
    });

    return () => {
      cancelIdle();
      stopVisible();
      ro?.disconnect();
      mo?.disconnect();
      clearTimeout(resizeTimer);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", kick);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 opacity-0 transition-opacity duration-[var(--dur-max)] [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_72%,transparent)] data-[ready]:opacity-100 ${className}`}
      style={{ height: "100%" }}
    />
  );
}
